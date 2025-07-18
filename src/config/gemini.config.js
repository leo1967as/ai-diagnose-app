// File: src/config/gemini.config.js
import 'dotenv/config'; // Make sure environment variables are loaded
import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment Check - Fail fast if key is missing
if (!process.env.GEMINI_API_KEY) {
    throw new Error("FATAL ERROR: GEMINI_API_KEY is not defined in your .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a specific model instance for our diagnosis task
const diagnosisModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { response_mime_type: "application/json" }
});

export { diagnosisModel };