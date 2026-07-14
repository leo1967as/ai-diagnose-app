import React from 'react'
import { useNavigate } from 'react-router-dom'
import HealthForm from '../components/HealthForm'
import ProfileModal from '../components/ProfileModal'
import NearbyLocationsModal from '../components/NearbyLocationsModal'
import HistoryModal from '../components/HistoryModal'
import { FormData } from '../types'
import { useApi } from '../hooks/useApi'
import { addEntry } from '../services/historyService'
import type { StoredFormData } from '../services/historyService'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { getAssessment } = useApi()
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState<boolean>(false)
  const [isNearbyModalOpen, setIsNearbyModalOpen] = React.useState<boolean>(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState<boolean>(false)
  const [formKey, setFormKey] = React.useState(0)
  const [restoreData, setRestoreData] = React.useState<StoredFormData | undefined>()

  const handleFormSubmit = async (data: FormData) => {
    console.log('Home: handleFormSubmit called with data:', data)
    navigate('/loading')

    try {
      const result = await getAssessment(data)
      console.log('Home: getAssessment returned:', result)
      if (result) {
        navigate('/analysis', { state: { result } })
        console.log('Home: Navigated to analysis with result')
      } else {
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

  const handleSaveFormData = (formData: Partial<FormData>, selectedSymptoms: string[], otherSymptomsText: string) => {
    addEntry({ formData, selectedSymptoms, otherSymptomsText })
  }

  const handleRestore = (data: StoredFormData) => {
    setRestoreData(data)
    setFormKey(k => k + 1)
    setIsHistoryModalOpen(false)
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
      <div className="card" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
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

        <button
          className="history-button"
          onClick={() => setIsHistoryModalOpen(true)}
          title="ประวัติการถาม"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.645 7.343H42.5l-12.145 24.66H5.5z"/>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M42.467 7.353v33.304H18.063V31.98m21.396 5.121l-18.442.004zm-18.442-2.706l18.443.004zm9.573-2.705l8.87.003zm1.352-2.706l7.518.004zm1.353-2.706l6.165.004zm1.353-2.705l4.812.003zM36 20.867l3.46.003zm1.354-2.706l2.106.004zm2.106-2.702h-.85"/>
          </svg>
        </button>

        <HealthForm
          key={formKey}
          onSubmit={handleFormSubmit}
          defaultData={restoreData}
          onSaveHistory={handleSaveFormData}
        />
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />

      <NearbyLocationsModal
        isOpen={isNearbyModalOpen}
        onClose={closeNearbyModal}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onRestore={handleRestore}
      />
    </>
  )
}

export default Home