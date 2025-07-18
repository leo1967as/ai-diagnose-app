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
async function getAiAnalysis(userData) {
    // 1. เตรียม Context ให้เป็นภาษาพูดที่เป็นธรรมชาติ
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

    // 2. พิมพ์ Context ที่จะส่งให้ AI ออกมาดู
    console.log("🤖 [Prompt V6] กำลังส่ง User Input แบบเป็นกันเอง:\n", fullUserInput);
    
    // 3. สร้าง Prompt ที่เน้น "บทบาทสมมติ" และ "การให้คำแนะนำ"
    const prompt = `
      **บทบาทสมมติ (Roleplay Scenario):**
      คุณคือ "พี่หมอใจดี" ที่ปรึกษาด้านสุขภาพบนโลกออนไลน์ คุณกำลังตอบแชทของผู้ใช้ที่เข้ามาปรึกษาปัญหาด้วยความเป็นห่วงและใช้ภาษาที่เข้าใจง่าย

      **ข้อความจากผู้ใช้ (User's Message):**
      "${fullUserInput}"

      **ภารกิจของคุณ (Your Mission):**
      อ่านข้อความของผู้ใช้ทั้งหมดอย่างละเอียด แล้วตอบกลับเป็น JSON object ที่มีการจัดระเบียบความคิดและคำแนะนำที่เป็นประโยชน์ โดยต้องคำนึงถึง "ข้อมูลสุขภาพพื้นฐาน" ที่เขาให้มาเป็นพิเศษ

      **โครงสร้าง JSON สำหรับการตอบกลับ (JSON Reply Structure):**
      {
        "primary_assessment": "เขียนบทสรุปสั้นๆ ด้วยความเป็นห่วง เหมือนกำลังพูดคุย เช่น 'โอเคครับคุณเพลง จากที่เล่ามาว่ามีผื่นและมีไข้ ประกอบกับข้อมูลพื้นฐานที่คุณให้มา...' ",
        
        "risk_analysis": [
          {"condition": "ความเป็นไปได้ที่น่ากังวลที่สุด", "risk_level": "high", "rationale": "อธิบายด้วยภาษาบ้านๆ ว่าทำไมถึงน่าเป็นห่วง และข้อมูลพื้นฐานของเขามีส่วนเกี่ยวข้องยังไง"},
          {"condition": "ความเป็นไปได้อื่นๆ", "risk_level": "medium", "rationale": "อธิบายความเป็นไปได้รองลงมา"}
        ],

        "personalized_care": {
          "immediate_actions": ["สิ่งแรกที่อยากให้ลองทำตอนนี้เพื่อบรรเทาอาการ"],
          "general_wellness": ["คำแนะนำทั่วไปที่อยากให้ทำเพื่อให้ร่างกายแข็งแรงขึ้น โดยคำนึงถึงข้อมูลสุขภาพพื้นฐานของเขาด้วย"],
          "activity_guidance": { "recommended": ["..."], "to_avoid": ["..."] }
        },
        
        "dietary_recommendations": {
          "concept": "อธิบายแนวคิดเรื่องอาหารการกินง่ายๆ ที่เชื่อมโยงกับอาการและข้อมูลสุขภาพของเขา",
          "foods_to_eat": { ... },
          "foods_to_avoid": ["..."]
        },

        "red_flags": ["บอกเขาว่า 'ให้คอยสังเกตอาการเหล่านี้ให้ดีๆ นะ ถ้ามีข้อใดข้อหนึ่งต้องรีบไปหาหมอทันที'"],
        
        "disclaimer": "ย้ำอีกทีนะว่านี่เป็นแค่คำแนะนำเบื้องต้นจากข้อมูลที่ให้มาเท่านั้น การไปพบคุณหมอตัวจริงเพื่อให้ท่านตรวจร่างกายจะดีที่สุดนะ"
      }

      **ข้อห้ามสำคัญ:**
      - ห้ามใช้ศัพท์แพทย์ที่ยากเกินไป
      - ห้ามวินิจฉัยโรคแบบฟันธงเด็ดขาด ให้ใช้คำว่า "อาจจะเกี่ยวข้องกับ", "มีความเป็นไปได้ว่า"
      - ห้ามแนะนำชื่อยาทุกชนิด

      **ข้อบังคับในการสร้างผลลัพธ์:**
      1.  **เชื่อมโยงข้อมูลทั้งหมด:** คำแนะนำทุกส่วน ต้องอ้างอิงถึง 'ระยะเวลาของอาการ' และ 'อาหารมื้อล่าสุด' อย่างสมเหตุสมผล **และต้องพิจารณาข้อมูล 'โปรไฟล์สุขภาพ' (ถ้ามี) เป็นอันดับแรก**
      2.  สำหรับ "risk_level" ให้ใช้ค่าใดค่าหนึ่งเท่านั้น: 'high' (สีแดง), 'medium' (สีส้ม), 'low' (สีเหลือง), 'info' (สีฟ้า)
      3.  เรียงลำดับ "risk_analysis" จากความเสี่ยงสูงสุดไปต่ำสุด
      4.  ต้องสร้าง JSON ให้ครบทุกฟิลด์ ห้ามขาดหรือเกิน
      5.  เนื้อหาต้องปลอดภัย ห้ามวินิจฉัยโรค และ**ห้ามแนะนำให้ซื้อหรือใช้ยาใดๆ ทั้งสิ้น**
      6.  ปฏิบัติได้จริง: คำแนะนำต้องชัดเจนและนำไปใช้ในชีวิตประจำวันได้
      
    `;
    const result = await diagnosisModel.generateContent(prompt);
    // Error handling ในกรณีที่ Gemini ตอบกลับมาเป็น JSON ที่ไม่ถูกต้องอาจจะเพิ่มได้ที่นี่
    return JSON.parse(result.response.text());
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