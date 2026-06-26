from pydantic import BaseModel


class SoilAnalysisInput(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    organicMatter: float
    moisture: float


class SoilData(BaseModel):
    healthScore: float
    cluster: str
    clusterDescription: str
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    organicMatter: float
    moisture: float
    recommendations: list[str]
