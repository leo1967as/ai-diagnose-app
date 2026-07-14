const HISTORY_KEY = 'formHistory'
const MAX_ENTRIES = 20

export interface StoredFormData {
  formData: Record<string, any>
  selectedSymptoms: string[]
  otherSymptomsText: string
}

export function getHistory(): StoredFormData[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addEntry(data: StoredFormData): void {
  const history = getHistory()
  history.unshift(data)
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function deleteEntry(index: number): void {
  const history = getHistory()
  history.splice(index, 1)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}
