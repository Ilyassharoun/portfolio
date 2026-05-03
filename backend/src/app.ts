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
// CORS CONFIGURATION - FIXED
// ==========================================

// List of allowed origins
const allowedOrigins = [
  'https://ilyassharoun.site',
  'https://www.ilyassharoun.site',
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',  // Alternative local
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

// CORS options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, Swagger)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(null, true); // TEMPORARY: Allow all origins for debugging
      // Change to this once you confirm it works:
      // callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'Origin', 
    'X-Requested-With',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400, // 24 hours - cache preflight requests
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Additional headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow same-origin requests (Swagger)
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  next();
});

// Body parser middleware - IMPORTANT: Place after CORS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from origin: ${req.headers.origin || 'same-origin'}`);
  next();
});

// Setup Swagger
setupSwagger(app);

// Mount your routes under /api
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
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
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
  console.log(`💚 Health check at http://localhost:${port}/api/health`);
  console.log(`🌐 Allowed origins:`, allowedOrigins);
});