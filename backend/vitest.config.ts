import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
    teardownTimeout: 30000,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'tests/'],
    },
    env: {
      NODE_ENV: 'test',
      ACCESS_TOKEN_SECRET: 'test-access-secret',
      REFRESH_TOKEN_SECRET: 'test-refresh-secret',
      CLOUDINARY_CLOUD_NAME: 'test-cloud',
      CLOUDINARY_API_KEY: 'test-key',
      CLOUDINARY_API_SECRET: 'test-secret',
      CLOUDINARY_FOLDER: 'hostelfix-test',
      EMAIL_PROVIDER: 'stub',
      LOG_LEVEL: 'silent',
      RATE_LIMIT_LOGIN_MAX: '1000',
      RATE_LIMIT_UPLOAD_MAX: '1000',
      RATE_LIMIT_ISSUE_MAX: '1000',
      RATE_LIMIT_COMMENT_MAX: '1000',
    },
  },
});
