import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import regRoutes from './routes/regRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import flagRoutes from './routes/flagRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import setupChat from './chatSocket.js';
import chatRoutes from './routes/chatRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { authLimiter, generalApiLimiter } from './middlewares/rateLimiter.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1); // Trust first proxy for correct client IP handling
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://campusroomske.netlify.app/", // Netlify
  "https://campus-rooms.vercel.app/",  // Vercel
  "https://your-custom-domain.com"     // Custom domain
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
// Serve uploads directory
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register all routes before starting the server
app.use('/api/listings', generalApiLimiter, listingRoutes);
app.use('/api/admin', generalApiLimiter, adminRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/cr/reg', regRoutes);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

setupChat(io);

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log('server listening from port: ', PORT);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});