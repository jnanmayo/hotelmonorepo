import { IsEmail, IsString } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  to!: string;

  @IsString()
  otp!: string;
}
