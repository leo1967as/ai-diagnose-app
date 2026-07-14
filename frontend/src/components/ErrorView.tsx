import React from 'react'

interface ErrorViewProps {
  message: string
  errorType?: 'network' | 'validation' | 'server' | 'ai_timeout'
  onReset: () => void
}

const ErrorView: React.FC<ErrorViewProps> = ({ message, errorType, onReset }) => {
  const getErrorIcon = () => {
    switch (errorType) {
      case 'network': return '🌐';
      case 'validation': return '⚠️';
      case 'server': return '🔧';
      case 'ai_timeout': return '⏱️';
      default: return '❌';
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'network': return 'ปัญหาการเชื่อมต่อ';
      case 'validation': return 'ข้อมูลไม่ถูกต้อง';
      case 'server': return 'ปัญหาเซิร์ฟเวอร์';
      case 'ai_timeout': return 'AI ช้าเกินไป';
      default: return 'เกิดข้อผิดพลาด';
    }
  };

  return (
    <div id="error-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '3rem' }}>{getErrorIcon()}</span>
        <h2 style={{ color: 'var(--risk-high)' }}>{getErrorTitle()}</h2>
      </div>
      <p style={{ textAlign: 'center', color: '#6c757d', margin: '1rem 0' }}>
        {message}
      </p>
      <button
        id="reset-button-error"
        className="main-button"
        onClick={onReset}
      >
        กลับสู่หน้าแรก
      </button>
    </div>
  )
}

export default ErrorView