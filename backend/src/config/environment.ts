import dotenv from 'dotenv';

dotenv.config();

function getString(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getNumber(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) throw new Error(`Environment variable ${key} must be a number`);
  return parsed;
}

function getBoolean(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  return value === 'true';
}

export const env = {
  nodeEnv: getString('NODE_ENV', 'development'),
  port: getNumber('PORT', 5000),
  mongodbUri: getString('MONGODB_URI', 'mongodb://127.0.0.1:27017/hostelfix'),

  accessTokenSecret: getString('ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: getString('REFRESH_TOKEN_SECRET'),
  accessTokenExpiry: getString('ACCESS_TOKEN_EXPIRY', '15m'),
  refreshTokenExpiry: getString('REFRESH_TOKEN_EXPIRY', '7d'),
  bcryptRounds: getNumber('BCRYPT_ROUNDS', 12),

  cookieSecure: getBoolean('COOKIE_SECURE', false),
  cookieSameSite: getString('COOKIE_SAMESITE', 'Lax') as 'Lax' | 'Strict' | 'None',
  corsOrigin: getString('CORS_ORIGIN', 'http://localhost:3000'),

  cloudinaryCloudName: getString('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey: getString('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: getString('CLOUDINARY_API_SECRET'),
  cloudinaryFolder: getString('CLOUDINARY_FOLDER', 'hostelfix'),

  emailProvider: getString('EMAIL_PROVIDER', 'stub') as 'stub' | 'sendgrid' | 'smtp',
  emailFrom: getString('EMAIL_FROM', 'noreply@hostelfix.ug.edu.gh'),
  sendgridApiKey: getString('SENDGRID_API_KEY', ''),
  smtpHost: getString('SMTP_HOST', ''),
  smtpPort: getNumber('SMTP_PORT', 587),
  smtpUser: getString('SMTP_USER', ''),
  smtpPass: getString('SMTP_PASS', ''),

  rateLimitLoginWindowMs: getNumber('RATE_LIMIT_LOGIN_WINDOW_MS', 15 * 60 * 1000),
  rateLimitLoginMax: getNumber('RATE_LIMIT_LOGIN_MAX', 5),
  rateLimitUploadWindowMs: getNumber('RATE_LIMIT_UPLOAD_WINDOW_MS', 15 * 60 * 1000),
  rateLimitUploadMax: getNumber('RATE_LIMIT_UPLOAD_MAX', 10),
  rateLimitIssueWindowMs: getNumber('RATE_LIMIT_ISSUE_WINDOW_MS', 15 * 60 * 1000),
  rateLimitIssueMax: getNumber('RATE_LIMIT_ISSUE_MAX', 20),
  rateLimitCommentWindowMs: getNumber('RATE_LIMIT_COMMENT_WINDOW_MS', 15 * 60 * 1000),
  rateLimitCommentMax: getNumber('RATE_LIMIT_COMMENT_MAX', 30),

  logLevel: getString('LOG_LEVEL', 'info'),

  resolveDisputeWindowHours: getNumber('RESOLVE_DISPUTE_WINDOW_HOURS', 48),

  systemAdminEmail: getString('SYSTEM_ADMIN_EMAIL', 'admin@hostelfix.ug.edu.gh'),
  systemAdminPassword: getString('SYSTEM_ADMIN_PASSWORD', ''),
};

export const isProduction = env.nodeEnv === 'production';
export const isTest = env.nodeEnv === 'test';
