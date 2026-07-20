import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterHotelDto,
  RegisterOwnerDto,
  ResetPasswordDto,
  SelectHotelDto,
  SelectRoleDto,
} from '@/modules/auth/dto/auth.dto';
import { OtpService } from '@/modules/auth/services/otp.service';
import { PasswordService } from '@/modules/auth/services/password.service';
import { TokenService } from '@/modules/auth/services/token.service';

import { AUTH_DEFAULTS, type AuthUser, type LoginResponse } from '@tungaos/shared';
import type { RegisterHotelPropertyInput } from '@tungaos/shared';
import { CreateRoleDto } from '@/modules/auth/dto/create-role.dto';
import { CreatePermissionDto } from '@/modules/auth/dto/create-permission.dto';
import { CreateRolePermissionDto } from '@/modules/auth/dto/create-role-permission.dto';
import { CreateUserRoleDto } from '@/modules/auth/dto/create-user-role.dto';
import { CreateUserDto } from '@/modules/auth/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private passwordService: PasswordService,
    private otpService: OtpService,
    private configService: ConfigService,
  ) {}

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier.toLowerCase() }, { phone: dto.identifier }],
        deletedAt: null,
        isActive: true,
      },
      include: {
        userRoles: {
          where: { isActive: true },
          include: {
            role: {
              include: {
                rolePermissions: {
                  where: { isActive: true },
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.passwordService.checkAccountLock(user);

    const valid = await this.passwordService.verify(dto.password, user.passwordHash);
    if (!valid) {
      await this.passwordService.recordFailedAttempt(user.id);
      await this.recordLoginHistory(user.id, 'FAILED', ipAddress, userAgent, 'Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      return this.buildPartialResponse(user, { requiresEmailVerification: true });
    }

    if (user.isMfaEnabled) {
      await this.otpService.createOtp(user.email, 'EMAIL', 'MFA', user.id);
      return this.buildPartialResponse(user, { requiresMfa: true });
    }

    await this.passwordService.resetFailedAttempts(user.id);
    const tokens = await this.createSession(user, dto.rememberMe ?? false, ipAddress, userAgent);
    await this.recordLoginHistory(user.id, 'SUCCESS', ipAddress, userAgent);

    return {
      user: this.mapUser(user),
      tokens,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const hash = this.tokenService.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash: hash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
        isActive: true,
      },
      include: { user: { include: { userRoles: { include: { role: true } } } } },
    });

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = this.buildJwtPayload(stored.user);
    const accessToken = this.tokenService.generateAccessToken(payload);
    return { accessToken };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;
    const hash = this.tokenService.hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hash },
      data: { revokedAt: new Date() },
    });
  }

  async logoutAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async registerHotel(dto: RegisterHotelDto): Promise<{ hotelId: string }> {
    const existing = await this.prisma.hotel.findUnique({ where: { slug: dto.slug } });
    if (existing) {
      throw new BadRequestException('Hotel slug already taken');
    }

    const hotel = await this.prisma.hotel.create({
      data: {
        name: dto.hotelName,
        slug: dto.slug,
        city: dto.city,
        country: dto.country,
        phone: dto.phone,
        email: dto.email,
        status: 'PENDING_SETUP',
      },
    });

    return { hotelId: hotel.id };
  }

  async registerHotelProperty(dto: RegisterHotelPropertyInput): Promise<{ hotelId: string }> {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id: dto.hotelId, deletedAt: null, status: 'PENDING_SETUP' },
    });
    if (!hotel) {
      throw new BadRequestException('Hotel not found or property setup already completed');
    }

    const existingProperty = await this.prisma.building.count({
      where: { hotelId: dto.hotelId, deletedAt: null },
    });
    if (existingProperty > 0) {
      throw new BadRequestException('Property structure already configured for this hotel');
    }

    const roomTypeCodes = dto.roomTypes.map((rt) => rt.code);
    if (new Set(roomTypeCodes).size !== roomTypeCodes.length) {
      throw new BadRequestException('Duplicate room type codes');
    }

    const allRoomNumbers = dto.buildings.flatMap((b) =>
      b.floors.flatMap((f) => f.rooms.map((r) => r.roomNumber)),
    );
    if (new Set(allRoomNumbers).size !== allRoomNumbers.length) {
      throw new BadRequestException('Duplicate room numbers');
    }

    await this.prisma.$transaction(async (tx) => {
      const roomTypeIdByCode = new Map<string, string>();

      for (const roomType of dto.roomTypes) {
        const { amenityIds, ...data } = roomType;
        const created = await tx.roomType.create({
          data: { hotelId: dto.hotelId, ...data },
        });
        roomTypeIdByCode.set(roomType.code, created.id);

        if (amenityIds?.length) {
          await tx.roomTypeAmenity.createMany({
            data: amenityIds.map((amenityId) => ({
              hotelId: dto.hotelId,
              roomTypeId: created.id,
              amenityId,
            })),
          });
        }
      }

      for (const building of dto.buildings) {
        const { floors, ...buildingData } = building;
        const createdBuilding = await tx.building.create({
          data: { hotelId: dto.hotelId, ...buildingData },
        });

        for (const floor of floors) {
          const { rooms, ...floorData } = floor;
          const createdFloor = await tx.floor.create({
            data: {
              hotelId: dto.hotelId,
              buildingId: createdBuilding.id,
              ...floorData,
            },
          });

          for (const room of rooms) {
            const roomTypeId = roomTypeIdByCode.get(room.roomTypeCode);
            if (!roomTypeId) {
              throw new BadRequestException(`Unknown room type code: ${room.roomTypeCode}`);
            }

            const { roomTypeCode: _roomTypeCode, ...roomData } = room;
            await tx.room.create({
              data: {
                hotelId: dto.hotelId,
                floorId: createdFloor.id,
                roomTypeId,
                ...roomData,
              },
            });
          }
        }
      }
    });

    return { hotelId: dto.hotelId };
  }

  async registerOwner(dto: RegisterOwnerDto): Promise<{ userId: string }> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    this.passwordService.validatePolicy(dto.password);

    const hotel = await this.prisma.hotel.findFirst({
      where: { id: dto.hotelId, deletedAt: null },
    });
    if (!hotel) {
      throw new BadRequestException('Hotel not found');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        passwordHash,
      },
    });

    const ownerRole = await this.prisma.role.findFirst({
      where: { code: 'HOTEL_OWNER', isSystem: true },
    });

    if (ownerRole) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: ownerRole.id, hotelId: dto.hotelId },
      });
    }

    const roomCount = await this.prisma.room.count({
      where: { hotelId: dto.hotelId, deletedAt: null, isActive: true },
    });
    if (roomCount > 0) {
      await this.prisma.hotel.update({
        where: { id: dto.hotelId },
        data: { status: 'ACTIVE' },
      });
    }

    // Email verification token dispatched via notifications module
    return { userId: user.id };
  }
  async createUser(dto: CreateUserDto) {
    const { email, password, ...rest } = dto;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.passwordService.hash(password);

    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        ...rest,
        isEmailVerified: true, // default
        isSuperAdmin: false, // default
        isActive: true, // default
      },
    });
  }

  async createRole(dto: CreateRoleDto) {
    return this.prisma.role.create({ data: dto });
  }

  async createPermission(dto: CreatePermissionDto) {
    return this.prisma.permission.create({ data: dto });
  }

  async createRolePermission(dto: CreateRolePermissionDto) {
    return this.prisma.rolePermission.create({ data: dto });
  }

  async createUserRole(dto: CreateUserRoleDto) {
    return this.prisma.userRole.create({ data: dto });
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) return; // Silent success — prevent enumeration

    await this.otpService.createOtp(user.email, 'EMAIL', 'PASSWORD_RESET', user.id);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    this.passwordService.validatePolicy(dto.password);

    const reset = await this.prisma.passwordReset.findFirst({
      where: {
        tokenHash: this.tokenService.hashToken(dto.token),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!reset) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.passwordService.checkHistory(reset.userId, dto.password);
    const passwordHash = await this.passwordService.hash(dto.password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await this.passwordService.recordHistory(reset.userId, passwordHash);
    await this.logoutAll(reset.userId);
  }

  async verifyEmail(token: string): Promise<AuthUser> {
    const reset = await this.prisma.passwordReset.findFirst({
      where: {
        tokenHash: this.tokenService.hashToken(token),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!reset) {
      throw new BadRequestException('Invalid verification token');
    }

    const user = await this.prisma.user.update({
      where: { id: reset.userId },
      data: { isEmailVerified: true },
      include: { userRoles: { include: { role: true } } },
    });

    await this.prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    });

    return this.mapUser(user);
  }

  async selectHotel(userId: string, dto: SelectHotelDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user.isSuperAdmin) {
      const hasAccess = user.userRoles.some((ur) => ur.hotelId === dto.hotelId);
      if (!hasAccess) {
        throw new UnauthorizedException('No access to this hotel');
      }
    }

    const tokens = await this.createSession(user, false);
    return { user: { ...this.mapUser(user), hotelId: dto.hotelId as AuthUser['hotelId'] }, tokens };
  }

  async selectRole(userId: string, dto: SelectRoleDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });

    const hasRole = user.userRoles.some((ur) => ur.role.code === dto.roleCode);
    if (!hasRole && !user.isSuperAdmin) {
      throw new UnauthorizedException('Role not assigned');
    }

    const tokens = await this.createSession(user, false);
    return { user: this.mapUser(user), tokens };
  }

  private async createSession(
    user: {
      id: string;
      email: string;
      isSuperAdmin: boolean;
      userRoles: Array<{
        hotelId: string | null;
        role: { code: string; rolePermissions?: Array<{ permission: { key: string } }> };
      }>;
    },
    rememberMe: boolean,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const payload = this.buildJwtPayload(user);
    const tokens = this.tokenService.generateTokenPair(payload);
    const expiresAt = new Date(
      Date.now() +
        (rememberMe ? AUTH_DEFAULTS.rememberMeExpiry : AUTH_DEFAULTS.refreshTokenExpiry) * 1000,
    );
    const browser = userAgent?.slice(0, 100) ?? null;

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.tokenService.hashToken(tokens.refreshToken),
        ipAddress,
        deviceInfo: browser,
        expiresAt,
      },
    });
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        hotelId: payload.hotelId,
        ipAddress,
        browser: browser,
        rememberMe,
        expiresAt,
      },
    });

    return tokens;
  }

  private buildJwtPayload(user: {
    id: string;
    email: string;
    isSuperAdmin: boolean;
    userRoles: Array<{
      hotelId: string | null;
      role: { code: string; rolePermissions?: Array<{ permission: { key: string } }> };
    }>;
  }) {
    const roles = user.isSuperAdmin ? ['SUPER_ADMIN'] : user.userRoles.map((ur) => ur.role.code);

    const permissions = user.userRoles.flatMap(
      (ur) => ur.role.rolePermissions?.map((rp) => rp.permission.key) ?? [],
    );

    const hotelId = user.userRoles.find((ur) => ur.hotelId)?.hotelId ?? null;

    return {
      sub: user.id as AuthUser['id'],
      email: user.email,
      hotelId: hotelId as AuthUser['hotelId'],
      roles: [...new Set(roles)],
      permissions: [...new Set(permissions)],
    };
  }

  private mapUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
    isEmailVerified: boolean;
    isMfaEnabled: boolean;
    userRoles: Array<{ hotelId: string | null; role: { code: string } }>;
  }): AuthUser {
    const payload = this.buildJwtPayload(user);
    return {
      id: user.id as AuthUser['id'],
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hotelId: payload.hotelId,
      roles: payload.roles,
      permissions: payload.permissions,
      isSuperAdmin: user.isSuperAdmin,
      isEmailVerified: user.isEmailVerified,
      isMfaEnabled: user.isMfaEnabled,
    };
  }

  private buildPartialResponse(
    user: Parameters<AuthService['mapUser']>[0],
    flags: Partial<Pick<LoginResponse, 'requiresMfa' | 'requiresEmailVerification'>>,
  ): LoginResponse {
    return {
      user: this.mapUser(user),
      tokens: { accessToken: '', refreshToken: '', expiresIn: 0 },
      ...flags,
    };
  }

  private async recordLoginHistory(
    userId: string,
    status: 'SUCCESS' | 'FAILED',
    ipAddress?: string,
    userAgent?: string,
    failureReason?: string,
  ): Promise<void> {
    await this.prisma.loginHistory.create({
      data: {
        userId,
        status,
        ipAddress,
        userAgent,
        failureReason,
      },
    });
  }
}
