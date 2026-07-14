import axios from 'axios'
import { DiagnosisResult, APIResponse } from '../types'

const API_URL = '/api/assess'

class ApiService {
  async getAiAssessment(formData: {
    name: string;
    age: number;
    sex: string;
    weight: number;
    height: number;
    symptoms: string;
    symptom_duration: string;
    previous_meal: string;
    health_profile?: import('../types').HealthProfile;
  }): Promise<DiagnosisResult> {
    const maxRetries = 2;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post<APIResponse>(API_URL, formData, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000, // 30 seconds timeout (เพิ่มจาก 10 เป็น 30 วินาที)
        });

        // Check if response is valid JSON
        if (!response.headers['content-type']?.includes('application/json')) {
          throw new Error('เซิร์ฟเวอร์ไม่ได้ตอบกลับเป็น JSON');
        }

        const data = response.data;

        if (response.status !== 200 || !data.success) {
          throw new Error(data.details || data.error || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ที่ไม่ระบุสาเหตุ');
        }

        return data.data as DiagnosisResult;
      } catch (error: unknown) {
        lastError = error;

        // Retry on network errors or timeouts, not on 4xx client errors
        const isRetryable = axios.isAxiosError(error) &&
          (!error.response || error.code === 'ECONNABORTED' || error.response?.status >= 500);

        if (!isRetryable || attempt === maxRetries) {
          console.error('API Service Error:', error);
          throw error;
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }

    throw lastError;
  }
}

export const apiService = new ApiService()