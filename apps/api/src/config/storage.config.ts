import { registerAs } from '@nestjs/config';

export const storageConfig = registerAs('storage', () => ({
  awsRegion: process.env.AWS_REGION ?? 'ap-south-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  s3Bucket: process.env.AWS_S3_BUCKET ?? 'tungaos-assets',
  cloudfrontUrl: process.env.AWS_CLOUDFRONT_URL ?? '',
}));

export type StorageConfig = ReturnType<typeof storageConfig>;
