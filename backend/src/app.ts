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

// Allowed origins for CORS
const allowedOrigins = [
  'https://ilyassharoun.site',
  'https://www.ilyassharoun.site',
  'http://localhost:5173',
  'http://localhost:3000',
];

// CORS middleware (handles OPTIONS automatically)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Swagger, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // For now, allow all origins to eliminate CORS as a factor
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup Swagger
setupSwagger(app);

// Mount routes under /api
app.use('/api', routes);

// Root health check
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running', docs: '/api-docs' });
});

// Additional route-level health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});