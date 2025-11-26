# NASA APOD Explorer

Full-stack project with a Spring Boot REST API and React + TypeScript frontend.

## Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+

## Setup

### Backend
1. Set NASA API key as env var (recommended):
   - Windows PowerShell: `$env:NASA_API_KEY = "your_key"`
2. Configure options in `backend/src/main/resources/application.yml` if needed.
3. Run:
   - `mvn -f backend/pom.xml spring-boot:run`

Endpoints:
- GET `http://localhost:8080/api/apod/today`
- GET `http://localhost:8080/api/apod/by-date?date=YYYY-MM-DD`
- GET `http://localhost:8080/api/apod/recent?days=10`

### Frontend
1. Install deps: `npm i --prefix frontend`
2. Start dev: `npm run dev --prefix frontend`
3. App at `http://localhost:5173` (proxy to backend at 8080)

### Notes
- Caching: Caffeine with TTL and max size (configurable via `application.yml`).
- API key is read from `NASA_API_KEY` env, property `nasa.api.key`, or fallback `DEMO_KEY` for demo.
- CORS allows `http://localhost:5173` by default.
