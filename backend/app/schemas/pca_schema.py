from pydantic import BaseModel


class PcaAnalysisInput(BaseModel):
    samples: list[list[float]]
    features: list[str]
    n_components: int = 2


class PcaAnalysisResult(BaseModel):
    components: list[list[float]]
    explainedVariance: list[float]
    transformedData: list[list[float]]
    features: list[str]
