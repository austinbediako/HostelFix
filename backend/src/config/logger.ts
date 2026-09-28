import pino from 'pino';
import { env, isProduction } from './environment.js';

export const logger = pino({
  level: env.logLevel,
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' },
      },
  base: {
    service: 'hostelfix-backend',
    environment: env.nodeEnv,
  },
});

export function getRequestLogger(requestId: string) {
  return logger.child({ requestId });
}
