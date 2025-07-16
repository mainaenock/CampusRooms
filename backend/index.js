import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import regRoutes from './routes/regRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import setupChat from './chatSocket.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// Serve uploads directory
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupChat(io);

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log('server listening from port: ', PORT);
  });
});

app.use('/cr/reg', regRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);