from pydantic import BaseModel, Field
from pydantic import ConfigDict


class HistoricalDataPoint(BaseModel):
    month: str
    yield_: float = Field(..., alias="yield")
    predicted: float

    model_config = ConfigDict(populate_by_name=True)


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
    historicalData: list[HistoricalDataPoint]
