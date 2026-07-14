import React from 'react'

const LoadingView: React.FC = () => {
  return (
    <div id="loading-wrapper" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div className="loader" style={{ margin: '0 auto 2rem', width: '60px', height: '60px' }}></div>
      <h2 style={{ fontSize: '1.8rem', color: '#007bff', marginBottom: '1rem' }}>
        AI กำลังวิเคราะห์ข้อมูลของคุณ...
      </h2>
      <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '2rem' }}>
        กำลังคำนวณ BMI, วิเคราะห์อาการ, และปรึกษา AI เพื่อให้คำแนะนำที่เหมาะสม
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#28a745', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
          <span style={{ color: '#28a745' }}>คำนวณ BMI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#007bff', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.3s' }}></div>
          <span style={{ color: '#007bff' }}>วิเคราะห์อาการ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#6f42c1', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.6s' }}></div>
          <span style={{ color: '#6f42c1' }}>ปรึกษา AI</span>
        </div>
      </div>
      <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '2rem' }}>
        กรุณารอสักครู่...
      </p>
    </div>
  )
}

export default LoadingView