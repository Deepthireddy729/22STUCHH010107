# 22STUCHH010107 - URL Shortener Full Stack Project

## Project Structure

```
22STUCHH010107/
  backend/
  frontend/
  logging-middleware/
```

## Setup Instructions

### 1. Backend
```
cd backend
npm install
node index.js
```
- Runs on http://localhost:5000

### 2. Logging Middleware
- No separate run needed; used by backend automatically.
- Configure your Bearer token in `logging-middleware/logger.js` if required.

### 3. Frontend
```
cd frontend
npm install
npm start
```
- Runs on http://localhost:3000

## Features
- Shorten up to 5 URLs at once
- Custom or auto-generated shortcodes
- Set expiry (default 30 min)
- View stats for each short URL
- Material UI for all styling
- Robust error handling
- Logging middleware (no console.log)

## Submission
- Ensure your repo is named `22STUCHH010107`.
- Do **not** include your name or Affordmed in the code, README, or commit messages.
- Add screenshots of API requests/responses and frontend (desktop & mobile views) as required by the assignment.

## .gitignore
- `node_modules` and build output are ignored.

---

**Good luck!** 