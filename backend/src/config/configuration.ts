export interface AppConfig {
  env: string;
  port: number;
  apiPrefix: string;
  databaseUrl: string;
  redisUrl: string;
  redisTls: boolean;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
  cookie: {
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
  };
  clientUrl: string;
  ai: {
    provider: 'openai' | 'mock';
    openaiApiKey: string;
    openaiModel: string;
    openaiMaxTokens: number;
  };
  ocr: {
    provider: 'tesseract' | 'google_vision';
    maxPages: number;
    maxChars: number;
    googleApplicationCredentials: string;
  };
  storage: {
    provider: 'local' | 's3' | 'cloudinary';
    localStoragePath: string;
    publicStorageBaseUrl: string;
    s3Region: string;
    s3Bucket: string;
    s3AccessKeyId: string;
    s3SecretAccessKey: string;
    s3Endpoint: string;
    cloudinaryCloudName: string;
    cloudinaryApiKey: string;
    cloudinaryApiSecret: string;
  };
  email: {
    provider: 'console' | 'ethereal' | 'smtp';
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    smtpSecure: boolean;
    from: string;
    devRecipient: string;
  };
  throttle: {
    ttl: number;
    limit: number;
  };
  queue: {
    concurrency: number;
    attempts: number;
    backoff: number;
  };
}

export const configuration = (): AppConfig => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  databaseUrl: process.env.DATABASE_URL as string,
  redisUrl: process.env.REDIS_URL as string,
  redisTls: process.env.REDIS_TLS === 'true',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: (process.env.COOKIE_SAME_SITE ?? 'lax') as 'lax' | 'strict' | 'none',
  },
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  ai: {
    provider: (process.env.AI_PROVIDER ?? 'mock') as 'openai' | 'mock',
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    openaiMaxTokens: parseInt(process.env.OPENAI_MAX_TOKENS ?? '6000', 10),
  },
  ocr: {
    provider: (process.env.OCR_PROVIDER ?? 'tesseract') as 'tesseract' | 'google_vision',
    maxPages: parseInt(process.env.OCR_MAX_PAGES ?? '20', 10),
    maxChars: parseInt(process.env.OCR_MAX_CHARS ?? '60000', 10),
    googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '',
  },
  storage: {
    provider: (process.env.STORAGE_PROVIDER ?? 'local') as 'local' | 's3' | 'cloudinary',
    localStoragePath: process.env.LOCAL_STORAGE_PATH ?? './storage/uploads',
    publicStorageBaseUrl: process.env.PUBLIC_STORAGE_BASE_URL ?? '',
    s3Region: process.env.S3_REGION ?? 'us-east-1',
    s3Bucket: process.env.S3_BUCKET ?? 'ai-medcheck-uploads',
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    s3Endpoint: process.env.S3_ENDPOINT ?? '',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
  email: {
    provider: (process.env.EMAIL_PROVIDER ?? 'console') as 'console' | 'ethereal' | 'smtp',
    smtpHost: process.env.SMTP_HOST ?? '',
    smtpPort: parseInt(process.env.SMTP_PORT ?? '587', 10),
    smtpUser: process.env.SMTP_USER ?? '',
    smtpPass: process.env.SMTP_PASS ?? '',
    smtpSecure: process.env.SMTP_SECURE === 'true',
    from: process.env.EMAIL_FROM ?? 'AI MedCheck <no-reply@aimedcheck.com>',
    devRecipient: process.env.DEV_EMAIL_RECIPIENT ?? '',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
  queue: {
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY ?? '2', 10),
    attempts: parseInt(process.env.QUEUE_ATTEMPTS ?? '3', 10),
    backoff: parseInt(process.env.QUEUE_BACKOFF ?? '5000', 10),
  },
});
