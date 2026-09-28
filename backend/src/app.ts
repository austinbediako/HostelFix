import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { env } from './config/environment.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import hallRoutes from './modules/residences/hall.routes.js';
import issueRoutes from './modules/issues/issue.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import auditLogRoutes from './modules/audit-logs/audit-log.routes.js';
import uploadRoutes from './modules/uploads/upload.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());
  app.use(requestIdMiddleware);

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'hostelfix-backend' });
  });

  const apiRouter = express.Router();
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/users', userRoutes);
  apiRouter.use('/halls', hallRoutes);
  apiRouter.use('/issues', issueRoutes);
  apiRouter.use('/analytics', analyticsRoutes);
  apiRouter.use('/audit-logs', auditLogRoutes);
  apiRouter.use('/uploads', uploadRoutes);
  apiRouter.use('/settings', settingsRoutes);

  app.use('/api/v1', apiRouter);

  const openapiPath = path.resolve(__dirname, '../docs/openapi.yaml');
  const openapiDocument = YAML.load(openapiPath);
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
