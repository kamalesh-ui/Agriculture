# Datasets

This folder contains training data for the AI Smart Agriculture models.

## Files

- `crop_training.csv` - crop recommendation training data
- `yield_training.csv` - yield prediction training data
- `soil_training.csv` - soil health training data
- `pca_samples.csv` - sample data for PCA analysis

## Generating data

The dataset files can be generated using the backend training utilities:

```powershell
cd backend
python train/generate_datasets.py
```

## Training models

After generating the datasets, train production models with:

```powershell
python train/train_models.py
```
