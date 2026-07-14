import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DiagnosisResult, AIAnalysis } from '../types'
import LocationView from '../components/LocationView'
import FeedbackModal from '../components/FeedbackModal'

const Analysis: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // รับ result จาก navigation state
  const result = location.state?.result as DiagnosisResult

  console.log('Analysis page: Rendering with result from state:', result)

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const openFeedbackModal = () => {
    setIsFeedbackOpen(true)
  }

  const closeFeedbackModal = () => {
    setIsFeedbackOpen(false)
  }

  const handleReset = () => {
    navigate('/')
  }

  if (!result || !result.analysis) {
    return (
      <div id="analysis-wrapper">
        <p style={{ textAlign: 'center', color: '#6c757d' }}>ไม่มีข้อมูลการวิเคราะห์ กรุณาลองใหม่อีกครั้ง</p>
        <button className="main-button" onClick={handleReset}>ลองใหม่</button>
      </div>
    )
  }

  const { analysis, userInfo } = result
  const safeAnalysis = analysis as AIAnalysis

  const createRiskList = (risks: any[]) => {
    if (!risks || risks.length === 0) return <p>AI ไม่พบภาวะที่เกี่ยวข้องอย่างชัดเจน</p>
    const riskLevelMap: { [key: string]: string } = {
      high: 'เสี่ยงสูง',
      medium: 'เสี่ยงปานกลาง',
      low: 'เสี่ยงน้อย',
      info: 'ข้อมูล'
    }
    return risks.map((risk, index) => (
      <div key={index} className="risk-card" data-risk={risk.riskLevel}>
        <div className="risk-card-header">
          <span className="risk-label" data-risk={risk.riskLevel}>
            {riskLevelMap[risk.riskLevel] || risk.riskLevel}
          </span>
          <span>{risk.condition || 'ไม่ระบุ'}</span>
        </div>
        <p style={{margin: 0, color: '#555'}}><strong>เหตุผล:</strong> {risk.rationale || 'ไม่พบเหตุผล'}</p>
      </div>
    ))
  }

  const createBulletedList = (items: string[]) => {
    if (!items || items.length === 0) return <li>ไม่มีคำแนะนำในส่วนนี้</li>
    return items.map((item, index) => <li key={index}>{item || 'ไม่ระบุ'}</li>)
  }

  return (
    <div id="analysis-wrapper" className="analysis-card">
      <div className="result-header">
        <h2>การวิเคราะห์ AI สำหรับ {userInfo.name || 'ผู้ใช้'}</h2>
        <p>ผลการวิเคราะห์เบื้องต้นจากอาการที่แจ้ง</p>
      </div>

      <aside className="disclaimer-card">
        <div className="disclaimer-icon">⚠️</div>
        <div className="disclaimer-content">
          <strong>ข้อควรระวังสำคัญ</strong>
          <p>{safeAnalysis.disclaimer || 'การประเมินนี้สร้างโดย AI เพื่อให้คำแนะนำเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ได้ กรุณาปรึกษาบุคลากรทางการแพทย์เพื่อรับการวินิจฉัยและการรักษาที่ถูกต้อง'}</p>
        </div>
      </aside>

      <h3 className="section-title">บทวิเคราะห์หลัก</h3>
      <div className="primary-analysis">{safeAnalysis.primaryAssessment || 'ไม่พบบทวิเคราะห์หลัก'}</div>

      <h3 className="section-title">การประเมินความเสี่ยง</h3>
      <div>{createRiskList(safeAnalysis.riskAnalysis || [])}</div>

      <h3 className="section-title">คำแนะนำในการดูแลตัวเอง</h3>
      <h4>สิ่งที่ควรทำทันที</h4>
      <ul className="styled-list">{createBulletedList(safeAnalysis.personalizedCare?.immediateActions || [])}</ul>
      <h4>การดูแลสุขภาพโดยรวม</h4>
      <ul className="styled-list">{createBulletedList(safeAnalysis.personalizedCare?.generalWellness || [])}</ul>
      <h4>ข้อแนะนำด้านกิจกรรม</h4>
      <p><strong>ที่แนะนำ:</strong> {safeAnalysis.personalizedCare?.activityGuidance?.recommended?.join(', ') || 'ไม่มีคำแนะนำเฉพาะ'}</p>
      <p><strong>ที่ควรเลี่ยง:</strong> {safeAnalysis.personalizedCare?.activityGuidance?.toAvoid?.join(', ') || 'ไม่มีคำแนะนำเฉพาะ'}</p>

      <h3 className="section-title">คำแนะนำด้านโภชนาการ</h3>
      <p><i>{safeAnalysis.dietaryRecommendations?.concept || 'เน้นอาหารที่ย่อยง่ายและมีประโยชน์'}</i></p>
      <div className="diet-recommendations">
        <div>
          <strong>อาหารที่แนะนำ:</strong>
          <ul>
            <li><strong>อาหารหลัก:</strong> {safeAnalysis.dietaryRecommendations?.foodsToEat?.mainDishes?.join(', ') || 'ไม่มี'}</li>
            <li><strong>ของว่าง/ผลไม้:</strong> {safeAnalysis.dietaryRecommendations?.foodsToEat?.snacksAndFruits?.join(', ') || 'ไม่มี'}</li>
            <li><strong>เครื่องดื่ม:</strong> {safeAnalysis.dietaryRecommendations?.foodsToEat?.drinks?.join(', ') || 'ไม่มี'}</li>
          </ul>
        </div>
        <div>
          <strong>อาหารที่ควรหลีกเลี่ยง:</strong>
          <ul>{createBulletedList(safeAnalysis.dietaryRecommendations?.foodsToAvoid || [])}</ul>
        </div>
      </div>

      <h3 className="section-title">สัญญาณอันตราย</h3>
      <ul className="styled-list red-flags">{createBulletedList(safeAnalysis.redFlags || [])}</ul>

      <LocationView />
    
      <div className="analysis-actions">
        <button className="main-button secondary" onClick={openFeedbackModal}>
          ประเมินการใช้งานเว็บไซต์
        </button>
        <button className="main-button" onClick={handleReset}>
          วิเคราะห์อาการอีกครั้ง
        </button>
      </div>
    
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={closeFeedbackModal}
      />
    </div>
  )
}

export default Analysis