import { EmailConfig } from '@/config/email.config';
import { SendEmailDto } from '@/modules/email/dto/send-email.dto';
import { SendEmailResponseDto } from '@/modules/email/dto/send-email.response.dto';
import { SendOtpDto } from '@/modules/email/dto/send-otp.dto';
import { SendOtpResponseDto } from '@/modules/email/dto/send-otp.response.dto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter;
  private readonly emailConfig: EmailConfig;

  constructor(private readonly configService: ConfigService) {
    const emailConfig = this.configService.get<EmailConfig>('email');
    if (!emailConfig) {
      throw new Error('Email configuration not found');
    }
    this.emailConfig = emailConfig;

    this.transporter = nodemailer.createTransport({
      host: emailConfig?.host,
      port: emailConfig?.port,
      secure: emailConfig?.secure,
      auth: emailConfig?.auth,
    });
  }

  async sendEmail(dto: SendEmailDto): Promise<SendEmailResponseDto> {
    try {
      const info = await this.transporter.sendMail({
        from: dto.from ?? this.emailConfig.from,
        to: dto.to,
        subject: dto.subject,
        html: dto.html,
      });

      return {
        success: true,
        message: 'Email sent successfully.',
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error(error);

      return {
        success: false,
        message: 'Failed to send email.',
      };
    }
  }

  async sendOtp(dto: SendOtpDto): Promise<SendOtpResponseDto> {
    const html = `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>

      <h1 style="letter-spacing:4px">
        ${dto.otp}
      </h1>

      <p>This code expires in 10 minutes.</p>
    `;

    const response = await this.sendEmail({
      to: dto.to,
      subject: 'Verify your email',
      html,
    });

    return {
      success: response.success,
      message: response.success
        ? 'Email verification token dispatched via notifications module.'
        : 'Unable to dispatch verification email.',
    };
  }
}
