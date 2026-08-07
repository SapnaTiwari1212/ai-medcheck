import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(4000),
  API_PREFIX: Joi.string().default('api'),

  DATABASE_URL: Joi.string().required(),

  REDIS_URL: Joi.string().required(),
  REDIS_TLS: Joi.boolean().default(false),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  COOKIE_SECURE: Joi.boolean().default(false),
  COOKIE_SAME_SITE: Joi.string().valid('lax', 'strict', 'none').default('lax'),

  CLIENT_URL: Joi.string().uri().default('http://localhost:5173'),

  AI_PROVIDER: Joi.string().valid('openai', 'mock').default('mock'),
  OPENAI_API_KEY: Joi.string().allow('').optional(),
  OPENAI_MODEL: Joi.string().default('gpt-4o-mini'),
  OPENAI_MAX_TOKENS: Joi.number().default(6000),

  OCR_PROVIDER: Joi.string().valid('tesseract', 'google_vision').default('tesseract'),
  OCR_MAX_PAGES: Joi.number().default(20),
  OCR_MAX_CHARS: Joi.number().default(60000),
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string().allow('').optional(),

  STORAGE_PROVIDER: Joi.string().valid('local', 's3', 'cloudinary').default('local'),
  LOCAL_STORAGE_PATH: Joi.string().default('./storage/uploads'),
  PUBLIC_STORAGE_BASE_URL: Joi.string().uri().allow('').optional(),

  S3_REGION: Joi.string().default('us-east-1'),
  S3_BUCKET: Joi.string().default('ai-medcheck-uploads'),
  S3_ACCESS_KEY_ID: Joi.string().allow('').optional(),
  S3_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
  S3_ENDPOINT: Joi.string().allow('').optional(),

  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),
  CLOUDINARY_API_KEY: Joi.string().allow('').optional(),
  CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),

  EMAIL_PROVIDER: Joi.string().valid('console', 'ethereal', 'smtp').default('console'),
  SMTP_HOST: Joi.string().allow('').optional(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASS: Joi.string().allow('').optional(),
  SMTP_SECURE: Joi.boolean().default(false),
  EMAIL_FROM: Joi.string().default('AI MedCheck <no-reply@aimedcheck.com>'),
  DEV_EMAIL_RECIPIENT: Joi.string().allow('').optional(),

  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),

  QUEUE_CONCURRENCY: Joi.number().default(2),
  QUEUE_ATTEMPTS: Joi.number().default(3),
  QUEUE_BACKOFF: Joi.number().default(5000),

  TEST_DATABASE_URL: Joi.string().allow('').optional(),
});
