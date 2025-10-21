import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './src/config/db.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import wishlistRoutes from './src/routes/wishlistRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import settingsRoutes from './src/routes/settingsRoutes.js';

dotenv.config();

const app = express();

// Security & parsers
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// CORS
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : [allowedOrigin],
    credentials: true,
  })
);

// Rate limiter for auth & payment
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', authLimiter);
app.use('/api/payment', authLimiter);

// Routes
app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/settings', settingsRoutes);

// 404 and error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });


