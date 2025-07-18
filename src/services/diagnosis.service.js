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
      คำสั่ง: คุณคือผู้ช่วย AI เชี่ยวชาญด้านสุขภาพและการดูแลเบื้องต้น (AI Wellness Advisor) หน้าที่ของคุณคือวิเคราะห์ข้อมูลสุขภาพของผู้ใช้แบบองค์รวม โดยเชื่อมโยงข้อมูลทั้งหมดเข้าด้วยกันเพื่อสร้างคำแนะนำที่ "เฉพาะเจาะจง", "นำไปปฏิบัติได้จริง", และ "ปลอดภัย"

      **ข้อมูลผู้ใช้แบบองค์รวม:**
      - **ข้อมูลส่วนตัว:** ชื่อ: ${userData.name}, อายุ: ${userData.age} ปี, เพศ: ${userData.sex}
      - **ข้อมูลร่างกาย:** ดัชนีมวลกาย (BMI) คือ ${userData.bmi.value} ซึ่งอยู่ในเกณฑ์ "${userData.bmi.category}"
      - **อาการที่แจ้ง:** "${userData.symptoms}"

      **กระบวนการคิดและสร้างผลลัพธ์ (สำคัญมาก!):**
      คุณต้องวิเคราะห์ข้อมูลทั้งหมด แล้วสร้างผลลัพธ์เป็น JSON object ที่มีโครงสร้างตามนี้ **เท่านั้น**:
      {
        "primary_assessment": "เขียนบทสรุปวิเคราะห์ภาพรวมสุขภาพ 2-3 ประโยค โดยต้องอ้างอิงถึงอาการหลักและเกณฑ์ BMI ของผู้ใช้ เช่น 'จากอาการ... และการที่ค่า BMI อยู่ในเกณฑ์... อาจบ่งชี้ว่า...'",

        "risk_analysis": [
          {"condition": "ชื่อภาวะสุขภาพที่อาจเกี่ยวข้อง #1", "risk_level": "high", "rationale": "อธิบายเหตุผลอย่างละเอียดว่าทำไมอาการที่แจ้งจึงสัมพันธ์กับภาวะนี้ และปัจจัยเสริม (ถ้ามี)"},
          {"condition": "ชื่อภาวะสุขภาพที่อาจเกี่ยวข้อง #2", "risk_level": "medium", "rationale": "คำอธิบายเหตุผล"}
        ],

        "personalized_care": {
          "immediate_actions": [
            "คำแนะนำที่ควรทำทันทีเพื่อบรรเทาอาการ (อย่างน้อย 2 ข้อ)",
            "ตัวอย่าง: 'หากมีไข้สูงกว่า 38.5 องศาเซลเซียส สามารถทานยาลดไข้พาราเซตามอลได้ 1 เม็ดทุก 4-6 ชั่วโมง' "
          ],
          "general_wellness": [
            "คำแนะนำในการดูแลตัวเองโดยทั่วไปเพื่อฟื้นฟูร่างกาย เช่น การพักผ่อน การจัดการความเครียด (อย่างน้อย 3 ข้อ)",
            "ตัวอย่าง: 'ควรนอนหลับให้ได้ 7-9 ชั่วโมงในห้องที่เงียบและมืดสนิทเพื่อส่งเสริมการซ่อมแซมของร่างกาย' "
          ],
          "activity_guidance": {
            "recommended": ["กิจกรรมเบาๆ ที่แนะนำให้ทำได้ เช่น 'การเดินช้าๆ ในบ้านเพื่อกระตุ้นการไหลเวียนโลหิต'"],
            "to_avoid": ["กิจกรรมที่ควรหลีกเลี่ยงเด็ดขาดจนกว่าอาการจะดีขึ้น เช่น 'การออกกำลังกายอย่างหนัก' หรือ 'การยกของหนัก'"]
          }
        },
        
        "dietary_recommendations": {
          "concept": "อธิบายแนวคิดหลักของการเลือกรับประทานอาหารในช่วงนี้ 1-2 ประโยค เช่น 'เน้นอาหารที่ย่อยง่าย มีคุณค่าทางโภชนาการสูง เพื่อลดภาระของร่างกายและเสริมสร้างภูมิคุ้มกัน'",
          "foods_to_eat": {
            "main_dishes": ["ตัวอย่างอาหารหลัก เช่น 'โจ๊กหมูใส่ไข่', 'ข้าวต้มปลา'"],
            "snacks_and_fruits": ["ตัวอย่างของว่างและผลไม้ เช่น 'กล้วยน้ำว้า', 'น้ำขิงอุ่นๆ'"],
            "drinks": ["ตัวอย่างเครื่องดื่ม เช่น 'น้ำเปล่าสะอาด', 'น้ำซุปใส'"]
          },
          "foods_to_avoid": ["อาหาร/เครื่องดื่มที่ควรหลีกเลี่ยงโดยเด็ดขาด พร้อมเหตุผลสั้นๆ เช่น 'อาหารทอด (เพราะย่อยยากและอาจระคายเคืองคอ)'", "เครื่องดื่มแอลกอฮอล์ (เพราะทำให้ร่างกายขาดน้ำและลดภูมิคุ้มกัน)"]
        },

        "red_flags": [
          "สัญญาณอันตรายที่จำเพาะเจาะจงกับอาการมากขึ้น (อย่างน้อย 3 ข้อ) ที่หากเกิดขึ้นต้องรีบไปพบแพทย์ทันที",
          "ตัวอย่าง: 'หากอาการไอแย่ลงจนหายใจหอบเหนื่อย', 'หากมีไข้สูงลอยเกิน 2 วัน', 'หากปวดศีรษะรุนแรงร่วมกับอาเจียนพุ่ง'"
        ],
        
        "disclaimer": "การประเมินนี้สร้างโดย AI เพื่อให้คำแนะนำเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ได้ กรุณาปรึกษาบุคลากรทางการแพทย์เพื่อรับการวินิจฉัยและการรักษาที่ถูกต้อง"
      }
      **ข้อบังคับในการสร้างผลลัพธ์:**
      1.  สำหรับ "risk_level" ให้ใช้ค่าใดค่าหนึ่งเท่านั้น: 'high' (สีแดง), 'medium' (สีส้ม), 'low' (สีเหลือง), 'info' (สีฟ้า)
      2.  เรียงลำดับ "risk_analysis" จากความเสี่ยงสูงสุดไปต่ำสุด
      3.  ต้องสร้าง JSON ให้ครบทุกฟิลด์ ห้ามขาดหรือเกิน
      4.  เนื้อหาต้องปลอดภัย ห้ามวินิจฉัยโรคเด็ดขาด แต่ใช้คำว่า "ภาวะที่อาจเกี่ยวข้อง"
      5.  **เชื่อมโยงข้อมูล:** ทุกคำแนะนำต้องสมเหตุสมผลและสอดคล้องกับข้อมูลที่ผู้ใช้ให้มา
      6. **ปฏิบัติได้จริง:** คำแนะนำต้องชัดเจนและนำไปใช้ในชีวิตประจำวันได้
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