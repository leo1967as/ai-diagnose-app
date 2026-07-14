# AI Diagnosis Application - Main Functionality Overview

## Introduction

The AI Diagnosis Application is a full-stack web-based health assessment tool designed to provide users with preliminary health analysis based on their symptoms and personal health information. The application leverages artificial intelligence to offer personalized health recommendations, risk assessments, and care suggestions.

This document provides a high-level overview of the application's main functionality, explaining how users interact with the system and how it processes information to generate health insights. The project has been restructured to use a modern React (Vite + TypeScript) frontend with a Node.js/Express backend, improving maintainability, performance, and developer experience compared to the original Vanilla JS implementation.

## Architecture Overview

The application follows a client-server architecture:

- **Frontend (React + Vite + TypeScript)**: Handles user interface, form interactions, state management via hooks, and API calls. Built with component-based design for reusability and responsiveness.
- **Backend (Node.js + Express)**: Manages API routes, business logic, AI integration with Google's Gemini model, error handling, and logging. Uses modular structure with controllers, services, and repositories.
- **Communication**: Frontend makes HTTP requests to backend endpoints (e.g., `/api/diagnosis`). Local storage for user profiles (privacy-focused).
- **Improvements from Vanilla JS**: 
  - Modular components replace monolithic scripts.
  - Custom hooks (e.g., `useApi`, `useProfile`) manage state and side effects efficiently.
  - TypeScript ensures type safety and reduces runtime errors.
  - Vite provides fast development with hot module replacement (HMR).

Key technologies:
- Frontend: React 18, TypeScript, Vite, Axios for API calls.
- Backend: Express 4, Node.js 18+, Gemini AI SDK.
- Other: LocalStorage for profiles, BMI calculations in frontend/backend.

## User Interface and Interaction

The React-based frontend provides a user-friendly, responsive web interface that guides users through a comprehensive health assessment process:

1. **Health Profile Setup**: Users create and save a personal health profile via the `ProfileModal` component, including:
   - Chronic conditions (diabetes, hypertension, allergies, etc.)
   - Drug allergies
   - Lifestyle factors (smoking, alcohol consumption)
   - Additional health notes
   Profiles are stored locally using `profileService.ts` with `useProfile` hook for state management.

2. **Symptom Assessment Form**: The main interface, orchestrated by `App.tsx` and `HealthForm.tsx`, presents a multi-step form:
   - Personal information (name, age, gender, weight, height) in `PersonalInfoForm.tsx`.
   - Symptom selection from categorized lists (general, head/neck, respiratory, digestive) via `SymptomSelection.tsx`.
   - Duration of symptoms and recent meal information in `AdditionalInfoForm.tsx`.
   - Form validation and state handled by React hooks.

3. **Two-Level Confirmation**: Implemented in the submit handler of `HealthForm.tsx` to prevent accidental submissions. The submit button toggles to a confirmation state requiring a second click, using React state for UI feedback.

4. **Profile Management**: Users access and update profiles through the `ProfileModal` component, integrated with local storage.

UI states are managed with dedicated components: `LoadingView.tsx` for processing, `ErrorView.tsx` for failures, and `ResultView.tsx` for outputs.

## Data Processing Flow

The application follows a clear data processing flow, now distributed between frontend and backend:

1. **Data Collection**: React forms gather comprehensive health information, validated client-side.

2. **BMI Calculation**: Performed in the frontend (`HealthForm.tsx`) using height/weight inputs for immediate feedback, then included in API payload.

3. **Data Preparation**: Frontend formats data using `apiService.ts` and sends via POST to backend `/api/diagnosis`.

4. **Backend Processing**: 
   - `diagnosis.routes.js` receives request.
   - `diagnosis.controller.js` validates and calls `diagnosis.service.js`.
   - Data is prepared for AI.

5. **AI Analysis**: Backend uses `aiConnector.service.js` to interface with Google's Gemini AI model, sending contextual prompts with user data.

6. **Result Formatting**: AI response is parsed and structured in the backend service.

7. **Result Presentation**: Backend returns JSON; frontend renders in `ResultView.tsx` using React components.

Error handling propagates from backend (`errorHandler.middleware.js`) to frontend, with retries in `useApi.ts` hook.

## AI Analysis Component

The core AI engine, now backend-hosted for security:

1. **Contextual Analysis**: Gemini considers symptoms, profile, BMI, and meals via structured prompts in `aiConnector.service.js`.

2. **Risk Assessment**: Evaluates risks based on user data, outputting categorized insights.

3. **Personalized Recommendations**: Generates advice tailored to circumstances, using prompt engineering for relevance.

4. **Error Handling**: Backend includes retry logic and logging (`logger.js`); frontend shows user-friendly messages.

## Results Presentation

Users receive insights in `ResultView.tsx`, structured for readability:

1. **Primary Assessment**: Summary linking symptoms to health factors.

2. **Risk Evaluation**: Categorized risks with explanations influenced by profile.

3. **Care Recommendations**:
   - Immediate actions
   - Wellness advice
   - Activity guidance (recommended/avoid)

4. **Dietary Suggestions**:
   - Tailored nutrition
   - Recommended foods by category
   - Foods to avoid with reasons

5. **Warning Signs**: Red flags to monitor.

6. **Important Disclaimers**: Emphasizes AI limitations and need for professional consultation, displayed prominently.

Results use semantic HTML for accessibility, with responsive CSS.

## Key Benefits

- **Personalized Health Insights**: Tailored via AI and user profile.
- **Comprehensive Assessment**: Integrates multiple factors.
- **User-Friendly Interface**: React ensures smooth, mobile-first UX.
- **Privacy Focused**: Profiles stored locally; no server persistence.
- **Educational Value**: Explains health connections.
- **Improved Maintainability**: Modular React components and Express services ease updates.
- **Performance**: Vite HMR and async backend processing.

## Conclusion

The restructured AI Diagnosis Application enhances the original Vanilla JS version with modern frontend and backend technologies, maintaining all core functionality while improving scalability and developer productivity. It provides accessible preliminary health insights, always stressing professional medical advice.