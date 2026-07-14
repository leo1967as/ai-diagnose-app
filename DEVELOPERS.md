# Developer Notes for AI Diagnosis App

This document provides guidelines for developers working on the AI Diagnosis App. It covers key patterns, best practices, and processes for extending the React frontend and Node.js/Express backend.

## Adding New Components (Frontend)

The frontend uses a component-based architecture with TypeScript for type safety. Follow these steps:

1. **Create the Component**:
   - Place new components in `frontend/src/components/`.
   - Use functional components with hooks. Example structure:
     ```tsx
     import React from 'react';
     import { YourType } from '../types';

     interface YourComponentProps {
       prop1: string;
       onChange?: (value: string) => void;
     }

     const YourComponent: React.FC<YourComponentProps> = ({ prop1, onChange }) => {
       // Component logic
       return (
         <div className="your-class">
           {/* JSX */}
         </div>
       );
     };

     export default YourComponent;
     ```

2. **Add Styles**:
   - Use CSS modules or global styles in `App.css` or `styles.css`.
   - Ensure mobile-first responsive design with Flexbox/Grid.

3. **Integrate**:
   - Import and use in parent components (e.g., `App.tsx` or `HealthForm.tsx`).
   - Add to `types/index.ts` if new types are needed.
   - Test with Storybook if set up, or manually in dev mode.

4. **Best Practices**:
   - Keep components small and focused (single responsibility).
   - Use `React.memo` for performance if props are primitive.
   - Add JSDoc comments for props and logic.
   - Ensure accessibility: semantic HTML, ARIA labels.

## Managing State with Hooks

State is managed locally with React hooks; no global store like Redux unless scaling requires it. Use built-in and custom hooks:

1. **Local State**:
   - Use `useState` for form data, UI toggles.
   - Example in `HealthForm.tsx`:
     ```tsx
     const [symptoms, setSymptoms] = useState<string[]>([]);
     const [isConfirmed, setIsConfirmed] = useState(false);
     ```

2. **Custom Hooks**:
   - Create in `frontend/src/hooks/` for reusable logic.
   - Example: `useApi.ts` for API calls with loading/error states:
     ```tsx
     import { useState } from 'react';
     import apiService from '../services/apiService';

     export const useApi = () => {
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState<string | null>(null);

       const postData = async (endpoint: string, data: any) => {
         setLoading(true);
         setError(null);
         try {
           const response = await apiService.post(endpoint, data);
           return response.data;
         } catch (err) {
           setError('API Error');
           throw err;
         } finally {
           setLoading(false);
         }
       };

       return { loading, error, postData };
     };
     ```
   - Usage: `const { loading, postData } = useApi();`

3. **Profile State**:
   - `useProfile.ts` handles localStorage persistence:
     ```tsx
     import { useState, useEffect } from 'react';
     // ... load/save logic
     ```

4. **Best Practices**:
   - Prefer `useReducer` for complex state (e.g., multi-step forms).
   - Memoize with `useMemo`/`useCallback` to avoid re-renders.
   - Handle side effects in `useEffect` with cleanup.
   - Type all state with interfaces from `types/index.ts`.

## API Integration Patterns

The frontend communicates with the backend via RESTful APIs using Axios in services.

1. **Services Layer**:
   - Define in `frontend/src/services/` (e.g., `apiService.ts`):
     ```tsx
     import axios from 'axios';

     const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

     const apiService = axios.create({
       baseURL: API_BASE,
       headers: { 'Content-Type': 'application/json' },
     });

     export const postDiagnosis = async (data: DiagnosisRequest) => {
       const response = await apiService.post('/diagnosis', data);
       return response.data;
     };

     export default apiService;
     ```
   - Handle auth/tokens if added later.

2. **Integration in Components/Hooks**:
   - Use custom hooks like `useApi.ts` to wrap service calls.
   - Example in `HealthForm.tsx`:
     ```tsx
     const handleSubmit = async (formData: FormData) => {
       try {
         const result = await postDiagnosis(formData);
         setResults(result);
       } catch (error) {
         setError('Submission failed');
       }
     };
     ```

3. **Backend Endpoints**:
   - Add new routes in `src/api/` (e.g., `new.routes.js`).
   - Controllers in `src/controllers/` handle logic.
   - Services in `src/services/` for business rules (e.g., AI calls).
   - Use async/await; validate inputs with middleware.

4. **Error Handling & Retry**:
   - Frontend: Catch errors in hooks, show `ErrorView.tsx`.
   - Backend: Use `errorHandler.middleware.js` for global errors.
   - Implement exponential backoff for AI retries in `aiConnector.service.js`.

5. **Best Practices**:
   - Use TypeScript interfaces for request/response (e.g., `DiagnosisRequest` in `types/index.ts`).
   - Environment vars for API URLs (VITE_API_URL in frontend, process.env in backend).
   - CORS: Configured in backend for dev/prod.
   - Security: Sanitize inputs; no sensitive data in localStorage beyond profiles.
   - Testing: Add unit tests for services/hooks with Jest/Vitest.

## General Development Workflow

1. **Setup**: Follow README.md for install/run.
2. **Linting/Type Check**: `cd frontend && npm run lint` / `tsc --noEmit`.
3. **Backend Dev**: Use nodemon for auto-restart.
4. **Testing Changes**: Run dev servers; test forms, API calls.
5. **Commits**: Semantic messages; reference issues.
6. **Deployment**: Build frontend, deploy backend; update env vars.

For architecture decisions, refer to [AI_DIAGNOSIS_APP_FUNCTIONALITY.md](AI_DIAGNOSIS_APP_FUNCTIONALITY.md). Report issues or suggest improvements via GitHub.

## Tech Stack Reminders

- **Security**: Validate/sanitize all inputs; use HTTPS in prod.
- **Performance**: Lazy load components if app grows; optimize AI prompts.
- **Maintainability**: Keep code modular; update deps regularly.
- **UX**: Ensure two-level confirmation; add loading states.

Contact the team for questions.