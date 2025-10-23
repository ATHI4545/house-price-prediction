# House Price Prediction Backend

Flask API for predicting house prices using the Kaggle House Prices dataset.

## Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Download the Kaggle Dataset

1. Go to: https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data
2. Download `train.csv`
3. Place it in the `backend/` directory

### 3. Train the Model

```bash
python train_model.py
```

This will:
- Load the Kaggle dataset
- Train a Random Forest model
- Save the model as `model.pkl`

### 4. Start the API Server

```bash
python app.py
```

The API will run on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Predict Price
```
POST /api/predict
```

Request body:
```json
{
  "area": 1500,
  "bedrooms": 3,
  "bathrooms": 2,
  "parking": 1,
  "overallQual": 7
}
```

Response:
```json
{
  "success": true,
  "predicted_price": 180500.50,
  "features_used": {...},
  "model_used": true
}
```

## Features Used

The model uses these key features from the Kaggle dataset:
- **OverallQual**: Overall material and finish quality (1-10)
- **GrLivArea**: Above grade living area (sq ft)
- **GarageCars**: Size of garage in car capacity
- **GarageArea**: Size of garage in square feet
- **TotalBsmtSF**: Total basement area
- **1stFlrSF**: First floor square feet
- **FullBath**: Full bathrooms above grade
- **TotRmsAbvGrd**: Total rooms above grade
- **YearBuilt**: Original construction date
- **YearRemodAdd**: Remodel date

## Testing

Test the API with curl:

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"area": 1500, "bedrooms": 3, "bathrooms": 2, "parking": 1, "overallQual": 7}'
```
