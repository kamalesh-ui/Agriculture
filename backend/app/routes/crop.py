from fastapi import APIRouter
from app.schemas.crop_schema import CropRecommendationInput, CropRecommendationResult
from app.services.crop_service import recommend_crop

router = APIRouter()

@router.post("/recommend", response_model=CropRecommendationResult)
async def recommend(input_data: CropRecommendationInput):
    return recommend_crop(input_data)
