import pickle
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "datasets"
MODELS_DIR = ROOT / "backend" / "app" / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def load_data(filename: str) -> pd.DataFrame:
    path = DATA_DIR / filename
    return pd.read_csv(path)


def save_pickle(obj, filename: str):
    path = MODELS_DIR / filename
    with open(path, "wb") as f:
        pickle.dump(obj, f)
    print(f"Saved model to {path}")


def train_crop_model() -> None:
    df = load_data("crop_training.csv")
    features = [
        "nitrogen",
        "phosphorus",
        "potassium",
        "temperature",
        "humidity",
        "ph",
        "rainfall",
    ]
    X = df[features].values
    y = df["crop"].values

    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y_encoded)

    save_pickle({"model": model, "encoder": encoder}, "crop_model.pkl")


def train_yield_model() -> None:
    df = load_data("yield_training.csv")
    features = ["temperature", "humidity", "rainfall", "fertilizerUsage"]
    X = df[features].values
    y = df["predictedYield"].values

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    save_pickle(model, "yield_model.pkl")


def train_soil_model() -> None:
    df = load_data("soil_training.csv")
    features = ["nitrogen", "phosphorus", "potassium", "ph", "organicMatter", "moisture"]
    X = df[features].values
    y = df["healthScore"].values
    cluster = df["cluster"].values

    health_model = RandomForestRegressor(n_estimators=100, random_state=42)
    health_model.fit(X, y)

    cluster_encoder = LabelEncoder()
    cluster_encoded = cluster_encoder.fit_transform(cluster)
    cluster_model = RandomForestClassifier(n_estimators=100, random_state=42)
    cluster_model.fit(X, cluster_encoded)

    save_pickle({"health_model": health_model, "cluster_model": cluster_model, "encoder": cluster_encoder}, "soil_model.pkl")


def main():
    print("Training models from datasets...")
    train_crop_model()
    train_yield_model()
    train_soil_model()
    print("Training complete.")


if __name__ == "__main__":
    main()
