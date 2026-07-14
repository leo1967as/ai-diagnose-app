// File: server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import diagnosisRoutes from './src/api/diagnosis.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---

// Define the allowed origin for development and production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || 'https://your-app.vercel.app'] // แทนที่ด้วย URL จริงของ Vercel app
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5500/']; // รองรับ Vite และเดิม

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Use the cors middleware with the specific options
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));

// --- API Routes ---
app.use('/api', diagnosisRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Note: If you are using ES Modules (import/export), you should use 'export default app;'
// instead of 'module.exports = app;'. However, based on your imports, the current structure seems fine.
export default app; // Or stick with module.exports if you have a reason for it.