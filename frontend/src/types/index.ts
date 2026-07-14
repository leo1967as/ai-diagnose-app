// Form Data Types
export interface FormData {
  name: string
  age: number
  sex: 'ชาย' | 'หญิง'
  weight: number
  height: number
  symptoms: string
  symptom_duration: string
  previous_meal: string
}

// Health Profile Types
export interface HealthProfile {
  chronic_conditions: string[]
  drug_allergy: string
  lifestyle_factors: string[]
  additional_notes: string
}

// BMI Calculation Types
export interface BMI {
  value: string
  category: string
  weight: string
  height: string
}

// Risk Analysis Types
export interface RiskAnalysis {
  riskLevel: 'high' | 'medium' | 'low' | 'info'
  condition: string
  rationale: string
}

// Personalized Care Types
export interface CareRecommendations {
  immediateActions: string[]
  generalWellness: string[]
  activityGuidance: {
    recommended: string[]
    toAvoid: string[]
  }
}

// Dietary Recommendations Types
export interface DietarySuggestions {
  concept: string
  foodsToEat: {
    mainDishes: string[]
    snacksAndFruits: string[]
    drinks: string[]
  }
  foodsToAvoid: string[]
}

// AI Analysis Types
export interface AIAnalysis {
  primaryAssessment: string
  riskAnalysis: RiskAnalysis[]
  personalizedCare: CareRecommendations
  dietaryRecommendations: DietarySuggestions
  redFlags: string[]
  disclaimer: string
}

// User Info Types
export interface UserInfo {
  name: string
}

// Location Types
export interface Location {
  name: string
  address: string
  lat: number
  lng: number
  phone?: string
  distance: number
  type: 'hospital' | 'pharmacy'
}

// Diagnosis Result Types
export interface DiagnosisResult {
  analysis: AIAnalysis
  userInfo: UserInfo
  bmi: BMI
  locations?: Location[]
}

// API Response Types
export interface APIResponse {
  success: boolean
  data?: DiagnosisResult
  error?: string
  details?: string
}