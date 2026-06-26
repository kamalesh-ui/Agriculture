# AI Smart Agriculture Backend

This backend is a FastAPI service for crop recommendation, yield prediction, soil analysis, and PCA workflows.

## Setup

1. Create a Python virtual environment:

   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the app:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API routes

- `/api/crop`
- `/api/yield`
- `/api/soil`
- `/api/pca`
