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
    console.log("🤖 [Prompt V3] กำลังสร้าง Prompt เวอร์ชันเชื่อมโยงข้อมูลเชิงลึก...");

    const profileText = userData.health_profile && (userData.health_profile.chronic_conditions.length > 0 || userData.health_profile.lifestyle_factors.length > 0)
        ? `
      - **โปรไฟล์สุขภาพ (ปัจจัยสำคัญที่ต้องพิจารณาเป็นพิเศษ):**
        - **โรคประจำตัว:** ${userData.health_profile.chronic_conditions.join(', ') || 'ไม่มี'}
        - **ไลฟ์สไตล์:** ${userData.health_profile.lifestyle_factors.join(', ') || 'ไม่มี'}
        - **ยาที่แพ้ (เพื่อการเตือน):** ${userData.health_profile.drug_allergy || 'ไม่มี'}
        ` 
        : ""; // ถ้าไม่มีโปรไฟล์ ให้เป็นค่าว่างไปเลย

    const prompt = `
      คำสั่ง: คุณคือ AI Wellness Advisor ระดับสูง มีหน้าที่วิเคราะห์ข้อมูลสุขภาพแบบองค์รวม และ "สร้างความเชื่อมโยง" ระหว่างข้อมูลทุกส่วนเพื่อสร้างคำแนะนำที่เฉียบแหลมและเฉพาะบุคคลอย่างแท้จริง

      **ข้อมูลผู้ใช้แบบองค์รวม:**
      - **ข้อมูลส่วนตัว:** ชื่อ: ${userData.name}, อายุ: ${userData.age} ปี, เพศ: ${userData.sex}
      - **ข้อมูลร่างกาย:** BMI คือ ${userData.bmi.value} (เกณฑ์: "${userData.bmi.category}")
      ${profileText}  
      - **อาการที่แจ้ง:** "${userData.symptoms}"
      - **บริบทเพิ่มเติม (สำคัญมาก):**
        - **ระยะเวลาที่มีอาการ:** ${userData.symptom_duration}
        - **อาหารมื้อล่าสุดที่ทาน:** ${userData.previous_meal}
      

      **กระบวนการคิดและสร้างผลลัพธ์ (สำคัญมาก!):**
      วิเคราะห์ข้อมูลทั้งหมดเพื่อสร้าง JSON object ที่มีโครงสร้างตามนี้ **เท่านั้น**:
      {
        "primary_assessment": "เขียนบทสรุปวิเคราะห์ภาพรวม โดยต้องเชื่อมโยง 'อาการหลัก' กับ 'ระยะเวลา' และ 'อาหารมื้อล่าสุด' (ถ้าเกี่ยวข้อง) **หากมีโปรไฟล์สุขภาพ ให้กล่าวถึงผลกระทบของโรคประจำตัวต่ออาการปัจจุบันด้วย** เช่น 'จากอาการเจ็บคอที่คุณแจ้งมา ประกอบกับการที่คุณมีประวัติเป็นโรคเบาหวาน อาจต้องเฝ้าระวังการติดเชื้อเป็นพิเศษ'",
        
        "risk_analysis": [
          {"condition": "ชื่อภาวะสุขภาพที่อาจเกี่ยวข้อง #1", "risk_level": "high", "rationale": "อธิบายเหตุผลว่าทำไมอาการ, ระยะเวลา, และอาหารที่ทานจึงสัมพันธ์กับภาวะนี้ **พร้อมทั้งวิเคราะห์ว่าโรคประจำตัวหรือไลฟ์สไตล์ของผู้ใช้ (ถ้ามี) เพิ่มความเสี่ยงของภาวะนี้หรือไม่**"}
        ],

        "personalized_care": {
          "immediate_actions": ["คำแนะนำที่ควรทำทันทีเพื่อบรรเทาอาการ"],
          "general_wellness": [
              "คำแนะนำในการดูแลตัวเองโดยทั่วไป",
              "**หากมีโปรไฟล์สุขภาพ, ให้เพิ่มคำแนะนำที่ปรับให้เข้ากับโรคประจำตัว 1 ข้อ** เช่น 'ผู้ที่เป็นโรคความดันสูงควรหลีกเลี่ยงการทานอาหารเค็มในช่วงนี้' "
            ],
          "activity_guidance": {
            "recommended": ["กิจกรรมเบาๆ ที่แนะนำ"],
            "to_avoid": ["กิจกรรมที่ควรหลีกเลี่ยงเด็ดขาด"]
          }
        },
        
        "dietary_recommendations": {
          "concept": "อธิบายแนวคิดหลักของการเลือกทานอาหาร โดยอ้างอิงถึง 'อาหารมื้อล่าสุด' และ **หากมีโรคประจำตัว (เช่น เบาหวาน, ความดันสูง) ต้องกล่าวถึงด้วยว่าควรเลือกอาหารอย่างไรให้สอดคล้องกัน**",
          "foods_to_eat": {
            "main_dishes": ["อาหารหลัก"], "snacks_and_fruits": ["ของว่าง/ผลไม้"], "drinks": ["เครื่องดื่ม"]
          },
          "foods_to_avoid": ["รายการอาหารที่ควรหลีกเลี่ยง พร้อมเหตุผลที่เชื่อมโยงกับอาการปัจจุบัน **และผลกระทบต่อโรคประจำตัวของผู้ใช้**"]
        },

        "red_flags": [
          "สัญญาณอันตรายที่จำเพาะเจาะจงกับ 'ระยะเวลาของอาการ' **และ 'โรคประจำตัว' มากขึ้น** เช่น 'สำหรับผู้ที่เป็นโรคหัวใจ หากมีอาการเจ็บหน้าอกรุนแรงขึ้นควรรีบพบแพทย์ทันทีโดยไม่ต้องรอ'"
        ],
        
        "disclaimer": "การประเมินนี้สร้างโดย AI เพื่อให้คำแนะนำเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ได้ กรุณาปรึกษาบุคลากรทางการแพทย์เพื่อรับการวินิจฉัยและการรักษาที่ถูกต้อง"
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