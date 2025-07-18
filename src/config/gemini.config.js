// File: src/config/gemini.config.js (Final Version)

import 'dotenv/config'; 
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("FATAL ERROR: GEMINI_API_KEY is not defined in your .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ลบ generationConfig ออก เพื่อปิดการใช้งาน JSON Mode
const diagnosisModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

export { diagnosisModel };