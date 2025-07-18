// File: public/js/api.service.js

const API_URL = 'http://localhost:3000/api/assess';

async function getAiAssessment(formData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        // Error handling ที่ดีขึ้น: ตรวจสอบก่อนว่า response เป็น JSON หรือไม่
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            throw new Error(`เซิร์ฟเวอร์ไม่ได้ตอบกลับเป็น JSON: ${errorText}`);
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ที่ไม่ระบุสาเหตุ');
        }

        return data; // คืนค่าข้อมูลที่ได้กลับไป
    } catch (error) {
        console.error("API Service Error:", error);
        // ส่งต่อ error ที่เกิดขึ้นเพื่อให้ตัวควบคุมหลักจัดการ
        throw error; 
    }
}

export default { getAiAssessment };