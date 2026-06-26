import pickle
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"


def load_pickle_model(filename: str):
    path = MODEL_DIR / filename
    if not path.exists():
        return None

    with open(path, "rb") as f:
        return pickle.load(f)
