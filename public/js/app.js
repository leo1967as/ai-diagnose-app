// File: public/js/app.js

import api from './api.service.js';
import * as ui from './ui.service.js';
import * as profile from './profile.service.js'; // <-- Import service ใหม่

// --- Element References ---
const healthForm = document.getElementById('health-form');
const otherSymptomsTextarea = document.getElementById('other-symptoms');
const appCard = document.getElementById('app-card');

// --- Event Listeners ---

// จัดการการส่งฟอร์ม
healthForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const checkedSymptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked'));
    const otherSymptomsText = otherSymptomsTextarea.value.trim();
    if (checkedSymptoms.length === 0 && otherSymptomsText === '') {
        alert('กรุณาเลือกอาการอย่างน้อย 1 อย่าง หรืออธิบายอาการในช่องเพิ่มเติม');
        return;
    }

    ui.showView('loading-wrapper');

    let finalSymptoms = checkedSymptoms.map(cb => cb.value).join(', ');
    if (otherSymptomsText) {
        finalSymptoms += (finalSymptoms ? '. เพิ่มเติม: ' : '') + otherSymptomsText;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        sex: document.querySelector('input[name="sex"]:checked').value,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        symptoms: finalSymptoms,
        // ▼▼▼ ส่วนที่เพิ่มเข้ามา ▼▼▼
        symptom_duration: document.getElementById('symptom-duration').value,
        previous_meal: document.getElementById('previous-meal').value || 'ไม่ได้ระบุ' ,
        // || 'ไม่ได้ระบุ' เพื่อป้องกันค่าว่าง
                health_profile: profile.loadProfile()

    };

    try {
        const data = await api.getAiAssessment(formData);
        ui.displayResult(data);
        ui.showView('result-wrapper');
    } catch (error) {
        ui.displayError(error.message);
        ui.showView('error-wrapper');
    }
});

// -- listeners สำหรับ Profile Modal --
openProfileButton.addEventListener('click', () => {
    profile.populateProfileForm(); // เติมข้อมูลเก่าก่อนแสดง
    profileModal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) { // ปิดเมื่อคลิกที่พื้นหลังสีเทา
        profileModal.style.display = 'none';
    }
});

profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const profileData = profile.getProfileFromForm();
    profile.saveProfile(profileData);
    profileModal.style.display = 'none';
});

// จัดการปัญหาคีย์บอร์ดมือถือ
otherSymptomsTextarea.addEventListener('focus', () => {
    setTimeout(() => {
        otherSymptomsTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
});

// จัดการปุ่ม "ประเมินอีกครั้ง" (วิธีที่ดีกว่า onclick)
appCard.addEventListener('click', (e) => {
    if (e.target.matches('#reset-button') || e.target.matches('#reset-button-error')) {
        ui.resetApp();
    }
});


// --- Initial State ---
ui.showView('form-wrapper');