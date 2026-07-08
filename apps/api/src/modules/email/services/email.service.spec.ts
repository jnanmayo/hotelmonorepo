import { EmailService } from '@/modules/email/services/email.service';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, it } from 'node:test';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
