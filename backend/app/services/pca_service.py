from sklearn.decomposition import PCA
from app.schemas.pca_schema import PcaAnalysisInput, PcaAnalysisResult


def analyze_pca(input_data: PcaAnalysisInput) -> PcaAnalysisResult:
    if len(input_data.samples) < 2:
        raise ValueError("Provide at least two samples for PCA analysis.")

    n_components = min(input_data.n_components, len(input_data.features), len(input_data.samples))
    pca = PCA(n_components=n_components)
    transformed = pca.fit_transform(input_data.samples)

    return PcaAnalysisResult(
        components=[list(component) for component in pca.components_],
        explainedVariance=[round(float(value), 4) for value in pca.explained_variance_ratio_],
        transformedData=[list(row) for row in transformed],
        features=input_data.features,
    )
