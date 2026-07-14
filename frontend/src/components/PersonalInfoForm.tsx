import React from 'react'
import { FormData } from '../types'

interface PersonalInfoFormProps {
  data: Partial<FormData>
  onChange: (data: Partial<FormData>) => void
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      <h3 className="section-title">ข้อมูลส่วนตัว</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">ชื่อ</label>
          <input
            type="text"
            id="name"
            placeholder="ชื่อเล่น หรือชื่อจริง"
            value={data.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">อายุ (ปี)</label>
          <input
            type="number"
            id="age"
            placeholder="เช่น 25"
            value={data.age || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="form-group">
          <label>เพศ</label>
          <div className="radio-group" style={{ paddingTop: '14px' }}>
            <label>
              <input
                type="radio"
                value="ชาย"
                checked={data.sex === 'ชาย'}
                onChange={(e) => handleInputChange('sex', e.target.value)}
              />
              ชาย
            </label>
            <label>
              <input
                type="radio"
                value="หญิง"
                checked={data.sex === 'หญิง'}
                onChange={(e) => handleInputChange('sex', e.target.value)}
              />
              หญิง
            </label>
          </div>
        </div>
      </div>

      <h3 className="section-title">ข้อมูลร่างกาย</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="weight">น้ำหนัก (กก.)</label>
          <input
            type="number"
            id="weight"
            step="0.1"
            placeholder="เช่น 65.5"
            value={data.weight || ''}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="height">ส่วนสูง (ซม.)</label>
          <input
            type="number"
            id="height"
            placeholder="เช่น 170"
            value={data.height || ''}
            onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoForm