// File: server.js
import 'dotenv/config'; // ต้อง import ก่อนใครเพื่อน
import express from 'express';
import cors from 'cors'; // import cors
import diagnosisRoutes from './src/api/diagnosis.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors()); // ใช้งาน cors middleware
app.use(express.json()); 
app.use(express.static('public'));

// --- API Routes ---
app.use('/api', diagnosisRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});