// File: src/controllers/diagnosis.controller.js
import diagnosisService from '../services/diagnosis.service.js';

// เปลี่ยนชื่อฟังก์ชันให้สื่อความหมายมากขึ้น
async function handleAssessmentRequest(req, res, next) {
    try {
        const userData = req.body;
        
        // --- Validation ---
        const { name, age, sex, weight, height, symptoms } = userData;
        if (!name || !age || !sex || !weight || !height || !symptoms) {
            // ส่ง status 400 (Bad Request) ซึ่งเหมาะสมกว่า 500
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน", details: "กรุณากรอกข้อมูล: name, age, sex, weight, height, symptoms ให้ครบถ้วน" });
        }

        console.log(`[Controller] ได้รับคำขอจาก: ${name}, เริ่มส่งต่อไปยัง Service...`);

        // เรียกใช้ Service และส่งข้อมูลทั้งหมดไปในครั้งเดียว
        // สังเกตว่า Controller ไม่รู้เลยว่าเบื้องหลังมีการคำนวณ BMI หรือ Retry อย่างไร
        const assessmentResult = await diagnosisService.getAiAssessment(userData);

        // ส่งผลลัพธ์ที่ได้จาก Service กลับไปให้ Client
        res.status(200).json(assessmentResult);

    } catch (error) {
        console.error("[Controller] เกิดข้อผิดพลาดรุนแรง:", error);
        // ในอนาคต เราจะใช้ next(error) เพื่อส่งไปให้ Middleware จัดการ
        // แต่ตอนนี้ส่ง 500 กลับไปก่อน
        res.status(500).json({
            error: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
            details: error.message || "ไม่สามารถระบุสาเหตุได้"
        });
    }
}

export default { handleAssessmentRequest };

// // src/controllers/diagnosis.controller.js
// const diagnosisService = require('../services/diagnosis.service');

// async function getDiagnosis(req, res, next) {
//     try {
//         const userData = req.body;
//         // TODO: เพิ่มการ Validation ข้อมูลที่รับเข้ามา (สำคัญมากในงานจริง)
        
//         const result = await diagnosisService.performDiagnosis(userData);

//         res.status(200).json(result);
//     } catch (error) {
//         // TODO: ส่ง error ไปให้ error handling middleware
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }

// module.exports = { getDiagnosis };