// File: server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import diagnosisRoutes from './src/api/diagnosis.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---

// Define the allowed origin
const corsOptions = {
  origin: 'https://ai-medic-mockup.vercel.app'
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