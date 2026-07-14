// File: src/config/gemini.config.js
import 'dotenv/config'; // Make sure environment variables are loaded
import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment Check - Fail fast ONLY if gemini is the selected provider and key is missing
if (process.env.AI_PROVIDER === 'gemini' && !process.env.GEMINI_API_KEY) {
    throw new Error("FATAL ERROR: AI_PROVIDER is set to 'gemini' but GEMINI_API_KEY is not defined in your .env file.");
}

// ใช้ let เพื่อให้สามารถเป็น null ได้
let genAI = null;
let diagnosisModel = null;

// สร้าง instance ต่อเมื่อมี API Key เท่านั้น
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Create a specific model instance for our diagnosis task
    diagnosisModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { response_mime_type: "application/json" }
    });
}

export { diagnosisModel };