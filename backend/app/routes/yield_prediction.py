from fastapi import APIRouter
from app.schemas.yield_schema import YieldPredictionInput, YieldPredictionResult
from app.services.yield_service import predict_yield

router = APIRouter()

@router.post("/predict", response_model=YieldPredictionResult)
async def predict(input_data: YieldPredictionInput):
    return predict_yield(input_data)
