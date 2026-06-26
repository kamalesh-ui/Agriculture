from fastapi import APIRouter
from app.schemas.soil_schema import SoilAnalysisInput, SoilData
from app.services.soil_service import analyze_soil

router = APIRouter()

@router.post("/analyze", response_model=SoilData)
async def analyze(input_data: SoilAnalysisInput):
    return analyze_soil(input_data)
