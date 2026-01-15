import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { SignalingService } from './services/SignalingService';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Initialize signaling service
const signalingService = new SignalingService(wss);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`FlowLink Signaling Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
