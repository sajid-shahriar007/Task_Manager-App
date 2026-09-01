import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import taskRoutes from './routes/task.routes.js';
import categoryRoutes from './routes/category.routes.js';
import authRoutes from './routes/authRoutes.js';
import swaggerRoutes from './routes/swagger.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
const app = express();
app.use(helmet());
app.use(cors({
  origin: env.corsOrigins,
  credentials: true
}));
app.use(express.json({
  limit: '100kb'
}));
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

// Basic abuse protection — 300 requests / 15 min per IP.
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
}));
app.get('/health', (_req, res) => res.json({
  status: 'ok'
}));
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use(swaggerRoutes); // serves /docs
app.use(notFound);
app.use(errorHandler);
export default app;