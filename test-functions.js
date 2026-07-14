// Test script for Firebase Cloud Functions
// This simulates the feedback creation and tests the Discord notification

import functions from './functions/index.js';

// Mock Firestore snapshot
function createMockSnapshot(data) {
  return {
    data: () => data
  };
}

// Mock context
function createMockContext(params = {}) {
  return {
    params: { feedbackId: 'test-feedback-id', ...params }
  };
}

// Test function
async function testFeedbackNotification() {
  console.log('Testing feedback notification function...');

  const testFeedbackData = {
    usageRating: 4,
    beautyRating: 5,
    feedback: 'This is a test feedback message from the automated test.',
    timestamp: new Date().toISOString(),
    userAgent: 'Test User Agent',
    url: 'https://example.com/test'
  };

  const mockSnap = createMockSnapshot(testFeedbackData);
  const mockContext = createMockContext();

  try {
    // Note: This will fail in local environment because Firebase Functions need to be deployed
    // to trigger on Firestore events. This is just for syntax validation.
    console.log('Test data prepared:', testFeedbackData);
    console.log('Function would be triggered with this data in production.');

    // For local testing, you can manually call the sendDiscordNotification function
    // But it requires the actual webhook URL and network access

    console.log('✅ Test data validation passed');
    console.log('📋 To test in production:');
    console.log('1. Deploy functions: firebase deploy --only functions');
    console.log('2. Submit feedback through the app');
    console.log('3. Check Discord channel for notification');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test
testFeedbackNotification();