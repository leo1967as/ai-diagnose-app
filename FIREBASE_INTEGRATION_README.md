# Firebase Integration for Feedback System

This document outlines the Firebase integration implemented for the AI Diagnosis App feedback system.

## Overview

The feedback system now uses Firebase Firestore for data storage and Firebase Cloud Functions for real-time Discord webhook notifications.

## Components

### 1. Frontend Integration (`frontend/src/components/FeedbackModal.tsx`)

- Updated to use Firebase Firestore instead of localStorage
- Sends feedback data to Firestore collection 'feedback'
- Includes error handling for failed submissions
- Additional metadata: userAgent, URL

### 2. Firebase Configuration

#### Frontend (`frontend/src/config/firebaseConfig.ts`)
- Uses environment variables for Firebase config
- Initializes Firestore connection

#### Backend (`src/config/firebase.config.js`)
- Uses service account credentials for admin access
- Required for Cloud Functions

### 3. Cloud Functions (`functions/index.js`)

- **Trigger**: Firestore document creation in 'feedback' collection
- **Function**: `onFeedbackCreated`
- **Features**:
  - Rate limiting (5 notifications per minute)
  - Comprehensive error handling
  - Detailed logging
  - Rich Discord embeds with ratings, feedback, and metadata

### 4. Security Rules (`firestore.rules`)

- Allows authenticated users to create feedback documents
- Prevents updates/deletes (append-only)
- Denies access to other collections

## Environment Variables Required

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Backend (.env)
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY_ID=key-id
FIREBASE_CLIENT_ID=client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

## Deployment Steps

### 1. Firebase Project Setup
```bash
# Login to Firebase
firebase login

# Initialize project (if not done)
firebase init
# Select: Functions, Firestore
```

### 2. Install Dependencies
```bash
# Backend dependencies (already done)
npm install firebase-admin

# Frontend dependencies (already done)
cd frontend && npm install firebase

# Functions dependencies
cd functions && npm install
```

### 3. Configure Environment Variables
- Set up `.env` files as described above
- For production, configure environment variables in Firebase Functions

### 4. Deploy
```bash
# Deploy functions and rules
firebase deploy --only functions,firestore:rules
```

## Testing

### Local Testing
```bash
# Test functions syntax
node -c functions/index.js

# Build frontend
cd frontend && npm run build
```

### Production Testing
1. Deploy functions: `firebase deploy --only functions`
2. Submit feedback through the app
3. Check Discord channel for notification
4. Verify Firestore contains feedback documents

### Manual Testing
Use the test script:
```bash
node test-functions.js
```

## Discord Webhook

The system sends notifications to Discord webhook:
`https://discord.com/api/webhooks/1425836318486958110/3aAb8KHqzwNfYCNtTzSb6ATiLfAv_WlXJYdB6FXzN7Ei18yGviFIhK3LjzL11Csyv2_5`

### Embed Format
- **Title**: "🔔 New Feedback Received"
- **Fields**:
  - ⭐ Usage Rating (1-5 stars)
  - 💎 Beauty Rating (1-5 stars)
  - 📅 Timestamp (Thailand timezone)
  - 🌐 User Agent
  - 🔗 URL
  - 💬 Feedback (if provided)
- **Footer**: "AI Diagnosis App Feedback System"

## Error Handling

- **Rate Limiting**: 5 notifications per minute to prevent spam
- **Network Errors**: Logged and error notifications sent to Discord
- **Validation**: Frontend validates required fields
- **Fallback**: Graceful degradation if Firebase is unavailable

## Security Considerations

- Firestore rules restrict access to authenticated users only
- Feedback collection is append-only (no updates/deletes)
- Service account credentials are environment-protected
- Rate limiting prevents abuse

## Monitoring

- Cloud Functions logs all operations
- Error notifications sent to Discord on failures
- Rate limit violations logged but don't trigger notifications