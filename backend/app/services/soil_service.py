import pickle
from pathlib import Path

from app.schemas.soil_schema import SoilAnalysisInput, SoilData

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "soil_model.pkl"


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(value, maximum))


def _range_score(value: float, ideal_low: float, ideal_high: float) -> float:
    if ideal_low <= value <= ideal_high:
        return 1.0
    distance = min(abs(value - ideal_low), abs(value - ideal_high))
    span = max(ideal_high - ideal_low, 1)
    return max(0.0, 1.0 - distance / span)


def _load_model():
    if not MODEL_PATH.exists():
        return None
    with open(MODEL_PATH, "rb") as model_file:
        return pickle.load(model_file)


def analyze_soil(input_data: SoilAnalysisInput) -> SoilData:
    model_package = _load_model()
    if model_package:
        health_model = model_package["health_model"]
        cluster_model = model_package["cluster_model"]
        encoder = model_package["encoder"]
        features = [
            input_data.nitrogen,
            input_data.phosphorus,
            input_data.potassium,
            input_data.ph,
            input_data.organicMatter,
            input_data.moisture,
        ]
        health_score = round(float(health_model.predict([features])[0]), 2)
        cluster = encoder.inverse_transform([cluster_model.predict([features])[0]])[0]
        description = (
            "Very healthy soil, well balanced for most crops."
            if cluster == "A"
            else "Good soil quality, minor improvements can maximize yield."
            if cluster == "B"
            else "Moderate soil quality, requires targeted amendments."
            if cluster == "C"
            else "Soil needs corrective treatment before planting."
        )
    else:
        nutrient_score = (
            _clamp(input_data.nitrogen / 80.0, 0.0, 1.0)
            + _clamp(input_data.phosphorus / 80.0, 0.0, 1.0)
            + _clamp(input_data.potassium / 80.0, 0.0, 1.0)
        ) / 3

        ph_score = _range_score(input_data.ph, 6.0, 7.0)
        moisture_score = _range_score(input_data.moisture, 25.0, 45.0)
        organic_score = _clamp(input_data.organicMatter / 8.0, 0.0, 1.0)

        health_score = round(
            35 * nutrient_score +
            20 * ph_score +
            20 * moisture_score +
            25 * organic_score,
            2,
        )

        if health_score >= 85:
            cluster = "A"
            description = "Very healthy soil, well balanced for most crops."
        elif health_score >= 70:
            cluster = "B"
            description = "Good soil quality, minor improvements can maximize yield."
        elif health_score >= 55:
            cluster = "C"
            description = "Moderate soil quality, requires targeted amendments."
        else:
            cluster = "D"
            description = "Soil needs corrective treatment before planting."

    recommendations = []
    if input_data.nitrogen < 35:
        recommendations.append("Apply nitrogen-rich fertilizer or cover crop.")
    if input_data.phosphorus < 25:
        recommendations.append("Add phosphorus supplements such as bone meal.")
    if input_data.potassium < 25:
        recommendations.append("Use potassium-based fertilizer.")
    if input_data.organicMatter < 4.0:
        recommendations.append("Increase organic matter with compost or manure.")
    if input_data.ph < 6.0:
        recommendations.append("Raise soil pH with lime.")
    elif input_data.ph > 7.5:
        recommendations.append("Lower soil pH with sulfur or acidifying fertilizers.")
    if input_data.moisture < 25.0:
        recommendations.append("Improve irrigation and moisture retention.")
    elif input_data.moisture > 45.0:
        recommendations.append("Improve drainage to avoid waterlogging.")
    if not recommendations:
        recommendations.append("Maintain current management practices and monitor soil every season.")

    return SoilData(
        healthScore=health_score,
        cluster=cluster,
        clusterDescription=description,
        nitrogen=input_data.nitrogen,
        phosphorus=input_data.phosphorus,
        potassium=input_data.potassium,
        ph=input_data.ph,
        organicMatter=input_data.organicMatter,
        moisture=input_data.moisture,
        recommendations=recommendations,
    )
