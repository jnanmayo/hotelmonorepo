import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @MaxLength(50)
  module!: string;

  @IsString()
  @MaxLength(50)
  resource!: string;

  @IsString()
  @MaxLength(50)
  action!: string;

  @IsString()
  @MaxLength(150)
  key!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
