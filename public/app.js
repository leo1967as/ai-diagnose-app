// File: public/app.js
const appCard = document.getElementById('app-card');

function showView(viewId) {
    ['form-wrapper', 'loading-wrapper', 'result-wrapper', 'error-wrapper'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
}

document.getElementById('health-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    showView('loading-wrapper');
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        sex: document.querySelector('input[name="sex"]:checked').value,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        symptoms: document.getElementById('symptoms').value
    };

    try {
        // ▼▼▼ จุดแก้ไขที่สำคัญที่สุด! ▼▼▼
        const response = await fetch('http://localhost:3000/api/assess', { 
        // ▲▲▲ แก้จาก /api/assess เป็น URL เต็ม ▲▲▲
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(formData) 
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || contentType.indexOf("application/json") === -1) {
            const errorText = await response.text();
            throw new Error(`เซิร์ฟเวอร์เกิดปัญหา: ${errorText || 'ไม่สามารถอ่านข้อผิดพลาดได้'}`);
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.details || data.error || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
        }

        displayResult(data);
        showView('result-wrapper');
    } catch (error) {
        displayError(error.message);
        showView('error-wrapper');
    }
});

function displayResult(data) {
    const { userInfo, bmi, analysis } = data;
    const resultContainer = document.getElementById('result-wrapper');
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <h2>ผลการวิเคราะห์เบื้องต้นสำหรับคุณ ${userInfo.name}</h2>
            <p class="bmi-display">ดัชนีมวลกาย (BMI): ${bmi.value} (${bmi.category})</p>
        </div>

        <h3 class="section-title">บทวิเคราะห์หลัก</h3>
        <div class="primary-analysis">${analysis.primary_assessment}</div>

        <h3 class="section-title">การประเมินความเสี่ยงของภาวะที่อาจเกี่ยวข้อง</h3>
        <div>${createRiskList(analysis.risk_analysis)}</div>
        
        <h3 class="section-title">คำแนะนำในการดูแลตัวเอง</h3>
        <ul class="styled-list">${createBulletedList(analysis.self_care)}</ul>

        <h3 class="section-title">คำแนะนำด้านอาหาร</h3>
        <h4>อาหารที่แนะนำ</h4>
        <ul class="styled-list">${createBulletedList(analysis.dietary_recommendations.foods_to_eat)}</ul>
        <h4>อาหารที่ควรหลีกเลี่ยง</h4>
        <ul class="styled-list" style="--bullet-color: #ffc107;">${createBulletedList(analysis.dietary_recommendations.foods_to_avoid)}</ul>
        
        <h3 class="section-title">สัญญาณอันตรายที่ควรรีบพบแพทย์</h3>
        <ul class="styled-list red-flags">${createBulletedList(analysis.red_flags)}</ul>
        
        <div style="background-color: #fffde7; padding: 1rem; text-align:center; border-radius: 8px; margin-top: 2rem; border:1px solid #ffecb3;">
           <strong>ข้อควรระวัง:</strong> ${analysis.disclaimer}
        </div>

        <button onclick="resetApp()" class="main-button">ประเมินอีกครั้ง</button>
    `;
}

function createRiskList(risks) {
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

function createBulletedList(items) {
    if (!items || items.length === 0) return '<li>ไม่มีคำแนะนำในส่วนนี้</li>';
    return items.map(item => `<li>${item}</li>`).join('');
}

function displayError(message) {
    const errorContainer = document.getElementById('error-wrapper');
    errorContainer.innerHTML = `
        <h2 style="color:var(--risk-high);">เกิดข้อผิดพลาด</h2>
        <p style="text-align:center; background-color: var(--risk-high-bg); padding: 1rem; border-radius: 8px; color:#58151c;">${message}</p>
        <button onclick="resetApp()" class="main-button">กลับสู่หน้าแรก</button>
    `;
}

function resetApp() {
    document.getElementById('health-form').reset();
    showView('form-wrapper');
}

showView('form-wrapper'); // Initial view