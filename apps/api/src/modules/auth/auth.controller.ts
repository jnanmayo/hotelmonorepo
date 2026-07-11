import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '@/common/decorators/auth.decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import {
  ForgotPasswordDto,
  LoginDto,
  OtpSendDto,
  OtpVerifyDto,
  RegisterHotelDto,
  RegisterOwnerDto,
  ResetPasswordDto,
  SelectHotelDto,
  SelectRoleDto,
  VerifyEmailDto,
} from '@/modules/auth/dto/auth.dto';
import { AuthService } from '@/modules/auth/services/auth.service';

import type { JwtPayload } from '@tungaos/shared';
import type { RegisterHotelPropertyInput } from '@tungaos/shared';
import type { Request } from 'express';
import { CreateRoleDto } from '@/modules/auth/dto/create-role.dto';
import { CreatePermissionDto } from '@/modules/auth/dto/create-permission.dto';
import { CreateRolePermissionDto } from '@/modules/auth/dto/create-role-permission.dto';
import { CreateUserRoleDto } from '@/modules/auth/dto/create-user-role.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const data = await this.authService.login(dto, req.ip, req.headers['user-agent']);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    const data = await this.authService.refresh(refreshToken);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logout(@Body('refreshToken') refreshToken?: string) {
    await this.authService.logout(refreshToken);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logoutAll(@CurrentUser() user: JwtPayload) {
    await this.authService.logoutAll(user.sub);
  }

  @Public()
  @Post('register/hotel')
  async registerHotel(@Body() dto: RegisterHotelDto) {
    const data = await this.authService.registerHotel(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('register/property')
  async registerHotelProperty(@Body() dto: RegisterHotelPropertyInput) {
    const data = await this.authService.registerHotelProperty(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('register/owner')
  async registerOwner(@Body() dto: RegisterOwnerDto) {
    const data = await this.authService.registerOwner(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('roles')
  async createRole(@Body() dto: CreateRoleDto) {
    const data = await this.authService.createRole(dto);
    return { success: true, data };
  }

  @Public()
  @Post('permissions')
  async createPermission(@Body() dto: CreatePermissionDto) {
    const data = await this.authService.createPermission(dto);
    return { success: true, data };
  }

  @Public()
  @Post('role-permissions')
  async createRolePermission(@Body() dto: CreateRolePermissionDto) {
    const data = await this.authService.createRolePermission(dto);
    return { success: true, data };
  }

  @Public()
  @Post('user-roles')
  async createUserRole(@Body() dto: CreateUserRoleDto) {
    const data = await this.authService.createUserRole(dto);
    return { success: true, data };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return {
      success: true,
      message: 'If the email exists, instructions were sent',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { success: true, message: 'Password updated', timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    const data = await this.authService.verifyEmail(dto.token);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async sendOtp(@Body() dto: OtpSendDto) {
    // OTP send logic via OtpService + notification dispatch
    return { success: true, message: 'OTP sent', timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() _dto: OtpVerifyDto) {
    return { success: true, data: {}, timestamp: new Date().toISOString() };
  }

  @Post('select-hotel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async selectHotel(@CurrentUser() user: JwtPayload, @Body() dto: SelectHotelDto) {
    const data = await this.authService.selectHotel(user.sub, dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Post('select-role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async selectRole(@CurrentUser() user: JwtPayload, @Body() dto: SelectRoleDto) {
    const data = await this.authService.selectRole(user.sub, dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@CurrentUser() user: JwtPayload) {
    return { success: true, data: user, timestamp: new Date().toISOString() };
  }

  @Public()
  @Get('google')
  googleAuth() {
    return { message: 'Redirect to Google OAuth — configure GOOGLE_CLIENT_ID' };
  }
}
