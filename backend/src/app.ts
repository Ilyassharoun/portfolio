import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupSwagger } from './swagger';
import mongoose from 'mongoose';
import routes from './routes/routes';
import connectDB from './config/db';

// Load environment variables FIRST
dotenv.config();
connectDB();

mongoose.connection.on('connected', () => {
  console.log('\n📦 MongoDB Connection Details:');
  console.log('=================================');
  console.log(`✅ Status: Connected`);
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🔌 Host: ${mongoose.connection.host}`);
  console.log(`🎯 Port: ${mongoose.connection.port}`);
  console.log(`🔄 Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log('=================================\n');
});

mongoose.connection.on('error', (err) => {
  console.error('\n❌ MongoDB Connection Error:');
  console.error('=================================');
  console.error(err);
  console.error('=================================\n');
});

mongoose.connection.on('disconnected', () => {
  console.log('\n⚠️ MongoDB Disconnected');
  console.log('=================================\n');
});

const app = express();
const port = process.env.PORT || 3000;

// ==========================================
// CORS CONFIGURATION
// ==========================================
const allowedOrigins = [
  'https://ilyassharoun.site',
  'https://www.ilyassharoun.site',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

// Apply CORS middleware - this automatically handles OPTIONS preflight
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Swagger, Postman, curl, mobile apps)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(null, true); // Allow all for debugging
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Cache-Control', 'Pragma'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204,
}));

// DO NOT use app.options() - the cors middleware handles it automatically

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from origin: ${req.headers.origin || 'same-origin'}`);
  next();
});

// Setup Swagger
setupSwagger(app);

// Mount routes
app.use('/api', routes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Server is running', 
    docs: `/api-docs`,
    health: `/api/health`
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ 
    message: 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api-docs`);
});