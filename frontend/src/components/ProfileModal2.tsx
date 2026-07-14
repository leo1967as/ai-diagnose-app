import React, { useEffect, useState } from 'react'
import { HealthProfile } from '../types'
import { profileService } from '../services/profileService'

interface ProfileModal2Props {
  isOpen: boolean
  onClose: () => void
}

const ProfileModal2: React.FC<ProfileModal2Props> = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState<HealthProfile>({
    chronic_conditions: [],
    drug_allergy: '',
    lifestyle_factors: [],
    additional_notes: ''
  })

  useEffect(() => {
    if (isOpen) {
      const existingProfile = profileService.loadProfile()
      if (existingProfile) {
        setProfileData(existingProfile)
      }
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    profileService.saveProfile(profileData)
    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target
    setProfileData(prev => {
      if (name === 'condition') {
        const conditions = checked
          ? [...prev.chronic_conditions, value]
          : prev.chronic_conditions.filter(c => c !== value)
        return { ...prev, chronic_conditions: conditions }
      } else if (name === 'lifestyle') {
        const factors = checked
          ? [...prev.lifestyle_factors, value]
          : prev.lifestyle_factors.filter(f => f !== value)
        return { ...prev, lifestyle_factors: factors }
      }
      return prev
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>โปรไฟล์สุขภาพของฉัน (Modal 2)</h2>
        <p>การให้ข้อมูลนี้จะช่วยให้ AI วิเคราะห์ได้แม่นยำยิ่งขึ้น (ข้อมูลจะถูกบันทึกไว้ในเบราว์เซอร์ของคุณเท่านั้น)</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>โรคประจำตัว (เลือกได้มากกว่า 1 ข้อ)</label>
            <div className="profile-grid">
              <label>
                <input
                  type="checkbox"
                  name="condition"
                  value="โรคเบาหวาน"
                  checked={profileData.chronic_conditions.includes('โรคเบาหวาน')}
                  onChange={handleCheckboxChange}
                />
                เบาหวาน
              </label>
              <label>
                <input
                  type="checkbox"
                  name="condition"
                  value="โรคความดันโลหิตสูง"
                  checked={profileData.chronic_conditions.includes('โรคความดันโลหิตสูง')}
                  onChange={handleCheckboxChange}
                />
                ความดันสูง
              </label>
              <label>
                <input
                  type="checkbox"
                  name="condition"
                  value="โรคภูมิแพ้/หอบหืด"
                  checked={profileData.chronic_conditions.includes('โรคภูมิแพ้/หอบหืด')}
                  onChange={handleCheckboxChange}
                />
                ภูมิแพ้/หอบหืด
              </label>
              <label>
                <input
                  type="checkbox"
                  name="condition"
                  value="โรคหัวใจ"
                  checked={profileData.chronic_conditions.includes('โรคหัวใจ')}
                  onChange={handleCheckboxChange}
                />
                โรคหัวใจ
              </label>
              <label>
                <input
                  type="checkbox"
                  name="condition"
                  value="โรคกระเพาะอาหาร/กรดไหลย้อน"
                  checked={profileData.chronic_conditions.includes('โรคกระเพาะอาหาร/กรดไหลย้อน')}
                  onChange={handleCheckboxChange}
                />
                โรคกระเพาะ/กรดไหลย้อน
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="drug-allergy-2">ยาที่แพ้ (ถ้ามี)</label>
            <input
              type="text"
              id="drug-allergy-2"
              name="drug_allergy"
              value={profileData.drug_allergy}
              onChange={handleInputChange}
              placeholder="เช่น เพนนิซิลลิน (Penicillin)"
            />
          </div>

          <div className="form-group">
            <label>ไลฟ์สไตล์</label>
            <div className="profile-grid">
              <label>
                <input
                  type="checkbox"
                  name="lifestyle"
                  value="สูบบุหรี่เป็นประจำ"
                  checked={profileData.lifestyle_factors.includes('สูบบุหรี่เป็นประจำ')}
                  onChange={handleCheckboxChange}
                />
                สูบบุหรี่
              </label>
              <label>
                <input
                  type="checkbox"
                  name="lifestyle"
                  value="ดื่มแอลกอฮอล์เป็นประจำ"
                  checked={profileData.lifestyle_factors.includes('ดื่มแอลกอฮอล์เป็นประจำ')}
                  onChange={handleCheckboxChange}
                />
                ดื่มแอลกอฮอล์
              </label>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="profile-notes-2">ข้อมูลสุขภาพอื่นๆ ที่สำคัญ (นอกเหนือจากด้านบน)</label>
            <textarea
              id="profile-notes-2"
              name="additional_notes"
              value={profileData.additional_notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="เช่น: กำลังตั้งครรภ์, มีภาวะโลหิตจาง, แพ้อาหารทะเล, เพิ่งหายจากโควิด"
            />
          </div>

          <button type="submit" className="main-button">
            บันทึกโปรไฟล์ (Modal 2)
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal2