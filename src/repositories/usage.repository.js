// File: src/repositories/usage.repository.js
import { db } from '../config/firebase.config.js';

class UsageRepository {
  constructor() {
    this.collection = db.collection('usage_stats');
  }

  async logAssessment(data) {
    try {
      const docRef = await this.collection.add({
        timestamp: new Date(),
        action: 'assessment_request',
        ip: data.ip || 'unknown',
        userAgent: data.userAgent || 'unknown',
        userData: {
          name: data.name,
          age: data.age,
          sex: data.sex,
          symptomsCount: data.symptoms ? data.symptoms.split(',').length : 0,
          hasAdditionalSymptoms: data.symptom_duration || data.previous_meal ? true : false
        }
      });
      console.log('[UsageRepository] Logged assessment:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('[UsageRepository] Error logging assessment:', error);
      throw error;
    }
  }

  async getUsageStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const snapshot = await this.collection
        .where('timestamp', '>=', startDate)
        .orderBy('timestamp', 'desc')
        .get();

      const stats = [];
      snapshot.forEach(doc => {
        stats.push({ id: doc.id, ...doc.data() });
      });

      return stats;
    } catch (error) {
      console.error('[UsageRepository] Error getting stats:', error);
      throw error;
    }
  }
}

export default new UsageRepository();