import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  identifier!: string;

  @IsString()
  @MinLength(1)
  password!: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;

  @IsString()
  @IsOptional()
  captchaToken?: string;
}

export class RegisterHotelDto {
  @IsString()
  hotelName!: string;

  @IsString()
  slug!: string;

  @IsString()
  country!: string;

  @IsString()
  city!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  email!: string;
}

export class RegisterOwnerDto {
  @IsUUID()
  hotelId!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  @MinLength(12)
  password!: string;

  @IsString()
  confirmPassword!: string;

  @IsBoolean()
  acceptTerms!: boolean;
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(12)
  password!: string;

  @IsString()
  confirmPassword!: string;
}

export class VerifyEmailDto {
  @IsString()
  token!: string;
}

export class OtpVerifyDto {
  @IsString()
  @MinLength(6)
  code!: string;
}

export class OtpSendDto {
  @IsEnum(['EMAIL', 'SMS', 'WHATSAPP'])
  channel!: 'EMAIL' | 'SMS' | 'WHATSAPP';
}

export class SelectHotelDto {
  @IsString()
  hotelId!: string;
}

export class SelectRoleDto {
  @IsString()
  roleCode!: string;
}
