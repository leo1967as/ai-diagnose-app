import React from 'react'
import { useNavigate } from 'react-router-dom'
import HealthForm from '../components/HealthForm'
import ProfileModal from '../components/ProfileModal'
import NearbyLocationsModal from '../components/NearbyLocationsModal'
import { FormData } from '../types'
import { useApi } from '../hooks/useApi'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { getAssessment } = useApi()
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState<boolean>(false)
  const [isNearbyModalOpen, setIsNearbyModalOpen] = React.useState<boolean>(false)

  const handleFormSubmit = async (data: FormData) => {
    console.log('Home: handleFormSubmit called with data:', data)
    console.log('Home: About to navigate to /loading')
    navigate('/loading')
    console.log('Home: Navigate to /loading called')

    try {
      const result = await getAssessment(data)
      console.log('Home: getAssessment returned:', result)
      if (result) {
        console.log('Home: About to navigate to /analysis')
        navigate('/analysis', { state: { result } })
        console.log('Home: Navigated to analysis with result')
      } else {
        console.log('Home: Result is falsy, about to navigate to error')
        navigate('/error', { state: { message: 'No analysis data received from server. Please try again.' } })
        console.log('Home: Navigated to error due to falsy result')
      }
    } catch (error: any) {
      console.log('Home: Error in getAssessment:', error)
      const errorMessage = error?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์'
      const errorType = error?.errorType || 'server'
      console.log('Home: About to navigate to error due to exception')
      navigate('/error', { state: { message: errorMessage, errorType } })
      console.log('Home: Navigated to error due to exception')
    }
  }

  const openProfileModal = () => {
    setIsProfileModalOpen(true)
  }

  const closeProfileModal = () => {
    setIsProfileModalOpen(false)
  }

  const openNearbyModal = () => {
    setIsNearbyModalOpen(true)
  }

  const closeNearbyModal = () => {
    setIsNearbyModalOpen(false)
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button
            className="icon-button"
            onClick={openProfileModal}
          >
            ⚙️ โปรไฟล์สุขภาพ
          </button>

          <button
            className="icon-button"
            onClick={openNearbyModal}
          >
            📍 สถานที่ใกล้เคียง
          </button>
        </div>

        <HealthForm onSubmit={handleFormSubmit} />
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />

      <NearbyLocationsModal
        isOpen={isNearbyModalOpen}
        onClose={closeNearbyModal}
      />
    </>
  )
}

export default Home