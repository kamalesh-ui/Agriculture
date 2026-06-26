from fastapi import APIRouter
from app.schemas.pca_schema import PcaAnalysisInput, PcaAnalysisResult
from app.services.pca_service import analyze_pca

router = APIRouter()

@router.post("/analyze", response_model=PcaAnalysisResult)
async def analyze(input_data: PcaAnalysisInput):
    return analyze_pca(input_data)

@router.get("/status")
async def pca_status():
    return {"status": "PCA analysis ready"}
