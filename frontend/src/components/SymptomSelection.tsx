import React, { useState } from 'react'

interface SymptomSelectionProps {
  onSymptomsChange: (symptoms: string[]) => void
  onOtherSymptomsChange: (text: string) => void
}

const SymptomSelection: React.FC<SymptomSelectionProps> = ({
  onSymptomsChange,
  onOtherSymptomsChange
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [otherSymptoms, setOtherSymptoms] = useState('')

  const symptomCategories = [
    {
      title: 'อาการทั่วไป',
      symptoms: [
        { value: 'มีไข้', label: 'มีไข้' },
        { value: 'อ่อนเพลีย/ไม่มีแรง', label: 'อ่อนเพลีย/ไม่มีแรง' },
        { value: 'ปวดเมื่อยตามตัว', label: 'ปวดเมื่อยตามตัว' },
        { value: 'หนาวสั่น', label: 'หนาวสั่น' }
      ]
    },
    {
      title: 'ศีรษะและลำคอ',
      symptoms: [
        { value: 'ปวดศีรษะ', label: 'ปวดศีรษะ' },
        { value: 'เวียนศีรษะ/บ้านหมุน', label: 'เวียนศีรษะ/บ้านหมุน' },
        { value: 'เจ็บคอ', label: 'เจ็บคอ' },
        { value: 'คัดจมูก/น้ำมูกไหล', label: 'คัดจมูก/น้ำมูกไหล' }
      ]
    },
    {
      title: 'ระบบทางเดินหายใจ',
      symptoms: [
        { value: 'ไอแห้ง', label: 'ไอแห้ง' },
        { value: 'ไอมีเสมหะ', label: 'ไอมีเสมหะ' },
        { value: 'หายใจลำบาก/หายใจถี่', label: 'หายใจลำบาก/หายใจถี่' },
        { value: 'เจ็บหน้าอก', label: 'เจ็บหน้าอก' }
      ]
    },
    {
      title: 'ระบบทางเดินอาหาร',
      symptoms: [
        { value: 'ปวดท้อง', label: 'ปวดท้อง' },
        { value: 'คลื่นไส้/อาเจียน', label: 'คลื่นไส้/อาเจียน' },
        { value: 'ท้องเสีย', label: 'ท้องเสีย' },
        { value: 'ท้องผูก', label: 'ท้องผูก' },
        { value: 'ท้องอืด', label: 'ท้องอืด' }
      ]
    }
  ]

  const handleSymptomChange = (symptomValue: string, checked: boolean) => {
    let newSymptoms: string[]
    if (checked) {
      newSymptoms = [...selectedSymptoms, symptomValue]
    } else {
      newSymptoms = selectedSymptoms.filter(s => s !== symptomValue)
    }
    setSelectedSymptoms(newSymptoms)
    onSymptomsChange(newSymptoms)
  }

  const handleOtherSymptomsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setOtherSymptoms(value)
    onOtherSymptomsChange(value)
  }

  return (
    <div>
      <h3 className="section-title">อาการหลัก (เลือกได้มากกว่า 1 ข้อ)</h3>
      
      {symptomCategories.map((category, index) => (
        <div key={index} className="symptom-category">
          <fieldset>
            <legend>{category.title}</legend>
            <div className="symptom-grid">
              {category.symptoms.map((symptom, symptomIndex) => (
                <label key={symptomIndex}>
                  <input
                    type="checkbox"
                    name="symptom"
                    value={symptom.value}
                    checked={selectedSymptoms.includes(symptom.value)}
                    onChange={(e) => handleSymptomChange(symptom.value, e.target.checked)}
                  />
                  {symptom.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ))}

      <h3 className="section-title">ข้อมูลอาการเพิ่มเติม</h3>
      <div className="form-group full-span" style={{ marginTop: '1.5rem' }}>
        <label htmlFor="other-symptoms">อาการอื่นๆ เพิ่มเติม (ถ้ามี)</label>
        <textarea 
          id="other-symptoms" 
          rows={4} 
          value={otherSymptoms}
          onChange={handleOtherSymptomsChange}
          placeholder="กรุณาอธิบายรายละเอียดเพิ่มเติม เช่น ตำแหน่งที่ปวด, ปวดแบบไหน, เป็นมานานเท่าไหร่"
        />
      </div>
    </div>
  )
}

export default SymptomSelection