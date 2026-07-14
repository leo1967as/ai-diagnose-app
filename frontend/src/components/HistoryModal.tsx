import React from 'react'
import { StoredFormData, getHistory, deleteEntry, clearHistory } from '../services/historyService'

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onRestore: (data: StoredFormData) => void
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onRestore }) => {
  const [history, setHistory] = React.useState<StoredFormData[]>([])

  React.useEffect(() => {
    if (isOpen) setHistory(getHistory())
  }, [isOpen])

  if (!isOpen) return null

  const handleRestore = (entry: StoredFormData, index: number) => {
    onRestore(entry)
    deleteEntry(index)
    onClose()
  }

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  const symptomSummary = (entry: StoredFormData): string => {
    const s = entry.selectedSymptoms
    const o = entry.otherSymptomsText
    if (s.length > 0) {
      const joined = s.slice(0, 3).join(', ')
      const rest = s.length > 3 ? ` +${s.length - 3}` : ''
      return joined + rest
    }
    return o ? o.slice(0, 40) : '(ไม่มีอาการ)'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>ประวัติการถาม</h2>
          <button className="icon-button" onClick={onClose} style={{ fontSize: '1.2rem' }}>✕</button>
        </div>

        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>ยังไม่มีประวัติ</p>
        ) : (
          <>
            {history.map((entry, i) => (
              <div key={i} className="history-item">
                <div className="history-item-body" onClick={() => handleRestore(entry, i)}>
                  <strong>{entry.formData?.name || 'ไม่ระบุชื่อ'}</strong>
                  <span className="history-symptoms">{symptomSummary(entry)}</span>
                </div>
                <button
                  className="history-delete"
                  onClick={(e) => { e.stopPropagation(); deleteEntry(i); setHistory(prev => prev.filter((_, j) => j !== i)) }}
                  title="ลบ"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button className="main-button" onClick={handleClear} style={{ marginTop: '1rem', background: '#dc3545' }}>
              ล้างประวัติทั้งหมด
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default HistoryModal
