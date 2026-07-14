# AI Diagnosis App

## Project Description

The AI Diagnosis App is a full-stack web application for preliminary health assessments using AI. It has been restructured from a Vanilla JS frontend to a modern React (Vite + TypeScript) frontend with a Node.js/Express backend. The app collects user health profiles and symptoms, processes them via Google's Gemini AI, and provides personalized recommendations, risk assessments, and care suggestions.

Key features:
- User health profile management
- Symptom-based assessment with two-level confirmation
- AI-powered analysis including BMI calculation
- Structured results with disclaimers

## Project Structure

```
ai-diagnose-app/
├── README.md                 # This file
├── package.json              # Root dependencies (backend)
├── server.js                 # Express server entry point
├── .env                      # Environment variables
├── src/                      # Backend source
│   ├── api/                  # API routes (e.g., diagnosis.routes.js)
│   ├── config/               # Configurations (e.g., gemini.config.js, firebase.config.js)
│   ├── controllers/          # Business logic (e.g., diagnosis.controller.js)
│   ├── middlewares/          # Middleware (e.g., errorHandler.middleware.js)
│   ├── repositories/         # Data access (e.g., diagnosis.repository.js)
│   ├── services/             # Services (e.g., aiConnector.service.js, diagnosis.service.js)
│   └── utils/                # Utilities (e.g., logger.js)
├── frontend/                 # React frontend (Vite + TS)
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── src/
│   │   ├── components/       # React components (e.g., HealthForm.tsx, SymptomSelection.tsx, ResultView.tsx)
│   │   ├── hooks/            # Custom hooks (e.g., useApi.ts, useProfile.ts)
│   │   ├── services/         # API services (e.g., apiService.ts, profileService.ts)
│   │   ├── store/            # State management
│   │   ├── types/            # TypeScript types (e.g., index.ts)
│   │   └── utils/            # Utilities
│   └── public/               # Static assets
├── public/                   # Legacy static files (to be deprecated)
└── ...                       # Other configs (e.g., .gitignore, vercel.json)
```

## Installation

1. **Clone the repository** (if applicable):
   ```
   git clone <repo-url>
   cd ai-diagnose-app
   ```

2. **Backend Dependencies** (Node.js/Express):
   ```
   npm install
   ```

3. **Frontend Dependencies** (React Vite):
   ```
   cd frontend
   npm install
   cd ..
   ```

Ensure Node.js (v18+) and npm are installed.

## Running in Development

Run backend and frontend concurrently:

1. **Start Backend** (Express server on port 3000):
   ```
   npm start
   ```
   Or for development with nodemon (if installed):
   ```
   npm run dev
   ```

2. **Start Frontend** (Vite dev server on port 5173):
   ```
   cd frontend
   npm run dev
   ```
   Open http://localhost:5173 in your browser.

The frontend proxies API calls to the backend automatically via Vite config.

For concurrent running, use a tool like `concurrently` (install via `npm i -g concurrently`):
```
concurrently "npm start" "cd frontend && npm run dev"
```

## Building and Deployment

### Frontend Build
```
cd frontend
npm run build
```
This generates a `dist/` folder with optimized static files. Serve via any static host (e.g., Vercel, Netlify).

### Backend Build/Start
No build step needed for Node.js. For production:
```
npm start
```
Deploy backend to platforms like Heroku, Vercel (serverless), or AWS.

### Full Deployment
- Build frontend and copy `dist/` to backend's public folder or serve separately.
- Set environment variables on the hosting platform.
- Use `vercel.json` for Vercel-specific routing if deploying full-stack there.

## Environment Variables

Create a `.env` file in the root:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

- `GEMINI_API_KEY`: Required for Google Gemini AI integration.
- Add Firebase keys if using auth/storage (see `src/config/firebase.config.js`).
- Never commit `.env` to version control; use `.env.example` as template.

## Main Components and Services

### Frontend (React)
- **App.tsx**: Root component orchestrating forms and views.
- **HealthForm.tsx**: Main form for personal info and symptoms.
- **SymptomSelection.tsx**: Categorized symptom picker.
- **PersonalInfoForm.tsx** & **AdditionalInfoForm.tsx**: Sub-forms for details.
- **ResultView.tsx**: Displays AI analysis results.
- **ProfileModal.tsx**: Manages user health profile.
- **LoadingView.tsx** & **ErrorView.tsx**: UI states.
- **Hooks**: `useApi.ts` for API calls, `useProfile.ts` for profile state.
- **Services**: `apiService.ts` for backend communication, `profileService.ts` for local storage.

### Backend (Node.js/Express)
- **server.js**: Entry point, sets up Express, routes, middleware.
- **diagnosis.routes.js**: API endpoints (/api/diagnosis).
- **diagnosis.controller.js**: Handles requests, calls services.
- **diagnosis.service.js** & **aiConnector.service.js**: AI integration with Gemini.
- **Error Handling**: Via `errorHandler.middleware.js`.
- **Logging**: `logger.js` for debugging.

For detailed functionality, see [AI_DIAGNOSIS_APP_FUNCTIONALITY.md](AI_DIAGNOSIS_APP_FUNCTIONALITY.md) and [DEVELOPERS.md](DEVELOPERS.md).

## Contributing

See [DEVELOPERS.md](DEVELOPERS.md) for development guidelines.