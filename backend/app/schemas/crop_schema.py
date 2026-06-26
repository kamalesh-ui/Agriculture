from pydantic import BaseModel


class CropRecommendationInput(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


class CropRecommendationResult(BaseModel):
    crop: str
    confidence: float
    description: str
    growingSeason: str
    waterRequirement: str
    alternativeCrops: list[dict[str, float]]
