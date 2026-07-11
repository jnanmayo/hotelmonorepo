// dtos/create-role.dto.ts
import { IsString, IsOptional, IsUUID, IsEnum, MaxLength } from 'class-validator';
import { UserRoleType } from '@prisma/client'; // adjust import path

export class CreateRoleDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsEnum(UserRoleType)
  code!: UserRoleType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  hotelId?: string; // nullable for system roles
}
