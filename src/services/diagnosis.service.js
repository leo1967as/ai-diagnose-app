// src/services/diagnosis.service.js
// File: src/services/diagnosis.service.js
import { diagnosisModel } from '../config/gemini.config.js';

// --- Helper Function: Calculate BMI (ไม่มีการแก้ไข) ---
const calculateBMI = (weight, height) => {
    if (!weight || !height || height <= 0) return { value: 0, category: 'ข้อมูลไม่ถูกต้อง' };
    const heightInMeters = parseFloat(height) / 100;
    const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);
    let category = '';
    if (bmiValue < 18.5) category = 'น้ำหนักน้อยกว่าเกณฑ์';
    else if (bmiValue < 23) category = 'น้ำหนักปกติ (สมส่วน)';
    else if (bmiValue < 25) category = 'น้ำหนักเกิน';
    else if (bmiValue < 30) category = 'โรคอ้วนระดับที่ 1';
    else category = 'โรคอ้วนระดับที่ 2 (อันตราย)';
    return { value: bmiValue, category: category };
};
// --- Helper Function: ย้ายเข้ามาอยู่ใน Service Layer ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Helper Function: AI Analysis (ไม่มีการแก้ไข) ---
function extractJsonFromMarkdown(text) {
    // พยายามหา JSON ที่อยู่ใน ```json ... ```
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        return match[1];
    }
    // กรณีฉุกเฉิน: ถ้า AI ตอบมาเป็น JSON ตรงๆ โดยไม่มี Markdown
    if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
        return text;
    }
    return null; // ถ้าไม่พบในรูปแบบใดเลย
}

async function getAiAnalysis(userData) {
    // 1. เตรียม Context ที่เป็นภาษาพูดที่เป็นธรรมชาติ
    let profileContext = `ตอนนี้ฉันยังไม่มีข้อมูลสุขภาพพื้นฐานของคุณนะ`;
    if (userData.health_profile) {
        const parts = [];
        if (userData.health_profile.chronic_conditions?.length) parts.push(`ปกติแล้วฉันมีโรคประจำตัวคือ ${userData.health_profile.chronic_conditions.join(', ')}`);
        if (userData.health_profile.lifestyle_factors?.length) parts.push(`ไลฟ์สไตล์ของฉันคือ ${userData.health_profile.lifestyle_factors.join(', ')}`);
        if (userData.health_profile.additional_notes) parts.push(`มีเรื่องสำคัญคือ "${userData.health_profile.additional_notes}"`);
        
        if (parts.length > 0) {
            profileContext = `ฉันขอให้ข้อมูลสุขภาพพื้นฐานของฉันไว้ด้วยนะ: ${parts.join('. ')}.`;
        }
    }

    const fullUserInput = `
        สวัสดี, ฉันชื่อ ${userData.name}, อายุ ${userData.age} ปี เพศ ${userData.sex}. 
        ค่า BMI ของฉันคือ ${userData.bmi.value} (${userData.bmi.category}).
        ${profileContext}
        ตอนนี้ฉันมีอาการคือ "${userData.symptoms}". 
        ฉันเป็นแบบนี้มาประมาณ ${userData.symptom_duration} แล้ว 
        ส่วนอาหารมื้อล่าสุดที่กินไปคือ "${userData.previous_meal}".
    `;

    // 2. พิมพ์ Context เพื่อการ Debug
    console.log("🤖 [Prompt V8 - Data Organizer] กำลังส่ง User Input:\n", fullUserInput);

    // 2. สร้าง System Instruction ที่เน้นบทบาทใหม่
    const systemInstruction = {
        role: "system",
        parts: [{
            text: `
              **บทบาท (ROLE):** คุณคือ AI สำหรับจัดระเบียบข้อมูลสุขภาพ (Health Data Structuring AI)
              **ภารกิจ (TASK):** รับข้อมูลดิบเกี่ยวกับผู้ใช้มา แล้วทำการ "จัดหมวดหมู่" และ "สรุปความเชื่อมโยงที่เป็นไปได้" ออกมาเป็นโครงสร้าง JSON ที่กำหนดเท่านั้น ห้ามแสดงความคิดเห็นหรือให้คำแนะนำทางการแพทย์โดยตรง
              
              **ข้อบังคับในการตอบกลับ (MANDATORY OUTPUT FORMAT):**
              - ต้องตอบกลับเป็น JSON object ที่สมบูรณ์เท่านั้น
              - ต้องห่อ (wrap) JSON ทั้งหมดด้วย Markdown code block: \`\`\`json\n{ ... }\n\`\`\`
              
              **โครงสร้าง JSON ที่ต้องส่งออก (MANDATORY JSON STRUCTURE):**
              {
                "primary_assessment": "สรุปข้อมูลที่ผู้ใช้ให้มาทั้งหมดอย่างเป็นกลาง และตั้งข้อสังเกตถึงความเชื่อมโยงเบื้องต้น โดยอ้างอิงถึงข้อมูลโปรไฟล์สุขภาพด้วย",
                "risk_analysis": [{"condition": "...", "risk_level": "...", "rationale": "สรุปว่าข้อมูลต่างๆ (อาการ, โปรไฟล์) มีความสัมพันธ์กับภาวะนี้อย่างไรตามหลักการทั่วไป"}],
                "personalized_care": {
                  "immediate_actions": ["ลิสต์ 'สิ่งพื้นฐานที่คนมักทำ' เพื่อบรรเทาอาการประเภทนี้"],
                  "general_wellness": ["ลิสต์ 'แนวทางการดูแลสุขภาพทั่วไป' ที่สัมพันธ์กับข้อมูลโปรไฟล์ของผู้ใช้"],
                  "activity_guidance": { "recommended": ["..."], "to_avoid": ["..."] }
                },
                "dietary_recommendations": {
                  "concept": "สรุป 'หลักการโภชนาการพื้นฐาน' ที่เกี่ยวข้องกับอาการและข้อมูลโปรไฟล์",
                  "foods_to_eat": { ... },
                  "foods_to_avoid": ["..."]
                },
                "red_flags": ["ลิสต์ 'สัญญาณ' ที่โดยทั่วไปแล้วควรไปพบแพทย์"],
                "disclaimer": "ข้อมูลนี้เป็นการสรุปและจัดระเบียบจากข้อมูลที่ได้รับเบื้องต้น ไม่สามารถใช้แทนคำวินิจฉัยหรือคำแนะนำจากแพทย์ได้"
              }
            `
        }]
    };
    
    // 4. ส่ง Prompt และจัดการผลลัพธ์
    try {
        const result = await diagnosisModel.generateContent({
            contents: [
                { role: "user", parts: [{ text: promptForSystem }] },
                { role: "model", parts: [{ text: "เข้าใจแล้วครับ พร้อมรับข้อความจากผู้ใช้เพื่อทำการวิเคราะห์ตามคำสั่งทั้งหมด" }] },
                { role: "user", parts: [{ text: fullUserInput }] }
            ]
        });

        const responseText = result.response.text();
        const extractedJson = extractJsonFromMarkdown(responseText);
        
        if (!extractedJson) {
            console.error("AI Response Error: ไม่พบ JSON ใน Markdown block. AI ตอบกลับมาว่า:", responseText);
            throw new Error("ไม่สามารถอ่านผลการวิเคราะห์จาก AI ได้ในขณะนี้");
        }

        return JSON.parse(extractedJson);

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเรียกใช้ Gemini API หรือการประมวลผล JSON:", error);
        if (error instanceof SyntaxError) {
             console.error("JSON ที่ได้รับมาอาจมีโครงสร้างผิดพลาด:", error.message);
        }
        throw new Error("AI ไม่สามารถประมวลผลคำขอได้ในขณะนี้ กรุณาลองอีกครั้ง");
    }
}


// --- The Main Public Function of this Service ---
// นี่คือฟังก์ชันที่ Controller จะเรียกใช้
async function getAiAssessment(userData) {
    const { name, age, sex, weight, height, symptoms } = userData;

    console.log(`[Service] เริ่มกระบวนการสำหรับ: ${name}`);
    const bmi = calculateBMI(weight, height);
    console.log(`[Service] คำนวณ BMI ได้: ${bmi.value} (${bmi.category})`);

    const dataForAI = { name, age, sex, bmi, symptoms };

    let analysis;
    let lastAiError = null;
    const maxRetries = 5;

    // Logic การ Retry ที่ยอดเยี่ยมของคุณจะอยู่ที่นี่ ในใจกลางของ Business Logic
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Service Attempt ${attempt}/${maxRetries}] กำลังเรียกใช้ AI...`);
            analysis = await getAiAnalysis(dataForAI);
            console.log(`✅ [Service Attempt ${attempt}] สำเร็จ: วิเคราะห์ AI เรียบร้อย`);
            lastAiError = null;
            break; 
        } catch (aiError) {
            lastAiError = aiError;
            console.error(`❌ [Service Attempt ${attempt}] ล้มเหลว: ${aiError.message}`);
            if (attempt < maxRetries) {
                const waitTime = 2000;
                await delay(waitTime);
            }
        }
    }
    // Logic การสร้าง Fallback Response ก็อยู่ที่นี่เช่นกัน
    if (lastAiError) {
        console.error(`🚨 [Service] ไม่สามารถเชื่อมต่อ AI ได้หลังจากการพยายามครบ ${maxRetries} ครั้ง`);
        analysis = {
                primary_assessment: "ไม่สามารถสร้างบทวิเคราะห์จาก AI ได้ เนื่องจากปัญหาการเชื่อมต่อเซิร์ฟเวอร์ชั่วคราว",
                risk_analysis: [ { condition: "การเชื่อมต่อ AI ขัดข้อง", risk_level: "info", rationale: "ระบบไม่สามารถติดต่อ AI เพื่อทำการวิเคราะห์ความเสี่ยงได้ในขณะนี้" } ],
                self_care: ["โปรดลองอีกครั้งในภายหลัง", "หากอาการน่ากังวล ควรปรึกษาแพทย์โดยตรง"],
                dietary_recommendations: { foods_to_eat: [], foods_to_avoid: [] },
                red_flags: ["หากอาการแย่ลงอย่างรวดเร็ว ควรรีบไปพบแพทย์ทันที"],
                disclaimer: `เกิดข้อผิดพลาดในการสื่อสารกับ AI หลังจากพยายาม ${maxRetries} ครั้ง: ${lastAiError.message}`
        };
    }
    
    // Service คืนผลลัพธ์ทั้งหมดเป็น Object เดียว
    return {
        userInfo: { name, age, sex },
        bmi: bmi,
        analysis: analysis
    };
}
// ที่นี่เราจะ "Fake" การทำงานของ AI
function performDiagnosis(userData) {
    const { symptoms } = userData;
    let diagnosis = "ไม่สามารถระบุได้ชัดเจน กรุณาปรึกษาแพทย์";

    if (symptoms.includes('fever') && symptoms.includes('cough')) {
        diagnosis = "คุณอาจจะเป็นไข้หวัด ควรพักผ่อนให้เพียงพอและดื่มน้ำมากๆ";
    } else if (symptoms.includes('headache')) {
        diagnosis = "อาการปวดหัวอาจเกิดได้จากหลายสาเหตุ เช่น ความเครียด หรือการพักผ่อนไม่เพียงพอ";
    }

    // Logic ที่ซับซ้อนอื่นๆ สามารถเพิ่มได้ที่นี่
    // ในอนาคต เราอาจจะเรียก Model AI จริงๆ จากฟังก์ชันนี้

    // TODO: ใน Step ถัดไป เราจะเพิ่มการเรียก Repository เพื่อบันทึกผล
    
    return {
        userInput: userData,
        diagnosis: diagnosis
    };
}
export default { getAiAssessment }; // Export เป็น Object เพื่อให้ง่ายต่อการเพิ่มฟังก์ชันอื่นในอนาคต```

// module.exports = { performDiagnosis };