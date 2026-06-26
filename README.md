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

Prerequisites
- Install Docker Desktop for Windows: https://www.docker.com/get-started
- Ensure Docker Desktop is running before continuing.

Build and run (recommended)

From the repository root run (PowerShell):

```powershell
cd C:\Users\ADMIN\Desktop\internship
docker compose up --build
```

- Frontend will be served at: http://localhost:3000
- Backend API will be available at: http://localhost:8000

Stop and remove containers:

```powershell
docker compose down
```

Windows convenience script

There is a small helper script `run-docker.ps1` (in the repo root) which:
- checks whether Docker is available
- starts Docker Compose with `--build`

Run it from PowerShell (may require elevated privileges if Docker Desktop needs setup):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\run-docker.ps1
```

Troubleshooting
- If `docker` is not found, install Docker Desktop and restart your shell.
- If ports `3000` or `8000` are in use, stop the conflicting service or map ports in `docker-compose.yml`.
- If model artifacts are missing, place trained models under `backend/app/models` before building the backend image so they are copied into the container at build time.

Notes
- The frontend `nginx.conf` proxies `/api/` to the `backend` service, so the containers can communicate using the service name `backend:8000`.
- The `backend` image installs dependencies from `backend/requirements.txt` at build time.

## Render Deployment

This repo can be deployed on Render with both backend and frontend services using `render.yaml`.

1. Connect your GitHub repository to Render.
2. Create a new Render project and choose "Use existing render.yaml".
3. For the frontend service, set the environment variable `VITE_API_BASE_URL`
   to your backend URL, for example: `https://<your-backend>.onrender.com`.
4. Deploy the services.

After deployment:
- The frontend will be served by Render static site hosting.
- The backend will be served by Render as a web service.

### Vercel Deployment

You can deploy only the frontend to Vercel. The backend must still run separately on Render, Railway, Fly, or another Python host.

To deploy the frontend to Vercel:
1. Create a Vercel account and connect your GitHub repository.
2. In Vercel project settings, set the root directory to the repository root.
3. Add environment variable `VITE_API_BASE_URL` with your backend URL, for example:
   `https://<your-backend>.onrender.com`
4. Deploy the project.

This repository includes `vercel.json` to configure static build deployment for the `frontend` folder.

If you deploy the frontend to Vercel, your backend API must still be hosted separately. Use the backend URL as the `VITE_API_BASE_URL` value.

## API Endpoints

- `POST /api/crop/recommend`
- `POST /api/yield/predict`
- `POST /api/soil/analyze`
- `POST /api/pca/analyze`

The frontend is configured to proxy `/api` calls to `http://localhost:8000`.
