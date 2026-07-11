import { IsUUID, IsOptional } from 'class-validator';

export class CreateUserRoleDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  roleId!: string;

  @IsOptional()
  @IsUUID()
  hotelId?: string;
}
