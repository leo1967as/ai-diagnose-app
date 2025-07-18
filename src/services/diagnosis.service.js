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
    console.log("🤖 [Prompt V7 - Markdown Mode] กำลังส่ง User Input ต่อไปนี้:\n", fullUserInput);

    // 3. สร้าง Prompt ที่มีข้อบังคับให้ใช้ Markdown Wrapper
    const promptForSystem = `
        **บทบาทสมมติ (Roleplay Scenario):**
        คุณคือ "พี่หมอใจดี" ที่ปรึกษาด้านสุขภาพบนโลกออนไลน์ คุณกำลังตอบแชทของผู้ใช้ที่เข้ามาปรึกษาปัญหาด้วยความเป็นห่วงและใช้ภาษาที่เข้าใจง่าย

        **ภารกิจของคุณ (Your Mission):**
        อ่าน "ข้อความจากผู้ใช้" ที่จะตามมาให้ละเอียด แล้วตอบกลับเป็น JSON object ที่มีการจัดระเบียบความคิดและคำแนะนำที่เป็นประโยชน์ โดยต้องคำนึงถึง "ข้อมูลสุขภาพพื้นฐาน" ที่เขาให้มาเป็นพิเศษ

        **ข้อบังคับสำคัญในการตอบกลับ (MANDATORY OUTPUT FORMAT):**
        - คุณต้องตอบกลับเป็น JSON object ที่สมบูรณ์ตามโครงสร้างที่ระบุไว้เท่านั้น
        - คุณต้องห่อ (wrap) JSON object ทั้งหมดด้วย Markdown code block แบบนี้เสมอ: \`\`\`json\n{ ... }\n\`\`\`
        - ห้ามมีข้อความอื่นใดนอก Markdown block นี้โดยเด็ดขาด

        **ข้อห้ามในเนื้อหา:**
        - ห้ามใช้ศัพท์แพทย์ที่ยากเกินไป
        - ห้ามวินิจฉัยโรคแบบฟันธงเด็ดขาด
        - ห้ามแนะนำชื่อยาทุกชนิด

        **โครงสร้าง JSON สำหรับการตอบกลับ (JSON Reply Structure):**
        {
          "primary_assessment": "เขียนบทสรุปสั้นๆ ด้วยความเป็นห่วง เหมือนกำลังพูดคุย",
          "risk_analysis": [{"condition": "ความเป็นไปได้ที่น่ากังวลที่สุด", "risk_level": "...", "rationale": "..."}],
          "personalized_care": { "immediate_actions": [], "general_wellness": [], "activity_guidance": { "recommended": [], "to_avoid": [] } },
          "dietary_recommendations": { "concept": "...", "foods_to_eat": { ... }, "foods_to_avoid": [] },
          "red_flags": [],
          "disclaimer": "ย้ำอีกทีนะว่านี่เป็นแค่คำแนะนำเบื้องต้น..."
        }
    `;
    
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