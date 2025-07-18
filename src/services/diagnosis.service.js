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
    console.log("🤖 กำลังสร้าง Prompt สำหรับการวิเคราะห์สุขภาพทั่วไป...");
    const prompt = `
      คำสั่ง: คุณคือผู้ช่วย AI ด้านสุขภาพที่มีความละเอียดรอบคอบและห่วงใยผู้ใช้งาน หน้าที่ของคุณคือวิเคราะห์ข้อมูลสุขภาพเบื้องต้นอย่างละเอียด และให้คำแนะนำที่ปลอดภัย, ชัดเจน, และนำไปปฏิบัติได้จริง
      **ข้อมูลผู้ใช้:**
      - ชื่อ: ${userData.name}, อายุ: ${userData.age} ปี, เพศ: ${userData.sex}
      - ดัชนีมวลกาย (BMI): ${userData.bmi.value} (จัดอยู่ในเกณฑ์: ${userData.bmi.category})
      - อาการปัจจุบันที่แจ้ง: "${userData.symptoms}"
      **งานของคุณ (สำคัญที่สุด):**
      วิเคราะห์ข้อมูลทั้งหมด แล้วสร้างผลลัพธ์เป็น JSON object ที่มีโครงสร้างตามนี้ **เท่านั้น**:
      {
        "primary_assessment": "เขียนบทสรุปวิเคราะห์ภาพรวมสุขภาพของผู้ใช้จากข้อมูลทั้งหมด โดยใช้ภาษาที่เข้าใจง่ายและแสดงความห่วงใย ควรมีความยาว 2-3 ประโยค",
        "risk_analysis": [{"condition": "ชื่อภาวะสุขภาพ/โรคที่อาจเกี่ยวข้อง #1", "risk_level": "high", "rationale": "คำอธิบายเหตุผล"}, {"condition": "ชื่อภาวะสุขภาพ/โรคที่อาจเกี่ยวข้อง #2", "risk_level": "medium", "rationale": "คำอธิบายเหตุผล"}],
        "self_care": ["คำแนะนำในการดูแลตัวเองเบื้องต้น ข้อที่ 1", "ข้อที่ 2", "ข้อที่ 3 (อย่างน้อย 3-5 ข้อ)"],
        "dietary_recommendations": {"foods_to_eat": ["รายการอาหารที่ควรกิน"], "foods_to_avoid": ["รายการอาหารที่ควรหลีกเลี่ยง"]},
        "red_flags": ["สัญญาณอันตรายข้อที่ 1 ที่ควรรีบไปพบแพทย์ทันที", "สัญญาณอันตรายข้อที่ 2"],
        "disclaimer": "นี่เป็นเพียงการประเมินเบื้องต้นจาก AI และไม่ใช่การวินิจฉัยทางการแพทย์ ควรปรึกษาแพทย์หรือผู้เชี่ยวชาญเพื่อรับการวินิจฉัยที่ถูกต้องและเหมาะสมกับตัวคุณ"
      }
      **ข้อบังคับในการสร้างผลลัพธ์:**
      1.  สำหรับ "risk_level" ให้ใช้ค่าใดค่าหนึ่งเท่านั้น: 'high' (สีแดง), 'medium' (สีส้ม), 'low' (สีเหลือง), 'info' (สีฟ้า)
      2.  เรียงลำดับ "risk_analysis" จากความเสี่ยงสูงสุดไปต่ำสุด
      3.  ต้องสร้าง JSON ให้ครบทุกฟิลด์ ห้ามขาดหรือเกิน
      4.  เนื้อหาต้องปลอดภัย ห้ามวินิจฉัยโรคเด็ดขาด แต่ใช้คำว่า "ภาวะที่อาจเกี่ยวข้อง"
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