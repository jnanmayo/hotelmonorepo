import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to!: string;

  @IsOptional()
  @IsEmail()
  from?: string;

  @IsString()
  subject!: string;

  @IsString()
  html!: string;
}
