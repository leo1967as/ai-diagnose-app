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
    // 1. สร้าง Context ที่ชัดเจนและสมบูรณ์
    // สร้างส่วนของโปรไฟล์ให้เป็น String ที่อ่านง่ายและจัดการได้
    let profileContext = "ผู้ใช้ไม่มีข้อมูลโปรไฟล์สุขภาพที่ระบุไว้เป็นพิเศษ"; // Default text
    if (userData.health_profile) {
        const parts = [];
        if (userData.health_profile.chronic_conditions?.length) parts.push(`โรคประจำตัวคือ ${userData.health_profile.chronic_conditions.join(', ')}`);
        if (userData.health_profile.lifestyle_factors?.length) parts.push(`มีไลฟ์สไตล์แบบ ${userData.health_profile.lifestyle_factors.join(', ')}`);
        if (userData.health_profile.additional_notes) parts.push(`มีบันทึกเพิ่มเติมว่า: "${userData.health_profile.additional_notes}"`);
        
        if (parts.length > 0) {
            profileContext = `ผู้ใช้มีโปรไฟล์สุขภาพที่ต้องพิจารณาเป็นพิเศษดังนี้: ${parts.join('. ')}.`;
        }
    }

    const fullContext = `
      วิเคราะห์ผู้ใช้ชื่อ ${userData.name} (อายุ ${userData.age} ปี, เพศ ${userData.sex}) ที่มี BMI ${userData.bmi.value} (${userData.bmi.category}).
      **สถานการณ์ปัจจุบัน:**
      - มีอาการ: "${userData.symptoms}"
      - เป็นมานาน: ${userData.symptom_duration}
      - มื้อล่าสุดทาน: ${userData.previous_meal}
      **ข้อมูลโปรไฟล์สุขภาพ (สำคัญที่สุด!): ${profileContext}**
    `;

    // 2. พิมพ์ Context ที่จะส่งให้ AI ออกมาดูใน Console เพื่อง่ายต่อการ Debug
    console.log("🤖 [Prompt V5] กำลังสร้าง Prompt ด้วย Context ต่อไปนี้:\n", fullContext);

    // 3. สร้าง Prompt ที่เน้น "คำสั่ง" และ "บทลงโทษ"
    const prompt = `
      **บทบาทและเป้าหมาย (Role and Goal):** คุณคือ AI ที่ปรึกษาด้านสุขภาพเชิงวิเคราะห์ (Analytical Wellness Advisor) เป้าหมายเดียวของคุณคือการนำ "ข้อมูลทั้งหมด" ที่ให้มา ไปสร้างการวิเคราะห์ที่เชื่อมโยงกันอย่างสมเหตุสมผลและปลอดภัย

      **ข้อมูลดิบสำหรับการวิเคราะห์ (RAW DATA FOR ANALYSIS):**
      ${fullContext}

      **คำสั่งที่ต้องปฏิบัติ (MANDATORY INSTRUCTIONS):**
      สร้างผลลัพธ์เป็น JSON object ที่สมบูรณ์ตามโครงสร้างนี้เท่านั้น **โดยเนื้อหาในทุกฟิลด์ต้องผ่านกระบวนการคิดที่เชื่อมโยงกับ "ข้อมูลโปรไฟล์สุขภาพ" หากมีข้อมูลดังกล่าว** หากไม่เชื่อมโยงจะถือว่าทำผิดคำสั่ง
      
      **โครงสร้าง JSON ที่ต้องส่งออก (MANDATORY JSON STRUCTURE):**
      {
        "primary_assessment": "เขียนบทสรุปที่ต้องขึ้นต้นด้วยการกล่าวถึงผลกระทบของข้อมูลจาก 'โปรไฟล์สุขภาพ' ที่มีต่อ 'อาการปัจจุบัน' ก่อนเสมอ",
        "risk_analysis": [{"condition": "...", "risk_level": "...", "rationale": "ต้องอธิบายว่าข้อมูลใน 'โปรไฟล์สุขภาพ' เพิ่มหรือลดความเสี่ยงของภาวะนี้อย่างไร"}],
        "personalized_care": {
          "immediate_actions": ["..."],
          "general_wellness": ["ต้องมีคำแนะนำอย่างน้อย 1 ข้อที่จำเพาะเจาะจงกับข้อมูลใน 'โปรไฟล์สุขภาพ' โดยตรง"],
          "activity_guidance": { "recommended": ["..."], "to_avoid": ["..."] }
        },
        "dietary_recommendations": {
          "concept": "ต้องอธิบายแนวคิดการทานอาหารที่สอดคล้องกับทั้ง 'อาการปัจจุบัน' และข้อมูลใน 'โปรไฟล์สุขภาพ'",
          "foods_to_eat": { ... },
          "foods_to_avoid": ["ต้องมีเหตุผลที่เชื่อมโยงกับข้อมูลใน 'โปรไฟล์สุขภาพ'"]
        },
        "red_flags": ["ต้องมีสัญญาณอันตรายอย่างน้อย 1 ข้อที่เกี่ยวข้องกับข้อมูลใน 'โปรไฟล์สุขภาพ'"],
        "disclaimer": "การประเมินนี้สร้างโดย AI เพื่อให้คำแนะนำเบื้องต้นเท่านั้น และพิจารณาจากข้อมูลที่คุณให้มา ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ได้ กรุณาปรึกษาบุคลากรทางการแพทย์เพื่อรับการวินิจฉัยและการรักษาที่ถูกต้อง"
      }


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
    const { name, age, sex, weight, height, symptoms, health_profile, symptom_duration, previous_meal } = userData;

    console.log(`[Service] เริ่มกระบวนการสำหรับ: ${name}`);
    const bmi = calculateBMI(weight, height);
    console.log(`[Service] คำนวณ BMI ได้: ${bmi.value} (${bmi.category})`);

    const dataForAI = { name, age, sex, bmi, symptoms, health_profile, symptom_duration, previous_meal };

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
        bmi: { ...bmi, weight, height },
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