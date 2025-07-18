// File: public/js/ui.service.js

// ฟังก์ชันสำหรับสลับ View
export function showView(viewId) {
    ['form-wrapper', 'loading-wrapper', 'result-wrapper', 'error-wrapper'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
}

// ฟังก์ชันสำหรับแสดงผลลัพธ์
export function displayResult(data) {
    // 1. ติดตั้งกล้องวงจรปิด
    console.log("Inspecting AI Response Data:", JSON.stringify(data, null, 2));

    // 2. สร้างบังเกอร์: ดึงข้อมูลออกมาอย่างปลอดภัยที่สุด
    // ถ้า data หรือ analysis ไม่มีอยู่ ให้ใช้ Object ว่างๆ แทน
    const analysis = data?.analysis ?? {}; 
    const userInfo = data?.userInfo ?? { name: 'ผู้ใช้' };
    const bmi = data?.bmi ?? { value: 'N/A', category: 'ไม่สามารถคำนวณได้' };

    // ดึงข้อมูลย่อยออกมาพร้อมค่า Default ที่แข็งแกร่งที่สุด
    const personalizedCare = analysis.personalized_care ?? {};
    const activityGuidance = personalizedCare.activity_guidance ?? {};
    const dietRecs = analysis.dietary_recommendations ?? {};
    const foodsToEat = dietRecs.foods_to_eat ?? {};

    // 3. เตรียมข้อมูลที่จะแสดงผล
    const immediateActions = personalizedCare.immediate_actions ?? [];
    const generalWellness = personalizedCare.general_wellness ?? [];
    const recommendedActivities = activityGuidance.recommended ?? [];
    const activitiesToAvoid = activityGuidance.to_avoid ?? [];
    const mainDishes = foodsToEat.main_dishes ?? [];
    const snacksAndFruits = foodsToEat.snacks_and_fruits ?? [];
    const drinks = foodsToEat.drinks ?? [];
    const foodsToAvoid = dietRecs.foods_to_avoid ?? [];
    const redFlags = analysis.red_flags ?? [];
    
    const resultContainer = document.getElementById('result-wrapper');
    // โค้ดสร้าง HTML เหมือนเดิมทุกประการ
    resultContainer.innerHTML =  `
        <div class="result-header">
            <h2>ผลการวิเคราะห์เบื้องต้นสำหรับคุณ ${userInfo.name}</h2>
            <p class="bmi-display">ดัชนีมวลกาย (BMI): ${bmi.value} (${bmi.category})</p>
        </div>
        <h3 class="section-title">บทวิเคราะห์หลัก</h3>
        <div class="primary-analysis">${analysis.primary_assessment ?? 'ไม่พบบทวิเคราะห์หลัก'}</div>

        <h3 class="section-title">การประเมินความเสี่ยง</h3>
        <div>${createRiskList(analysis.risk_analysis ?? [])}</div>
        
        <h3 class="section-title">คำแนะนำในการดูแลตัวเอง</h3>
        <h4>สิ่งที่ควรทำทันที</h4>
        <ul class="styled-list">${createBulletedList(immediateActions)}</ul>
        <h4>การดูแลสุขภาพโดยรวม</h4>
        <ul class="styled-list">${createBulletedList(generalWellness)}</ul>
        <h4>ข้อแนะนำด้านกิจกรรม</h4>
        <p><strong>ที่แนะนำ:</strong> ${recommendedActivities.length > 0 ? recommendedActivities.join(', ') : 'ไม่มีคำแนะนำเฉพาะ'}</p>
        <p><strong>ที่ควรเลี่ยง:</strong> ${activitiesToAvoid.length > 0 ? activitiesToAvoid.join(', ') : 'ไม่มีคำแนะนำเฉพาะ'}</p>
        
        <h3 class="section-title">คำแนะนำด้านโภชนาการ</h3>
        <p><i>${dietRecs.concept ?? 'เน้นอาหารที่ย่อยง่ายและมีประโยชน์'}</i></p>
        <div class="diet-recommendations">
            <div>
                <strong>อาหารที่แนะนำ:</strong>
                <ul>
                  <li><strong>อาหารหลัก:</strong> ${mainDishes.length > 0 ? mainDishes.join(', ') : 'ไม่มี'}</li>
                  <li><strong>ของว่าง/ผลไม้:</strong> ${snacksAndFruits.length > 0 ? snacksAndFruits.join(', ') : 'ไม่มี'}</li>
                  <li><strong>เครื่องดื่ม:</strong> ${drinks.length > 0 ? drinks.join(', ') : 'ไม่มี'}</li>
                </ul>
            </div>
            <div>
                <strong>อาหารที่ควรหลีกเลี่ยง:</strong>
                <ul>${createBulletedList(foodsToAvoid)}</ul>
            </div>
        </div>

        <h3 class="section-title">สัญญาณอันตราย</h3>
        <ul class="styled-list red-flags">${createBulletedList(redFlags)}</ul>
        <div style="...">${analysis.disclaimer ?? 'โปรดปรึกษาแพทย์'}</div>
        <button id="reset-button" class="main-button">ประเมินอีกครั้ง</button>
    `;
}

// ฟังก์ชันสำหรับแสดง Error
export function displayError(message) {
    const errorContainer = document.getElementById('error-wrapper');
    errorContainer.innerHTML = `
        <h2 style="color:var(--risk-high);">เกิดข้อผิดพลาด</h2>
        <p style="text-align:center; ...">${message}</p>
        <button id="reset-button-error" class="main-button">กลับสู่หน้าแรก</button>
    `;
}

// ย้ายฟังก์ชันย่อยมาไว้ในนี้ด้วย
export function createRiskList(risks) {
    if (!risks || risks.length === 0) return '<p>AI ไม่พบภาวะที่เกี่ยวข้องอย่างชัดเจน</p>';
    const riskLevelMap = { high: 'เสี่ยงสูง', medium: 'เสี่ยงปานกลาง', low: 'เสี่ยงน้อย', info: 'ข้อมูล' };
    return risks.map(risk => `
        <div class="risk-card" data-risk="${risk.risk_level}">
            <div class="risk-card-header">
                <span class="risk-label" data-risk="${risk.risk_level}">${riskLevelMap[risk.risk_level]}</span>
                <span>${risk.condition}</span>
            </div>
            <p style="margin:0; color: #555;"><strong>เหตุผล:</strong> ${risk.rationale}</p>
        </div>
    `).join('');
}
export function createBulletedList(items) {
    if (!items || items.length === 0) return '<li>ไม่มีคำแนะนำในส่วนนี้</li>';
    return items.map(item => `<li>${item}</li>`).join('');
}

// ฟังก์ชันสำหรับรีเซ็ตแอป
export function resetApp() {
    document.getElementById('health-form').reset();
    showView('form-wrapper');
}