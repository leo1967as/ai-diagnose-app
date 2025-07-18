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
    const { userInfo, bmi, analysis } = data;
    const resultContainer = document.getElementById('result-wrapper');
    // โค้ดสร้าง HTML เหมือนเดิมทุกประการ
    resultContainer.innerHTML =  `
        <div class="result-header">
            <h2>ผลการวิเคราะห์เบื้องต้นสำหรับคุณ ${userInfo.name}</h2>
            <p class="bmi-display">ดัชนีมวลกาย (BMI): ${bmi.value} (${bmi.category})</p>
        </div>

        <h3 class="section-title">บทวิเคราะห์หลัก</h3>
        <div class="primary-analysis">${analysis.primary_assessment}</div>

        <h3 class="section-title">การประเมินความเสี่ยงของภาวะที่อาจเกี่ยวข้อง</h3>
        <div>${createRiskList(analysis.risk_analysis)}</div>
        
        <h3 class="section-title">คำแนะนำในการดูแลตัวเองแบบเฉพาะบุคคล</h3>
        <h4>สิ่งที่ควรทำทันที</h4>
        <ul class="styled-list">${createBulletedList(analysis.personalized_care.immediate_actions)}</ul>
        <h4>การดูแลสุขภาพโดยรวม</h4>
        <ul class="styled-list">${createBulletedList(analysis.personalized_care.general_wellness)}</ul>
        <h4>ข้อแนะนำด้านกิจกรรม</h4>
        <p><strong>ที่แนะนำ:</strong> ${analysis.personalized_care.activity_guidance.recommended.join(', ')}</p>
        <p><strong>ที่ควรเลี่ยง:</strong> ${analysis.personalized_care.activity_guidance.to_avoid.join(', ')}</p>

        <h3 class="section-title">คำแนะนำด้านโภชนาการ</h3>
        <p><i>${analysis.dietary_recommendations.concept}</i></p>
        <div class="diet-recommendations">
            <div>
                <strong>อาหารที่แนะนำ:</strong>
                <ul>
                  <li><strong>อาหารหลัก:</strong> ${analysis.dietary_recommendations.foods_to_eat.main_dishes.join(', ')}</li>
                  <li><strong>ของว่าง/ผลไม้:</strong> ${analysis.dietary_recommendations.foods_to_eat.snacks_and_fruits.join(', ')}</li>
                  <li><strong>เครื่องดื่ม:</strong> ${analysis.dietary_recommendations.foods_to_eat.drinks.join(', ')}</li>
                </ul>
            </div>
            <div>
                <strong>อาหารที่ควรหลีกเลี่ยง:</strong>
                <ul>${createBulletedList(analysis.dietary_recommendations.foods_to_avoid)}</ul>
            </div>
        </div>
        
        <h3 class="section-title">สัญญาณอันตรายที่ควรรีบพบแพทย์</h3>
        <ul class="styled-list red-flags">${createBulletedList(analysis.red_flags)}</ul>
        
        <div style="background-color: #fffde7; padding: 1rem; text-align:center; border-radius: 8px; margin-top: 2rem; border:1px solid #ffecb3;">
           <strong>ข้อควรระวัง:</strong> ${analysis.disclaimer}
        </div>

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