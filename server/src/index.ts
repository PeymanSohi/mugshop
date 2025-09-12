import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:8080', 'https://your-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'خطای اعتبارسنجی', 
      details: Object.values(error.errors).map((err: any) => err.message) 
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'شناسه نامعتبر' });
  }
  
  if (error.code === 11000) {
    return res.status(400).json({ message: 'داده تکراری - این مقدار قبلاً وجود دارد' });
  }

  res.status(500).json({ message: 'خطای داخلی سرور' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'مسیر یافت نشد' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Admin Panel: http://localhost:${PORT}/X9fL2qRv8tZw`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});