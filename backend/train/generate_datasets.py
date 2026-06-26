import csv
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "datasets"
DATA_DIR.mkdir(exist_ok=True)

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

YIELD_BASE = {
    "Wheat": 4.0,
    "Maize": 6.5,
    "Rice": 5.5,
    "Soybean": 3.2,
}

SOIL_CLUSTERS = [
    {"cluster": "A", "score": (85, 100)},
    {"cluster": "B", "score": (70, 84)},
    {"cluster": "C", "score": (55, 69)},
    {"cluster": "D", "score": (0, 54)},
]


def sample_range(value_range):
    return round(random.uniform(*value_range), 2)


def generate_crop_dataset(rows=120):
    path = DATA_DIR / "crop_training.csv"
    fieldnames = [
        "nitrogen",
        "phosphorus",
        "potassium",
        "temperature",
        "humidity",
        "ph",
        "rainfall",
        "crop",
        "season",
        "waterRequirement",
    ]

    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for _ in range(rows):
            profile = random.choice(CROP_PROFILES)
            row = {
                "nitrogen": sample_range(profile["nitrogen"]),
                "phosphorus": sample_range(profile["phosphorus"]),
                "potassium": sample_range(profile["potassium"]),
                "temperature": sample_range(profile["temperature"]),
                "humidity": sample_range(profile["humidity"]),
                "ph": sample_range(profile["ph"]),
                "rainfall": sample_range(profile["rainfall"]),
                "crop": profile["name"],
                "season": profile["season"],
                "waterRequirement": profile["waterRequirement"],
            }
            writer.writerow(row)

    print(f"Generated {path}")


def generate_yield_dataset(rows=120):
    path = DATA_DIR / "yield_training.csv"
    fieldnames = [
        "cropType",
        "temperature",
        "humidity",
        "rainfall",
        "fertilizerUsage",
        "predictedYield",
    ]

    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for _ in range(rows):
            crop_type = random.choice(list(YIELD_BASE.keys()))
            base = YIELD_BASE[crop_type]
            temperature = sample_range((18, 32))
            humidity = sample_range((45, 85))
            rainfall = sample_range((70, 220))
            fertilizer = sample_range((10, 50))
            modifier = (
                0.75
                + 0.12 * max(0, 1 - abs(temperature - 24) / 10)
                + 0.08 * max(0, 1 - abs(humidity - 60) / 40)
                + 0.05 * max(0, 1 - abs(rainfall - 140) / 80)
                + 0.1 * (fertilizer / 50)
            )
            yield_value = round(base * modifier, 2)
            writer.writerow(
                {
                    "cropType": crop_type,
                    "temperature": temperature,
                    "humidity": humidity,
                    "rainfall": rainfall,
                    "fertilizerUsage": fertilizer,
                    "predictedYield": yield_value,
                }
            )

    print(f"Generated {path}")


def generate_soil_dataset(rows=120):
    path = DATA_DIR / "soil_training.csv"
    fieldnames = [
        "nitrogen",
        "phosphorus",
        "potassium",
        "ph",
        "organicMatter",
        "moisture",
        "healthScore",
        "cluster",
    ]

    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for _ in range(rows):
            nitrogen = sample_range((15, 85))
            phosphorus = sample_range((10, 85))
            potassium = sample_range((10, 85))
            ph = sample_range((5.0, 8.0))
            organic_matter = sample_range((1.5, 8.0))
            moisture = sample_range((15.0, 55.0))

            nutrient_score = (min(nitrogen / 80, 1) + min(phosphorus / 80, 1) + min(potassium / 80, 1)) / 3
            ph_score = max(0.0, 1.0 - abs(ph - 6.5) / 1.5)
            moisture_score = max(0.0, 1.0 - abs(moisture - 35) / 25)
            organic_score = min(organic_matter / 8.0, 1.0)
            health_score = round(
                35 * nutrient_score +
                20 * ph_score +
                20 * moisture_score +
                25 * organic_score,
                2,
            )
            health_score = min(100.0, max(0.0, health_score))

            cluster = next(
                (item["cluster"] for item in SOIL_CLUSTERS if item["score"][0] <= health_score <= item["score"][1]),
                "A",
            )

            writer.writerow(
                {
                    "nitrogen": nitrogen,
                    "phosphorus": phosphorus,
                    "potassium": potassium,
                    "ph": ph,
                    "organicMatter": organic_matter,
                    "moisture": moisture,
                    "healthScore": health_score,
                    "cluster": cluster,
                }
            )

    print(f"Generated {path}")


def generate_pca_dataset(rows=30):
    path = DATA_DIR / "pca_samples.csv"
    fieldnames = ["sampleId", "nitrogen", "ph", "moisture"]

    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for i in range(rows):
            writer.writerow(
                {
                    "sampleId": i + 1,
                    "nitrogen": sample_range((15, 85)),
                    "ph": sample_range((5.2, 7.8)),
                    "moisture": sample_range((18, 50)),
                }
            )

    print(f"Generated {path}")


def main():
    generate_crop_dataset()
    generate_yield_dataset()
    generate_soil_dataset()
    generate_pca_dataset()


if __name__ == "__main__":
    main()
