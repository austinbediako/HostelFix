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

  app.set('trust proxy', 1);

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

  app.get('/', (_req: Request, res: Response) => {
    res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HostelFix API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: #0a0f0d; color: #e7ecea; padding: 24px;
    }
    .card {
      max-width: 560px; width: 100%; padding: 40px;
      background: #101815; border: 1px solid #1e2b25; border-radius: 16px;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 500; color: #4ade80;
      background: #14241d; border: 1px solid #1f3a2d;
      padding: 5px 12px; border-radius: 999px; margin-bottom: 20px;
    }
    .badge::before {
      content: ""; width: 8px; height: 8px; border-radius: 50%;
      background: #4ade80; box-shadow: 0 0 8px #4ade80;
    }
    h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
    h1 span { color: #4ade80; }
    p { margin-top: 10px; color: #9fb3aa; line-height: 1.6; font-size: 15px; }
    .links { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
    a {
      display: inline-block; padding: 10px 18px; border-radius: 10px;
      font-size: 14px; font-weight: 600; text-decoration: none;
    }
    a.primary { background: #4ade80; color: #0a0f0d; }
    a.secondary { border: 1px solid #2a3b33; color: #e7ecea; }
    a:hover { filter: brightness(1.1); }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 13px; color: #7dd3a8; background: #14211c;
      padding: 2px 6px; border-radius: 6px;
    }
    .meta { margin-top: 28px; padding-top: 20px; border-top: 1px solid #1e2b25; font-size: 13px; color: #6b7f75; }
  </style>
</head>
<body>
  <main class="card">
    <div class="badge">API online</div>
    <h1>HostelFix<span> API</span></h1>
    <p>Maintenance reporting and tracking for University of Ghana Legon halls.
       The API base path is <code>/api/v1</code>.</p>
    <div class="links">
      <a class="primary" href="/api/v1/docs">API Documentation</a>
      <a class="secondary" href="/health">Health Check</a>
    </div>
    <div class="meta">hostelfix-backend &middot; ${env.nodeEnv} &middot; <a href="https://github.com/austinbediako/HostelFix" style="color:#6b7f75">GitHub</a></div>
  </main>
</body>
</html>`);
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
