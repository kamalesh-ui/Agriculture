# AI Smart Agriculture

This repository contains a real-time AI Smart Agriculture application with a frontend and backend.

## Structure

- `frontend/` - Vite + React + Tailwind frontend
- `backend/` - FastAPI backend with crop recommendation, yield prediction, soil analysis, and PCA analysis

## Backend Setup

1. Create and activate a virtual environment:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

2. Install backend dependencies:

   ```powershell
   pip install -r backend/requirements.txt
   ```

3. Run the backend service:

   ```powershell
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Frontend Setup

1. Install frontend dependencies:

   ```powershell
   cd frontend
   npm install
   ```

2. Start the dev server:

   ```powershell
   npm run dev
   ```

3. Open the local URL shown in the terminal.

## Datasets & Model Training

1. Generate datasets for model training:

   ```powershell
   cd backend
   python train/generate_datasets.py
   ```

2. Train the backend models:

   ```powershell
   python train/train_models.py
   ```

3. The trained model artifacts will be saved to `backend/app/models`.

## Docker Setup

Use Docker to run the frontend and backend together with a local proxy.

1. Build and start the services:

   ```powershell
   docker compose up --build
   ```

2. Open the frontend at:

   ```text
   http://localhost:3000
   ```

3. The backend API will be available at:

   ```text
   http://localhost:8000
   ```

4. To stop the stack:

   ```powershell
   docker compose down
   ```

## API Endpoints

- `POST /api/crop/recommend`
- `POST /api/yield/predict`
- `POST /api/soil/analyze`
- `POST /api/pca/analyze`

The frontend is configured to proxy `/api` calls to `http://localhost:8000`.
