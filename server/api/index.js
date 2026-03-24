// Vercel serverless entry — Express app without httpServer.listen()
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes         from '../routes/auth.js';
import courseRoutes       from '../routes/courses.js';
import productRoutes      from '../routes/products.js';
import galleryRoutes      from '../routes/gallery.js';
import orderRoutes        from '../routes/orders.js';
import registrationRoutes from '../routes/registrations.js';
import contactRoutes      from '../routes/contact.js';

dotenv.config();

const app = express();

// Dummy io so routes that call io.to(...).emit(...) don't crash
const io = { to: () => ({ emit: () => {} }) };
app.set('io', io);

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB — cache connection across serverless invocations
let _connected = false;
async function connectDB() {
  if (_connected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI);
  _connected = true;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth',          authRoutes);
app.use('/api/courses',       courseRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/gallery',       galleryRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/contact',       contactRoutes);

app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', env: 'vercel', time: new Date() })
);

export default app;
