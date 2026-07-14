import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [usageRating, setUsageRating] = useState(0);
  const [beautyRating, setBeautyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleUsageRatingChange = (newRating: number) => {
    setUsageRating(newRating);
  };

  const handleBeautyRatingChange = (newRating: number) => {
    setBeautyRating(newRating);
  };

  const handleMouseEnter = (star: number) => {
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usageRating === 0 || beautyRating === 0) {
      alert('กรุณาให้คะแนนทั้งสองด้าน');
      return;
    }

    console.log('FeedbackModal: Starting feedback submission...');

    try {
      const feedbackData = {
        usageRating,
        beautyRating,
        feedback,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.log('FeedbackModal: Feedback data prepared:', feedbackData);

      // Add to Firestore
      console.log('FeedbackModal: Attempting to add to Firestore...');
      const docRef = await addDoc(collection(db, 'feedback'), feedbackData);
      console.log('FeedbackModal: Successfully added to Firestore with ID:', docRef.id);

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1500);
    } catch (error: any) {
      console.error('FeedbackModal: Error submitting feedback:', error);
      console.error('FeedbackModal: Error code:', error.code);
      console.error('FeedbackModal: Error message:', error.message);
      console.error('FeedbackModal: Error details:', error);

      let errorMessage = 'เกิดข้อผิดพลาดในการส่งความเห็น กรุณาลองใหม่อีกครั้ง';

      if (error.code === 'permission-denied') {
        errorMessage = 'ไม่มีสิทธิ์ในการส่งความเห็น กรุณาติดต่อผู้ดูแลระบบ';
      } else if (error.code === 'unavailable') {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง';
      }

      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>ประเมินการใช้งาน</h2>
        <p>ช่วยให้เราปรับปรุงแอปให้ดีขึ้นด้วยคะแนนและคำแนะนำของคุณ</p>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>1. ความพึงพอใจการใช้งาน (1-5 ดาว)</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={`usage-${star}`} onMouseEnter={() => handleMouseEnter(star)} onMouseLeave={handleMouseLeave}>
                    <input
                      type="radio"
                      name="usageRating"
                      value={star}
                      checked={usageRating === star}
                      onChange={() => handleUsageRatingChange(star)}
                    />
                    <span className={`star ${ (usageRating || hoverRating) >= star ? 'filled' : '' }`}>★</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>2. ความสวยงามของเว็บไซต์ (1-5 ดาว)</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={`beauty-${star}`} onMouseEnter={() => handleMouseEnter(star)} onMouseLeave={handleMouseLeave}>
                    <input
                      type="radio"
                      name="beautyRating"
                      value={star}
                      checked={beautyRating === star}
                      onChange={() => handleBeautyRatingChange(star)}
                    />
                    <span className={`star ${ (beautyRating || hoverRating) >= star ? 'filled' : '' }`}>★</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="feedback">คำแนะนำเพิ่มเติม (ไม่บังคับ)</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={handleFeedbackChange}
                rows={4}
                placeholder="เช่น ชอบส่วนไหน ไม่ชอบอะไร หรือไอเดียใหม่ๆ"
                className="responsive-textarea"
              />
            </div>
            <button type="submit" className="main-button">
              ส่งความเห็น
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>ขอบคุณสำหรับความเห็นของคุณ!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;