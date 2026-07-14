import React, { useState } from 'react'
import { FormData } from '../types'
import PersonalInfoForm from './PersonalInfoForm'
import SymptomSelection from './SymptomSelection'
import AdditionalInfoForm from './AdditionalInfoForm'

// Declare gtag for Google Analytics
declare global {
  function gtag(...args: any[]): void;
}

interface HealthFormProps {
  onSubmit: (data: FormData) => void
}

const HealthForm: React.FC<HealthFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({
    name: '',
    age: 0,
    sex: 'ชาย',
    weight: 0,
    height: 0,
    symptom_duration: '',
    previous_meal: ''
  })
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [otherSymptomsText, setOtherSymptomsText] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)


  const validateForm = (): string | null => {
    const errors: string[] = [];

    if (!formData.name || !formData.name.trim()) {
      errors.push('กรุณากรอกชื่อ');
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      errors.push('อายุต้องอยู่ระหว่าง 1-120 ปี');
    }

    if (!formData.weight || formData.weight <= 0) {
      errors.push('น้ำหนักต้องมากกว่า 0');
    }

    if (!formData.height || formData.height <= 0) {
      errors.push('ส่วนสูงต้องมากกว่า 0');
    }

    const hasSymptoms = selectedSymptoms.length > 0
    const trimmedOtherText = otherSymptomsText.trim()
    if (!hasSymptoms && !trimmedOtherText) {
      errors.push('กรุณาเลือกอาการอย่างน้อย 1 อย่าง หรืออธิบายอาการในช่องเพิ่มเติม');
    }

    if (errors.length > 0) {
      return errors.join('\n');
    }

    return null;
  };

  const handleFormSubmit = async () => {
    if (!confirmSubmit) {
      setConfirmSubmit(true)
      setTimeout(() => setConfirmSubmit(false), 3000)
      return
    }

    setValidationError(null);

    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    setIsSubmitting(true)

    const trimmedOtherText = otherSymptomsText.trim();
    let finalSymptoms = selectedSymptoms.join(', ')
    if (trimmedOtherText) {
      finalSymptoms += (finalSymptoms ? '. เพิ่มเติม: ' : '') + trimmedOtherText
    }

    const completeFormData: FormData = {
      name: formData.name || '',
      age: formData.age || 0,
      sex: formData.sex || 'ชาย',
      weight: formData.weight || 0,
      height: formData.height || 0,
      symptoms: finalSymptoms,
      symptom_duration: formData.symptom_duration || '',
      previous_meal: formData.previous_meal || ''
    }

    console.log('HealthForm: Sending form data:', completeFormData);

    // Track analyze event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'analyze_submit', {
        event_category: 'engagement',
        event_label: 'health_analysis',
        value: 1,
        custom_parameters: {
          symptoms_count: selectedSymptoms.length,
          has_additional_symptoms: trimmedOtherText ? true : false
        }
      });
    }

    try {
      await onSubmit(completeFormData)
      console.log('HealthForm: onSubmit completed successfully');
    } finally {
      setIsSubmitting(false)
      setConfirmSubmit(false)
    }
  }

  const handlePersonalInfoChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleSelectedSymptomsChange = (symptoms: string[]) => {
    setSelectedSymptoms(symptoms)
  }

  const handleOtherSymptomsChange = (text: string) => {
    setOtherSymptomsText(text)
  }

  const handleAdditionalInfoChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  return (
    <div id="form-wrapper">
      <h1>AI วิเคราะห์สุขภาพเบื้องต้น</h1>
      <h2 style={{ fontSize: '1.1rem', color: '#6c757d', textAlign: 'center', marginTop: '-1rem', marginBottom: '2rem' }}>
        กรุณาให้ข้อมูลที่ละเอียดที่สุดเพื่อผลลัพธ์ที่แม่นยำ<br />
        นี่ไม่ใช่การวินิจฉัยจากแพทย์ ใช้เพียงเพื่อการอ้างอิงเบื้องต้นเท่านั้น
      </h2>

      <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
        <PersonalInfoForm
          data={formData}
          onChange={handlePersonalInfoChange}
        />
        
        <SymptomSelection
          onSymptomsChange={handleSelectedSymptomsChange}
          onOtherSymptomsChange={handleOtherSymptomsChange}
        />
        
        <AdditionalInfoForm
          formData={formData}
          onChange={handleAdditionalInfoChange}
        />

        {validationError && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            margin: '1rem 0',
            border: '1px solid #f5c6cb',
            whiteSpace: 'pre-line'
          }}>
            {validationError}
          </div>
        )}

        <button
          type="submit"
          className="main-button"
          id="submit-button"
          data-confirm={confirmSubmit.toString()}
          disabled={isSubmitting}
        >
          {confirmSubmit ? 'ยืนยันการส่งข้อมูล' : 'ส่งข้อมูลเพื่อวิเคราะห์'}
        </button>
      </form>
    </div>
  )
}

export default HealthForm