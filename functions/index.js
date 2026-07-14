const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Load environment variables
require('dotenv').config();

admin.initializeApp();

// Rate limiting storage (in-memory for this demo, use Redis in production)
const rateLimitStore = new Map();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // Max 5 notifications per minute

// Check rate limit
function checkRateLimit(key) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }

  const timestamps = rateLimitStore.get(key);
  // Remove old timestamps outside the window
  const validTimestamps = timestamps.filter(ts => ts > windowStart);
  rateLimitStore.set(key, validTimestamps);

  if (validTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  validTimestamps.push(now);
  return true; // Allowed
}

// Send Discord notification
async function sendDiscordNotification(embed) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }

    functions.logger.info('Discord notification sent successfully');
    return true;
  } catch (error) {
    functions.logger.error('Error sending Discord notification:', error);
    throw error;
  }
}

// Cloud Function triggered on new feedback document
exports.onFeedbackCreated = functions.firestore
  .document('feedback/{feedbackId}')
  .onCreate(async (snap, context) => {
    try {
      const feedbackData = snap.data();

      // Rate limiting check
      const rateLimitKey = 'feedback_notifications';
      if (!checkRateLimit(rateLimitKey)) {
        functions.logger.warn('Rate limit exceeded for feedback notifications');
        return null;
      }

      // Count total feedback submissions
      const feedbackCount = await admin.firestore().collection('feedback').count().get();
      const totalFeedbacks = feedbackCount.data().count;

      // Create Discord embed in Thai
      const embed = {
        title: '📝 มีผู้ใช้ส่งความคิดเห็นใหม่!',
        color: 0x00ff00, // Green color
        fields: [
          {
            name: '⭐ คะแนนการใช้งาน',
            value: `${feedbackData.usageRating}/5 ดาว`,
            inline: true
          },
          {
            name: '💎 คะแนนความสวยงาม',
            value: `${feedbackData.beautyRating}/5 ดาว`,
            inline: true
          },
          {
            name: '📊 จำนวนผู้ใช้ทั้งหมด',
            value: `${totalFeedbacks} คน`,
            inline: true
          }
        ],
        footer: {
          text: 'ระบบ AI Diagnosis - ความคิดเห็นผู้ใช้'
        },
        timestamp: new Date(feedbackData.timestamp).toISOString()
      };

      // Add feedback text if provided
      if (feedbackData.feedback && feedbackData.feedback.trim()) {
        embed.fields.push({
          name: '💬 ความคิดเห็น',
          value: feedbackData.feedback.length > 1024 ?
            feedbackData.feedback.substring(0, 1021) + '...' :
            feedbackData.feedback,
          inline: false
        });
      }

      // Send notification
      await sendDiscordNotification(embed);

      functions.logger.info('Feedback notification processed successfully', {
        feedbackId: context.params.feedbackId,
        timestamp: feedbackData.timestamp
      });

      return null;

    } catch (error) {
      functions.logger.error('Error processing feedback notification:', error);

      // Send error notification to Discord
      try {
        const errorEmbed = {
          title: '❌ Feedback Processing Error',
          color: 0xff0000, // Red color
          description: `Error processing feedback notification: ${error.message}`,
          timestamp: new Date().toISOString(),
          footer: {
            text: 'AI Diagnosis App Error Handler'
          }
        };
        await sendDiscordNotification(errorEmbed);
      } catch (notifyError) {
        functions.logger.error('Failed to send error notification:', notifyError);
      }

      throw error;
    }
  });