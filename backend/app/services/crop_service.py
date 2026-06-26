import pickle
from pathlib import Path
from typing import List

from app.schemas.crop_schema import CropRecommendationInput, CropRecommendationResult

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "crop_model.pkl"

CROP_PROFILES = [
    {
        "name": "Wheat",
        "temperature": (18, 26),
        "humidity": (40, 70),
        "ph": (6.0, 7.0),
        "rainfall": (90, 150),
        "nitrogen": (30, 60),
        "phosphorus": (25, 45),
        "potassium": (20, 40),
        "season": "Spring",
        "waterRequirement": "Moderate",
    },
    {
        "name": "Maize",
        "temperature": (20, 30),
        "humidity": (45, 75),
        "ph": (5.5, 7.0),
        "rainfall": (100, 200),
        "nitrogen": (35, 70),
        "phosphorus": (30, 60),
        "potassium": (25, 55),
        "season": "Summer",
        "waterRequirement": "High",
    },
    {
        "name": "Rice",
        "temperature": (22, 32),
        "humidity": (60, 90),
        "ph": (5.5, 6.8),
        "rainfall": (120, 250),
        "nitrogen": (40, 80),
        "phosphorus": (35, 65),
        "potassium": (30, 60),
        "season": "Monsoon",
        "waterRequirement": "High",
    },
    {
        "name": "Soybean",
        "temperature": (18, 28),
        "humidity": (50, 75),
        "ph": (6.0, 7.5),
        "rainfall": (80, 140),
        "nitrogen": (20, 45),
        "phosphorus": (15, 35),
        "potassium": (15, 35),
        "season": "Summer",
        "waterRequirement": "Moderate",
    },
]

WEIGHTS = {
    "temperature": 0.15,
    "humidity": 0.12,
    "ph": 0.18,
    "rainfall": 0.18,
    "nitrogen": 0.15,
    "phosphorus": 0.11,
    "potassium": 0.11,
}


def _score_feature(value: float, ideal_range: tuple[float, float]) -> float:
    low, high = ideal_range
    midpoint = (low + high) / 2
    span = max(high - low, 1)
    deviation = abs(value - midpoint) / (span / 2)
    return max(0.0, 1.0 - deviation)


def _load_model():
    if not MODEL_PATH.exists():
        return None
    with open(MODEL_PATH, "rb") as model_file:
        return pickle.load(model_file)


def _predict_with_model(input_data: CropRecommendationInput):
    model_package = _load_model()
    if not model_package:
        return None

    model = model_package["model"]
    encoder = model_package["encoder"]
    features = [
        input_data.nitrogen,
        input_data.phosphorus,
        input_data.potassium,
        input_data.temperature,
        input_data.humidity,
        input_data.ph,
        input_data.rainfall,
    ]
    prediction = model.predict([features])[0]
    crop_name = encoder.inverse_transform([prediction])[0]
    return crop_name


def recommend_crop(input_data: CropRecommendationInput) -> CropRecommendationResult:
    predicted_crop = _predict_with_model(input_data)
    if predicted_crop:
        best_crop = next(profile for profile in CROP_PROFILES if profile["name"] == predicted_crop)
        return CropRecommendationResult(
            crop=predicted_crop,
            confidence=0.85,
            description=(
                f"{predicted_crop} is recommended by the trained model based on the provided inputs."
            ),
            growingSeason=best_crop["season"],
            waterRequirement=best_crop["waterRequirement"],
            alternativeCrops=[],
        )

    scored: List[tuple[float, dict]] = []
    for profile in CROP_PROFILES:
        score = 0.0
        for feature, weight in WEIGHTS.items():
            score += _score_feature(getattr(input_data, feature), profile[feature]) * weight
        scored.append((score, profile))

    scored.sort(key=lambda item: item[0], reverse=True)
    best_score, best_crop = scored[0]
    alternative_crops = [
        {"name": profile["name"], "confidence": round(score, 2)}
        for score, profile in scored[1:3]
    ]

    return CropRecommendationResult(
        crop=best_crop["name"],
        confidence=round(min(max(best_score, 0.0), 1.0), 2),
        description=(
            f"{best_crop['name']} is suitable for the current soil and weather profile, "
            f"with the best match on pH, nutrient balance, and rainfall."
        ),
        growingSeason=best_crop["season"],
        waterRequirement=best_crop["waterRequirement"],
        alternativeCrops=alternative_crops,
    )
