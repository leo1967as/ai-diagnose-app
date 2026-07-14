# Firebase Deployment Guide for AI Diagnosis App

This guide provides step-by-step instructions for deploying Firebase services (Cloud Functions and Firestore) for the AI Diagnosis App feedback system.

## Prerequisites

1. **Firebase Account**: Create a Firebase project at https://console.firebase.google.com/
2. **Firebase CLI**: Install globally via `npm install -g firebase-tools`
3. **Node.js**: Version 18 or higher
4. **Discord Webhook URL**: Obtain from your Discord server settings

## Project Setup

### 1. Firebase Project Configuration

1. Create a new Firebase project or use an existing one
2. Enable Firestore Database in your Firebase project
3. Enable Cloud Functions for your project

### 2. Local Configuration

Update the following files with your actual Firebase project details:

#### .firebaserc
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

#### .env (for local backend/server)
```
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email
```

#### frontend/.env (for frontend)
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Environment Variables Setup

### Cloud Functions Environment Variables

Set the Discord webhook URL for production:

```bash
firebase functions:config:set discord.webhook_url="https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"
```

Verify the configuration:
```bash
firebase functions:config:get
```

## Deployment Steps

### 1. Login to Firebase
```bash
firebase login
```

### 2. Install Dependencies
```bash
# Functions dependencies
cd functions
npm install

# Root project dependencies (if needed)
npm install
```

### 3. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 4. Deploy Cloud Functions
```bash
firebase deploy --only functions
```

### 5. Verify Deployment
```bash
# Check functions status
firebase functions:list

# Check Firestore rules
firebase firestore:rules:list
```

## Testing Deployment

### 1. Manual Testing via Firebase Console

1. Go to Firebase Console > Firestore Database
2. Create a new document in the `feedback` collection with test data:
   ```json
   {
     "usageRating": 5,
     "beautyRating": 4,
     "feedback": "Test feedback from deployment",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "userAgent": "Test User Agent",
     "url": "https://your-app-url.com"
   }
   ```
3. Check your Discord channel for the notification

### 2. Testing via Application

1. Deploy your application (frontend/backend) with Firebase credentials
2. Submit feedback through the app's feedback form
3. Verify Discord notification appears
4. Check Firebase Functions logs for any errors

### 3. Logs and Monitoring

```bash
# View function logs
firebase functions:log

# View specific function logs
firebase functions:log --only onFeedbackCreated
```

## Security Considerations

1. **Authentication**: The Firestore rules require user authentication for feedback submission
2. **Rate Limiting**: Built-in rate limiting (5 notifications/minute) prevents spam
3. **Environment Variables**: Sensitive data like webhook URLs are stored as environment variables
4. **Access Control**: Feedback collection is append-only (no updates/deletes)

## Troubleshooting

### Common Issues

1. **Functions not deploying**:
   - Check Firebase CLI version: `firebase --version`
   - Ensure you're logged in: `firebase login`
   - Verify project ID in `.firebaserc`

2. **Discord notifications not working**:
   - Verify webhook URL is correctly set: `firebase functions:config:get`
   - Check Discord webhook permissions
   - Review function logs for errors

3. **Firestore permission errors**:
   - Ensure Firestore is enabled in Firebase Console
   - Check that user is authenticated when submitting feedback

### Rollback Procedures

```bash
# Rollback functions to previous version
firebase functions:rollback --function onFeedbackCreated

# Redeploy with fixes
firebase deploy --only functions
```

## Production Checklist

- [ ] Firebase project created and configured
- [ ] Firestore enabled
- [ ] Cloud Functions enabled
- [ ] `.firebaserc` updated with correct project ID
- [ ] Environment variables configured (Discord webhook)
- [ ] Functions deployed successfully
- [ ] Firestore rules deployed
- [ ] Testing completed (manual and via app)
- [ ] Logs monitored for errors
- [ ] Rate limiting verified
- [ ] Authentication working correctly

## Cost Considerations

- **Cloud Functions**: Pay per invocation (~$0.0000004 per invocation for Asia Southeast region)
- **Firestore**: Pay for reads/writes/deletes and storage
- **Rate limiting**: Helps control costs by preventing excessive notifications

## Maintenance

- Monitor function logs regularly
- Update dependencies periodically
- Review and update security rules as needed
- Backup important data from Firestore if required

## Support

For Firebase-specific issues:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase CLI Reference: https://firebase.google.com/docs/cli
- Stack Overflow: Tag with `firebase` and `google-cloud-functions`