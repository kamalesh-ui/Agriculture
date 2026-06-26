# Model Files

This directory stores trained model artifacts used by the backend services.

Expected files:

- `crop_model.pkl`
- `yield_model.pkl`
- `soil_model.pkl`

Generate them from the dataset training script:

```powershell
cd backend
python train/train_models.py
```
