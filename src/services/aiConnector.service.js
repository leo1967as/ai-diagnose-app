// File: src/services/aiConnector.service.js
import 'dotenv/config';
import { diagnosisModel } from '../config/gemini.config.js';

/**
 * ฟังก์ชันสำหรับเรียกใช้ Google Gemini AI
 * @param {string} prompt - Prompt ที่จะส่งให้ AI
 * @returns {Promise<string>} - ผลลัพธ์ที่ได้จาก AI ในรูปแบบ JSON string
 */
async function generateWithGemini(prompt) {
    console.log("🔌 [Connector] กำลังส่งคำขอไปยัง Google Gemini AI...");
    const result = await diagnosisModel.generateContent(prompt);
    return result.response.text();
}

/**
 * ฟังก์ชันสำหรับเรียกใช้ Local LLM ที่มี API แบบ OpenAI
 * @param {string} prompt - Prompt ที่จะส่งให้ AI
 * @returns {Promise<string>} - ผลลัพธ์ที่ได้จาก AI ในรูปแบบ JSON string
 */
async function generateWithLocalLM(prompt) {
    console.log(`🔌 [Connector] กำลังส่งคำขอไปยัง Local LLM ที่: ${process.env.LOCAL_AI_ENDPOINT}`);
    
    const systemPrompt = `**บทบาทและเป้าหมาย (Role and Goal):** คุณคือ AI ที่ปรึกษาด้านสุขภาพเชิงวิเคราะห์ (Analytical Wellness Advisor) เป้าหมายเดียวของคุณคือการนำ "ข้อมูลทั้งหมด" ที่ให้มา ไปสร้างการวิเคราะห์ที่เชื่อมโยงกันอย่างสมเหตุสมผลและปลอดภัย สร้างผลลัพธ์เป็น JSON object ที่สมบูรณ์ตามโครงสร้างที่กำหนดเท่านั้น`;
    const userPrompt = prompt;

    const body = {
        model: "openai/gpt-oss-20b",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: -1,
        stream: false
    };

    try {
        const response = await fetch(process.env.LOCAL_AI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Local AI API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        console.log("🔍 [Connector] Full JSON response from Local LLM:", JSON.stringify(data, null, 2));

        // --- จุดที่แก้ไขให้ถูกต้อง ---
        // ตรวจสอบโครงสร้างข้อมูลที่ได้รับกลับมาให้ถูกต้องตาม Log ที่เห็น
        if (data.choices && data.choices[0] && data.choices[0].message && typeof data.choices[0].message.content === 'string') {
            
            const rawContent = data.choices[0].message.content;
            console.log("📄 [Connector] ได้รับ Raw response จาก Local LLM:\n", rawContent);

            // ใช้ Regex เพื่อดึงเฉพาะส่วนที่เป็น JSON ออกมา
            const jsonMatch = rawContent.match(/{[\s\S]*}/);

            if (jsonMatch && jsonMatch[0]) {
                console.log("✅ [Connector] ดึงข้อมูล JSON จาก Raw response สำเร็จ");
                return jsonMatch[0]; // คืนค่า String ของ JSON ที่สะอาดแล้ว
            } else {
                console.error("❌ [Connector] ไม่พบข้อมูล JSON ในการตอบกลับจาก Local LLM");
                throw new Error("Could not find a valid JSON object in the Local LLM response.");
            }
        } else {
            // ถ้าโครงสร้างไม่ถูกต้อง ให้โยน Error
            throw new Error("Invalid response structure from Local AI API");
        }
        // --- สิ้นสุดจุดที่แก้ไข ---

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ Local LLM:", error);
        throw error;
    }
}


/**
 * ฟังก์ชันสำหรับเรียกใช้ AI Model ผ่าน OpenRouter
 * @param {string} prompt - Prompt ที่จะส่งให้ AI
 * @returns {Promise<string>} - ผลลัพธ์ที่ได้จาก AI ในรูปแบบ JSON string
 */
async function generateWithOpenRouter(prompt) {
    const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
    console.log(`🔌 [Connector] กำลังส่งคำขอไปยัง OpenRouter...`);

    const systemPrompt = `**บทบาทและเป้าหมาย (Role and Goal):** ...`; // Prompt เดิมของคุณ
    const userPrompt = prompt;

    const body = {
        // --- สำคัญ: เลือกโมเดลที่ต้องการใช้จาก OpenRouter ---
        // ดูรายชื่อโมเดลทั้งหมดได้ที่ https://openrouter.ai/models
        model: "deepseek/deepseek-v4-pro",
        provider: {
            order: ["DeepSeek"],
            allow_fallbacks: false,
        },
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        // OpenRouter บางโมเดลรองรับการบังคับ JSON โดยตรง
        // response_format: { "type": "json_object" } 
    };

    try {
        const response = await fetch(OPENROUTER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // --- สำคัญ: เพิ่ม Authorization Header ---
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                // Header แนะนำโดย OpenRouter เพื่อระบุแอปของคุณ
                'HTTP-Referer': `http://localhost:${process.env.PORT}`, 
                'X-Title': `AI Diagnose App`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`OpenRouter API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        // โครงสร้าง Response เหมือนกับ OpenAI เป๊ะๆ โค้ดเดิมใช้ได้เลย
        if (data.choices && data.choices[0] && data.choices[0].message && typeof data.choices[0].message.content === 'string') {
            const rawContent = data.choices[0].message.content;
            const jsonMatch = rawContent.match(/{[\s\S]*}/);
            if (jsonMatch && jsonMatch[0]) {
                return jsonMatch[0];
            } else {
                throw new Error("Could not find a valid JSON object in the OpenRouter response.");
            }
        } else {
            throw new Error("Invalid response structure from OpenRouter API");
        }

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ OpenRouter:", error);
        throw error;
    }
}

/**
 * ฟังก์ชันหลักที่จะถูกเรียกจากภายนอก ทำหน้าที่เป็นตัวกลาง
 * @param {string} prompt - Prompt ที่จะส่งให้ AI
 * @returns {Promise<string>}
 */
async function generateContent(prompt) {
    const provider = (process.env.AI_PROVIDER || 'gemini').trim();

    if (provider === 'openrouter') { // <--- เพิ่มเงื่อนไขนี้
        return generateWithOpenRouter(prompt);
    } else if (provider === 'local') {
        return generateWithLocalLM(prompt);
    } else if (provider === 'gemini') {
        return generateWithGemini(prompt);
    } else {
        throw new Error(`AI Provider ที่ระบุไม่ถูกต้อง: "${provider}".`);
    }
}

export default { generateContent };