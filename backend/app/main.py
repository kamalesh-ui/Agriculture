from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import crop, pca, soil, yield_prediction

app = FastAPI(title="AI Smart Agriculture API")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crop.router, prefix="/api/crop", tags=["crop"])
app.include_router(yield_prediction.router, prefix="/api/yield", tags=["yield"])
app.include_router(soil.router, prefix="/api/soil", tags=["soil"])
app.include_router(pca.router, prefix="/api/pca", tags=["pca"])

@app.get("/")
async def root():
    return {"message": "AI Smart Agriculture API is running"}
