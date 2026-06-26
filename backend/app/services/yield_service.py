import pickle
from pathlib import Path

from app.schemas.yield_schema import YieldPredictionInput, YieldPredictionResult

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "yield_model.pkl"

CROP_BASE_YIELD = {
    "Wheat": 4.0,
    "Maize": 6.5,
    "Rice": 5.5,
    "Soybean": 3.2,
    "Other": 3.8,
}


def _range_score(value: float, ideal_low: float, ideal_high: float) -> float:
    if ideal_low <= value <= ideal_high:
        return 1.0
    distance = min(abs(value - ideal_low), abs(value - ideal_high))
    span = max(ideal_high - ideal_low, 1)
    return max(0.0, 1.0 - distance / (span * 1.5))


def _load_model():
    if not MODEL_PATH.exists():
        return None
    with open(MODEL_PATH, "rb") as model_file:
        return pickle.load(model_file)


def predict_yield(input_data: YieldPredictionInput) -> YieldPredictionResult:
    model = _load_model()
    if model:
        features = [
            [
                input_data.temperature,
                input_data.humidity,
                input_data.rainfall,
                input_data.fertilizerUsage,
            ]
        ]
        predicted_yield = round(float(model.predict(features)[0]), 2)
        confidence = 0.8
    else:
        base = CROP_BASE_YIELD.get(input_data.cropType, CROP_BASE_YIELD["Other"])
        temp_score = _range_score(input_data.temperature, 20, 28)
        humidity_score = _range_score(input_data.humidity, 50, 70)
        rainfall_score = _range_score(input_data.rainfall, 80, 180)
        fertilizer_score = min(max(input_data.fertilizerUsage / 45.0, 0.0), 1.0)

        predicted_yield = base * (
            0.7
            + 0.15 * temp_score
            + 0.08 * humidity_score
            + 0.07 * rainfall_score
            + 0.1 * fertilizer_score
        )
        predicted_yield = round(predicted_yield, 2)
        confidence = round(0.55 + 0.45 * min(temp_score, humidity_score, rainfall_score, fertilizer_score), 2)

    historical_data = [
        {"month": "April", "yield": round(predicted_yield * 0.90, 2), "predicted": round(predicted_yield * 0.92, 2)},
        {"month": "May", "yield": round(predicted_yield * 0.95, 2), "predicted": round(predicted_yield * 0.98, 2)},
        {"month": "June", "yield": round(predicted_yield, 2), "predicted": predicted_yield},
    ]

    return YieldPredictionResult(
        predictedYield=predicted_yield,
        unit="tons/ha",
        confidence=confidence,
        historicalData=historical_data,
    )
