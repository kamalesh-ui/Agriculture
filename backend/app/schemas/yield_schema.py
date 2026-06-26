from pydantic import BaseModel


class YieldPredictionInput(BaseModel):
    cropType: str
    temperature: float
    humidity: float
    rainfall: float
    fertilizerUsage: float


class YieldPredictionResult(BaseModel):
    predictedYield: float
    unit: str
    confidence: float
    historicalData: list[dict[str, float]]
