// src/server.ts
import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database';
import { setupSwagger } from './config/swagger';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Connect to database
connectDB();

// Middleware
// ✅ Fix: Configure helmet with CSP for Swagger
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://unpkg.com"]
      }
    }
  })
);

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Get base URL from environment or construct from request
const getBaseUrl = (req: express.Request): string => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

// Root route
app.get('/', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.json({
    success: true,
    message: 'Welcome to Marketplace API',
    version: '1.0.0',
    documentation: `${baseUrl}/api-docs`,
    endpoints: {
      // Authentication
      registerCustomer: 'POST /api/auth/register/customer',
      registerSupermarketOwner: 'POST /api/auth/register/supermarket',
      login: 'POST /api/auth/login',
      refreshToken: 'POST /api/auth/refresh-token',
      
      // User
      getMe: 'GET /api/auth/me',
      updatePassword: 'PUT /api/auth/update-password',
      updateProfile: 'PUT /api/auth/update-profile',
      
      // Supermarket
      nearbySupermarkets: 'GET /api/auth/supermarkets/nearby',
      
      // Admin
      adminOnly: 'GET /api/auth/admin-only'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Export app for Vercel
export default app;

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    console.log(`📚 API Documentation: ${baseUrl}/api-docs`);
  });
}