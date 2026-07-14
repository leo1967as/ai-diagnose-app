import React from 'react'

const Loading: React.FC = () => {
  console.log('Loading page: Rendering')
  return (
    <div id="loading-wrapper" style={{
      textAlign: 'center',
      padding: '3rem 1rem',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px solid red' // Debug border
    }}>
      {/* Simple loading spinner */}
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 2rem'
      }}></div>

      <h2 style={{
        fontSize: '1.8rem',
        color: '#007bff',
        marginBottom: '1rem',
        fontWeight: 'bold'
      }}>
        AI กำลังวิเคราะห์ข้อมูลของคุณ...
      </h2>

      <p style={{
        fontSize: '1.1rem',
        color: '#6c757d',
        marginBottom: '2rem',
        maxWidth: '600px'
      }}>
        กำลังคำนวณ BMI, วิเคราะห์อาการ, และปรึกษา AI เพื่อให้คำแนะนำที่เหมาะสม
      </p>

      {/* Status indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#28a745',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite'
          }}></div>
          <span style={{ color: '#28a745', fontWeight: '500' }}>คำนวณ BMI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#007bff',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite 0.3s'
          }}></div>
          <span style={{ color: '#007bff', fontWeight: '500' }}>วิเคราะห์อาการ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#6f42c1',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite 0.6s'
          }}></div>
          <span style={{ color: '#6f42c1', fontWeight: '500' }}>ปรึกษา AI</span>
        </div>
      </div>

      <p style={{
        fontSize: '0.9rem',
        color: '#6c757d',
        fontStyle: 'italic'
      }}>
        กรุณารอสักครู่...
      </p>

      {/* Add CSS animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default Loading