# Copilot Instructions for AI Agents

## Project Overview
This is an AI-powered diagnosis web application built with Node.js and Express. The architecture is modular, separating API routes, controllers, services, repositories, and configuration files for maintainability and scalability.

## Key Components & Data Flow
- **server.js**: Entry point. Sets up Express, CORS, JSON parsing, static file serving, and mounts API routes under `/api`.
- **src/api/diagnosis.routes.js**: Defines REST API endpoints for diagnosis features. Delegates logic to controllers.
- **src/controller/diagnosis.controller.js**: Handles request/response logic. Calls service layer for business logic.
- **src/services/diagnosis.service.js**: Implements core diagnosis logic, interacts with repositories and external APIs.
- **src/repositories/diagnosis.repository.js**: Manages data persistence and retrieval.
- **src/config/firebase.config.js & gemini.config.js**: Configure external integrations (Firebase, Gemini AI).
- **src/middlewares/errorHandler.middleware.js**: Centralized error handling for API responses.
- **src/utils/logger.js**: Custom logging utility for debugging and monitoring.
- **public/**: Static frontend assets (HTML, CSS, JS).

## Developer Workflows
- **Start server**: `node server.js` or use `npm start` if defined in `package.json`.
- **API development**: Add new endpoints in `diagnosis.routes.js`, implement logic in controller/service/repository layers.
- **Static assets**: Place frontend files in `public/`.
- **Configuration**: Use `.env` for secrets/keys. See config files for integration details.
- **Error handling**: Use the middleware in `src/middlewares/errorHandler.middleware.js` for consistent API error responses.

## Project-Specific Patterns
- **Layered architecture**: Always route requests through controller → service → repository for separation of concerns.
- **External API integration**: Use config files for setup; service layer for invocation.
- **Logging**: Use `src/utils/logger.js` for all custom logs.
- **Static serving**: All files in `public/` are served at root (`/`).

## Integration Points
- **Firebase**: Configured in `src/config/firebase.config.js`.
- **Gemini AI**: Configured in `src/config/gemini.config.js`.
- **Environment variables**: Managed via `.env` and `dotenv`.

## Example Patterns
- To add a new diagnosis feature:
  1. Add route in `diagnosis.routes.js`
  2. Implement controller method in `diagnosis.controller.js`
  3. Add business logic in `diagnosis.service.js`
  4. Update data access in `diagnosis.repository.js` if needed

## References
- Entry: `server.js`
- API: `src/api/diagnosis.routes.js`
- Error Handling: `src/middlewares/errorHandler.middleware.js`
- Logging: `src/utils/logger.js`
- Config: `src/config/`
- Frontend: `public/`

---
**Feedback requested:** Please review and suggest improvements or clarify any missing/unclear sections for your workflow.
