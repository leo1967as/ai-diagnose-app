// src/services/diagnosis.service.js
// File: src/services/diagnosis.service.js
// import { diagnosisModel } from '../config/gemini.config.js'; // ลบบรรทัดนี้
import aiConnector from './aiConnector.service.js'; // เพิ่มบรรทัดนี้

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

            **กระบวนการคิดวิเคราะห์ (MANDATORY THINKING PROCESS):**
      ก่อนที่จะสร้าง JSON สุดท้าย ให้คุณเขียนกระบวนการคิดของคุณตามขั้นตอนต่อไปนี้ก่อน:
      1.  **สรุปข้อเท็จจริง (Fact Summary):** สรุปข้อมูลสำคัญทั้งหมดของผู้ใช้ (อาการ, ระยะเวลา, โปรไฟล์สุขภาพ) โดยไม่มีการตีความ
      2.  **ระบุภาวะที่เป็นไปได้ (Potential Conditions Analysis):** จาก "อาการปัจจุบัน" เป็นหลัก ให้ลิสต์ภาวะหรือโรคที่เป็นไปได้ 2-3 อย่าง พร้อมให้เหตุผลสั้นๆ ว่าทำไมถึงคิดว่าเป็นภาวะนั้นๆ
      3.  **ประเมินและจัดลำดับความเสี่ยง (Risk Evaluation):** นำภาวะจากข้อ 2 มาประเมินเทียบกับ "ข้อมูลโปรไฟล์สุขภาพ" และ "ข้อมูลอื่นๆ" เพื่อจัดลำดับความเสี่ยงจากสูงไปต่ำสุด อธิบายว่าทำไมภาวะ A ถึงเสี่ยงกว่าภาวะ B
      4.  **สรุปผลการวิเคราะห์ (Final Conclusion):** สรุปภาวะที่น่าจะเป็นไปได้มากที่สุดเพื่อนำไปสร้าง JSON
      
      **ข้อบังคับเรื่องข้อมูล (DATA ADHERENCE MANDATE):**
      วิเคราะห์จาก "ข้อมูลดิบ" ที่ให้มา *เท่านั้น* ห้ามอ้างอิงถึงโรคหรืออาการที่ไม่มีอยู่ในข้อมูลโดยเด็ดขาด การสร้างข้อมูลที่ไม่มีอยู่จริง (Hallucination) จะถือว่าเป็นการทำผิดคำสั่งร้ายแรง


      **คำสั่งที่ต้องปฏิบัติ (MANDATORY INSTRUCTIONS):**
      สร้างผลลัพธ์เป็น JSON object ที่สมบูรณ์ตามโครงสร้างนี้เท่านั้น **โดยเนื้อหาในทุกฟิลด์ต้องผ่านกระบวนการคิดที่เชื่อมโยงกับ "ข้อมูลโปรไฟล์สุขภาพ" หากมีข้อมูลดังกล่าว** หากไม่เชื่อมโยงจะถือว่าทำผิดคำสั่ง
      
      **โครงสร้าง JSON ที่ต้องส่งออก (MANDATORY JSON STRUCTURE):**
      {
        "primary_assessment": "เขียนบทสรุปที่ต้องขึ้นต้นด้วยการแสดงข้อมูลพื้นฐานของผู้ใช้ (น้ำหนัก, ส่วนสูง, BMI) และแสดงรายการอาการทั้งหมดที่ผู้ใช้กรอก พร้อมระยะเวลา จากนั้นจึงกล่าวถึงการวิเคราะห์เบื้องต้น",
        "risk_analysis": [{"condition": "...", "risk_level": "...", "rationale": "ต้องอธิบายว่าข้อมูลใน 'โปรไฟล์สุขภาพ' เพิ่มหรือลดความเสี่ยงของภาวะนี้อย่างไร"}],
        "personalized_care": {
          "immediate_actions": ["..."],
          "general_wellness": ["ต้องมีคำแนะนำอย่างน้อย 1 ข้อที่จำเพาะเจาะจงกับข้อมูลใน 'โปรไฟล์สุขภาพ' โดยตรง"],
          "activity_guidance": { "recommended": ["..."], "to_avoid": ["..."] }
        },
        "dietary_recommendations": {
          "concept": "ต้องอธิบายแนวคิดการทานอาหารที่สอดคล้องกับทั้ง 'อาการปัจจุบัน' และข้อมูลใน 'โปรไฟล์สุขภาพ'",
          "foods_to_eat": { "main_dishes": ["..."], "snacks_and_fruits": ["..."], "drinks": ["..."] },
          "foods_to_avoid": ["ต้องมีเหตุผลที่เชื่อมโยงกับข้อมูลใน 'โปรไฟล์สุขภาพ'"]
        },
        "red_flags": ["ต้องมีสัญญาณอันตรายอย่างน้อย 1 ข้อที่เกี่ยวข้องกับข้อมูลใน 'โปรไฟล์สุขภาพ'"],
        "disclaimer": "การประเมินนี้สร้างโดย AI เพื่อให้คำแนะนำเบื้องต้นเท่านั้น และพิจารณาจากข้อมูลที่คุณให้มา ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ได้ กรุณาปรึกษาบุคลากรทางการแพทย์เพื่อรับการวินิจฉัยและการรักษาที่ถูกต้อง"
      }


      **ข้อบังคับในการสร้างผลลัพธ์ (OUTPUT RULES): **
      1.  **เชื่อมโยงข้อมูลทั้งหมด:** คำแนะนำทุกส่วน ต้องอ้างอิงถึง 'ระยะเวลาของอาการ' และ 'อาหารมื้อล่าสุด' อย่างสมเหตุสมผล **และต้องพิจารณาข้อมูล 'โปรไฟล์สุขภาพ' (ถ้ามี) เป็นอันดับแรก**
      2.  สำหรับ "risk_level" ให้ใช้ค่าใดค่าหนึ่งเท่านั้น: 'high' (สีแดง), 'medium' (สีส้ม), 'low' (สีเหลือง), 'info' (สีฟ้า)
      3.  เรียงลำดับ "risk_analysis" จากความเสี่ยงสูงสุดไปต่ำสุด
      4.  ต้องสร้าง JSON ให้ครบทุกฟิลด์ ห้ามขาดหรือเกิน
      5.  เนื้อหาต้องปลอดภัย ห้ามวินิจฉัยโรค และ**ห้ามแนะนำให้ซื้อหรือใช้ยาใดๆ ทั้งสิ้น**
      6.  ปฏิบัติได้จริง: คำแนะนำต้องชัดเจนและนำไปใช้ในชีวิตประจำวันได้
      7.  ตอบเป็นภาษาไทยทั้งหมด ยกเว้นใน "risk_analysis" ที่ต้องมีชื่อโรคเป็นภาษาไทยและวงเล็บ (ภาษาอังกฤษ) เช่น "โรคเบาหวาน (Diabetes)"
      8.  สำหรับ "foods_to_eat" ต้องมีข้อมูลในทุกหมวดหมู่: "main_dishes" (อาหารหลัก), "snacks_and_fruits" (ของว่าง/ผลไม้), และ "drinks" (เครื่องดื่ม)
      9.  risk_analysis ต้องมีชื่อภาษาไทย และ วงเล็บ (ภาษาอังกฤษ) เช่น "โรคเบาหวาน (Diabetes)" เพื่อให้เข้าใจง่าย
      10. หลังจากบอกอาหารที่แนะนำและควรเลี่ยงแล้ว ต้องบอกสาเหตุด้วยว่าทำไมถึงแนะนำหรือเลี่ยงอาหารเหล่านั้น โดยเฉพาะอย่างยิ่งถ้ามีข้อมูลใน 'โปรไฟล์สุขภาพ'
      11. **ลำดับความสำคัญ:** ให้ความสำคัญกับ "อาการปัจจุบัน" (Acute Symptoms) มากกว่า "โรคประจำตัว" (Chronic Conditions) ในการประเมินความเสี่ยง
      12. **ห้ามหลอนข้อมูล:** ปฏิบัติตาม "DATA ADHERENCE MANDATE" อย่างเคร่งครัด   
       `;
        const jsonStringResponse = await aiConnector.generateContent(prompt); 
let analysisResult = JSON.parse(jsonStringResponse);

    // --- เพิ่มบรรทัดนี้เข้าไป ---
    analysisResult = normalizeAiResponse(analysisResult);

    return analysisResult;
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

    try {
        console.log(`[Service] กำลังเรียกใช้ AI...`);
        analysis = await getAiAnalysis(dataForAI);
        console.log(`[Service] สำเร็จ: วิเคราะห์ AI เรียบร้อย`);
    } catch (aiError) {
        lastAiError = aiError;
        console.error(`[Service] ล้มเหลว: ${aiError.message}`);
    }
    // Logic การสร้าง Fallback Response ก็อยู่ที่นี่เช่นกัน
    if (lastAiError) {
        console.error(`🚨 [Service] ไม่สามารถเชื่อมต่อ AI ได้หลังจากการพยายามครบ ${maxRetries} ครั้ง`);
        analysis = {
                primaryAssessment: "ไม่สามารถสร้างบทวิเคราะห์จาก AI ได้ เนื่องจากปัญหาการเชื่อมต่อเซิร์ฟเวอร์ชั่วคราว",
                riskEvaluation: [ { condition: "การเชื่อมต่อ AI ขัดข้อง", riskLevel: "info", rationale: "ระบบไม่สามารถติดต่อ AI เพื่อทำการวิเคราะห์ความเสี่ยงได้ในขณะนี้" } ],
                careRecommendations: {
                  immediateActions: ["โปรดลองอีกครั้งในภายหลัง"],
                  generalWellness: ["หากอาการน่ากังวล ควรปรึกษาแพทย์โดยตรง"],
                  activityGuidance: { recommended: [], toAvoid: [] }
                },
                dietaryRecommendations: {
                  concept: "ไม่สามารถให้คำแนะนำด้านโภชนาการได้ในขณะนี้",
                  foodsToEat: { mainDishes: [], snacksAndFruits: [], drinks: [] },
                  foodsToAvoid: []
                },
                warningSigns: ["หากอาการแย่ลงอย่างรวดเร็ว ควรรีบไปพบแพทย์ทันที"],
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

// --- เพิ่มฟังก์ชันนี้เข้าไป ---
/**
 * แปลง key จาก snake_case เป็น camelCase
 * @param {object} obj - Object ที่ต้องการแปลง
 * @returns {object} - Object ที่แปลงแล้ว
 */
const snakeToCamel = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = snakeToCamel(value);
  }
  return result;
};

/**
  * จัดระเบียบข้อมูลที่ได้จาก AI ให้มีโครงสร้างตรงตามที่เราต้องการเสมอ
  * @param {object} analysis - The analysis object parsed from the AI's JSON response.
  * @returns {object} - The normalized analysis object.
  */
const normalizeAiResponse = (analysis) => {
  console.log("🔄 [Service] กำลังจัดระเบียบข้อมูลจาก AI...");

  // แปลง key จาก snake_case เป็น camelCase ก่อน
  analysis = snakeToCamel(analysis);

  // ตรวจสอบให้แน่ใจว่า personalizedCare มีอยู่จริง (หลังแปลงแล้ว)
  if (!analysis.personalizedCare) {
    analysis.personalizedCare = {};
  }
    const care = analysis.personalizedCare;

    // 1. แก้ไข generalWellness: ถ้าเป็น String ให้แปลงเป็น Array
    if (typeof care.generalWellness === 'string') {
        console.log("  - แก้ไข 'generalWellness': string -> array");
        care.generalWellness = [care.generalWellness];
    } else if (!Array.isArray(care.generalWellness)) {
        care.generalWellness = []; // ถ้าเป็นประเภทอื่นที่ไม่ใช่ทั้ง string และ array ให้เป็น array ว่าง
    }

    // 2. แก้ไข activityGuidance: ถ้าเป็น Array ให้แปลงเป็น Object ที่ถูกต้อง
    if (Array.isArray(care.activityGuidance)) {
        console.log("  - แก้ไข 'activityGuidance': array -> object");
        care.activityGuidance = {
            recommended: care.activityGuidance,
            toAvoid: [] // สร้าง toAvoid ว่างๆ ไว้ให้
        };
    } else if (typeof care.activityGuidance !== 'object' || care.activityGuidance === null) {
        // ถ้าเป็นประเภทอื่นที่ไม่ใช่ array และ object ให้สร้าง object ว่างๆ ขึ้นมา
        care.activityGuidance = { recommended: [], toAvoid: [] };
    }
     // --- เพิ่มส่วนของ redFlags เข้าไปตรงนี้ ---
    if (Array.isArray(analysis.redFlags) && analysis.redFlags.length > 0 && typeof analysis.redFlags[0] === 'object') {
        console.log("  - แก้ไข 'redFlags': array of objects -> array of strings");
        // ทำการ map เพื่อดึงเฉพาะค่า 'condition' ออกมาสร้างเป็น Array ใหม่
        analysis.redFlags = analysis.redFlags.map(flag => flag.condition || "ข้อมูลไม่ถูกต้อง");
    }
    if (analysis.dietaryRecommendations && typeof analysis.dietaryRecommendations.foodsToAvoid === 'object' && !Array.isArray(analysis.dietaryRecommendations.foodsToAvoid)) {
        console.log("  - แก้ไข 'foodsToAvoid': object -> array");
        // ถ้ามันเป็น Object (เหมือนใน Log) ให้ดึงค่า reasoning มาสร้างเป็น Array
        if (analysis.dietaryRecommendations.foodsToAvoid.reasoning) {
            analysis.dietaryRecommendations.foodsToAvoid = [analysis.dietaryRecommendations.foodsToAvoid.reasoning];
        } else {
            // ถ้าเป็น Object แต่ไม่มี reasoning ให้แปลงเป็น Array ว่าง
            analysis.dietaryRecommendations.foodsToAvoid = [];
        }
    }
    console.log("👍 [Service] จัดระเบียบข้อมูลเรียบร้อย");
    return analysis;
};
export default { getAiAssessment }; // Export เป็น Object เพื่อให้ง่ายต่อการเพิ่มฟังก์ชันอื่นในอนาคต```

// module.exports = { performDiagnosis };