import { useState } from 'react';
import { AxiosError } from 'axios';
import { apiService } from '../services/apiService';
import { profileService } from '../services/profileService';
import { FormData, DiagnosisResult } from '../types';

export const useApi = () => {
  const [data, setData] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'network' | 'validation' | 'server' | 'ai_timeout' | null>(null);

  const getAssessment = async (formData: FormData): Promise<DiagnosisResult | null> => {
    console.log('useApi: Starting getAssessment with formData:', formData);
    console.log('useApi: Initial states - loading:', loading, 'data:', data, 'error:', error);

    setLoading(true);
    setError(null);
    try {
      console.log('useApi: Calling apiService.getAiAssessment');
      const result = await apiService.getAiAssessment({
        ...formData,
        health_profile: profileService.loadProfile() || undefined
      });
      console.log('useApi: API response received:', result);
      setData(result);
      console.log('useApi: setData called with:', result);

      // Enhanced error handling for empty/null results
      if (!result || Object.keys(result).length === 0) {
        const emptyError = 'No analysis data received from server. Please try again.';
        setError(emptyError);
        setErrorType('server');
        console.log('useApi: Empty result detected, setting error:', emptyError);
        throw new Error(emptyError);
      }

      console.log('useApi: Current states after setData - data:', result, 'loading:', false);
      return result;
    } catch (err: unknown) {
      let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';
      let errorType: 'network' | 'validation' | 'server' | 'ai_timeout' | null = null;

      if (err instanceof AxiosError) {
        if (!err.response) {
          errorType = 'network';
          errorMessage = 'ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบการเชื่อมต่อ';
        } else if (err.response.status >= 400 && err.response.status < 500) {
          errorType = 'validation';
          errorMessage = err.response.data?.details || 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบข้อมูล';
        } else if (err.response.status >= 500) {
          errorType = 'server';
          errorMessage = 'เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่อีกครั้ง';
        }
      } else if (err instanceof Error && err.message.toLowerCase().includes('timeout')) {
        errorType = 'ai_timeout';
        errorMessage = 'AI ใช้เวลานานเกินไปในการตอบสนอง กรุณาลองใหม่อีกครั้ง';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.log('useApi: Error occurred:', err, 'Setting error:', errorMessage, 'type:', errorType);
      setError(errorMessage);
      setErrorType(errorType);
      throw err;
    } finally {
      setLoading(false);
      console.log('useApi: Loading set to false, final states - loading:', false, 'error:', error, 'data:', data);
    }
  };

  return { data, loading, error, errorType, getAssessment };
};