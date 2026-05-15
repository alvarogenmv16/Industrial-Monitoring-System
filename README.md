# ⚙️ Industrial Monitoring System

A complete industrial motor monitoring solution with a Python FastAPI backend, a React + TypeScript frontend, and a local SQLite data store.

## 🌐 Overview
This repository combines data ingestion, analytics, anomaly detection, and visualization into a single end-to-end monitoring system for industrial motors.

The backend exposes a set of RESTful APIs that provide motor telemetry, operational status, historical data, and anomaly intelligence. The frontend consumes those APIs to present dashboards, charts, and alerts for operations teams.

## ⭐ Key Features
- Backend API built with FastAPI
- Frontend dashboard built with React, TypeScript, and Vite
- Local SQLite database containing industrial motor telemetry
- Endpoints for motor IDs, latest telemetry, history, status overview, and anomaly events
- CORS configured for frontend access at `http://localhost:5173`
- Structured project layout for maintainability and future extension

## 🛠 Architecture
- `Project/api/`: FastAPI entrypoint and database connector
- `Project/routers/`: API routes for motor telemetry and anomaly endpoints
- `Project/services/`: Business logic and database query layer
- `Project/responses/`: OpenAPI response definitions
- `Project/api/schemas.py`: Pydantic models and response schemas
- `Database/`: Local SQLite database file (`industrial_data.db`)
- `frontend/`: React + TypeScript dashboard application

## 📡 Backend API Endpoints
The backend exposes the following routes under `/motors`:

- `GET /motors/` — Get all available motor IDs
- `GET /motors/{motor_id}/telemetry/latest` — Get latest telemetry for a motor
- `GET /motors/{motor_id}/telemetry/history` — Get historical telemetry for a motor
- `GET /motors/status/overview` — Get current status summary for all motors
- `GET /motors/anomalies` — Get recent anomaly events across all motors
- `GET /motors/anomalies/overview` — Get anomaly intelligence overview and breakdown

## 📂 Data Source
The system is designed around industrial motor telemetry and anomaly detection data. The repository includes a local SQLite database in `Database/industrial_data.db`.

The original dataset is based on a smart manufacturing IoT dataset and provides sensor readings for machine health monitoring.

## 🎛 Frontend
The frontend application is located in the `frontend/` folder and uses:

- React
- TypeScript
- Vite
- Recharts for visualizations
- Axios for API requests

The frontend is configured to consume the backend API and present real-time telemetry, historical trends, system status, and anomaly alerts.

## Getting Started

### Backend
1. Install dependencies with Poetry:
   ```bash
   poetry install
   ```
2. Run the FastAPI server:
   ```bash
   poetry run uvicorn Project.api.main:app --reload --host 0.0.0.0 --port 8000
   ```
3. Open the API docs:
   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

### Frontend
1. Change to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the dashboard in the browser:
   - `http://localhost:5173`

## 🧪 Development Notes
- Backend dependencies are managed by Poetry and defined in `pyproject.toml`
- Frontend dependencies are managed by npm and defined in `frontend/package.json`
- FastAPI is configured with CORS to allow the frontend to access the API during local development
- The backend uses SQLite connection pooling via a dependency generator in `Project/api/connector.py`

## ✅ Recommended Workflow
1. Start the backend API
2. Start the frontend development server
3. Use the frontend dashboard to visualize telemetry and anomaly data
4. Extend the backend with new endpoints or analytics as needed

## 💡 Contribution Guidelines
- 🚀 `feat`: Add new features
- 🐛 `fix`: Resolve bugs
- ♻ `refactor`: Improve code structure without behavior changes
- 📚 `docs`: Update documentation

---

This README reflects the current structure of the project, including the new frontend dashboard and the backend API integration.
