// File: public/js/profile.service.js

const PROFILE_KEY = 'userHealthProfile';

// ฟังก์ชันบันทึกโปรไฟล์ลง localStorage
export function saveProfile(profileData) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
    alert('บันทึกโปรไฟล์สุขภาพเรียบร้อยแล้ว!');
}

// ฟังก์ชันโหลดโปรไฟล์จาก localStorage
export function loadProfile() {
    const profile = localStorage.getItem(PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
}

// ฟังก์ชันรวบรวมข้อมูลจากฟอร์มโปรไฟล์
export function getProfileFromForm() {
    const conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked'))
                           .map(el => el.value);
    const lifestyle = Array.from(document.querySelectorAll('input[name="lifestyle"]:checked'))
                          .map(el => el.value);
    return {
        chronic_conditions: conditions,
        drug_allergy: document.getElementById('drug-allergy').value,
        lifestyle_factors: lifestyle,
        additional_notes: document.getElementById('profile-notes').value 

    };
}

// ฟังก์ชันเติมข้อมูลโปรไฟล์ลงในฟอร์ม (เมื่อเปิด Modal)
export function populateProfileForm() {
    const profile = loadProfile();
    if (profile) {
        profile.chronic_conditions.forEach(condition => {
            const el = document.querySelector(`input[name="condition"][value="${condition}"]`);
            if (el) el.checked = true;
        });
        profile.lifestyle_factors.forEach(factor => {
            const el = document.querySelector(`input[name="lifestyle"][value="${factor}"]`);
            if (el) el.checked = true;
        });
        document.getElementById('drug-allergy').value = profile.drug_allergy || '';
                document.getElementById('profile-notes').value = profile.additional_notes || '';

            }
            else {
                // เพิ่มการเคลียร์ฟอร์ม กรณีไม่มี profile ที่บันทึกไว้
                document.getElementById('profile-form').reset();
           }
}