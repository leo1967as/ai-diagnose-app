import React from 'react'
import { FormData } from '../types'

interface AdditionalInfoFormProps {
  formData: Partial<FormData>
  onChange: (data: Partial<FormData>) => void
}

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({ formData, onChange }) => {
  const handleInputChange = (field: keyof FormData, value: string) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      <h3 className="section-title">ข้อมูลเพิ่มเติมเกี่ยวกับอาการ</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="symptom-duration">มีอาการนี้มานานเท่าไหร่แล้ว?</label>
          <input
            type="text"
            id="symptom-duration"
            placeholder="เช่น 2-3 วัน, ประมาณ 1 สัปดาห์"
            value={formData.symptom_duration || ''}
            onChange={(e) => handleInputChange('symptom_duration', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="previous-meal">อาหารมื้อล่าสุดที่ทานคืออะไร?</label>
          <input
            type="text"
            id="previous-meal"
            placeholder="เช่น ส้มตำปูปลาร้า, ข้าวผัดกุ้ง"
            value={formData.previous_meal || ''}
            onChange={(e) => handleInputChange('previous_meal', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfoForm