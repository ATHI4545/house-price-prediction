# Setup Instructions for Kaggle House Price Prediction

## Complete Setup Steps

### Step 1: Install Python Backend Dependencies

```powershell
cd backend
pip install -r requirements.txt
cd ..
```

### Step 2: Download Kaggle Dataset

1. Go to: https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data
2. Sign in to Kaggle (create account if needed)
3. Click "Download All" to get `train.csv`
4. Extract and move `train.csv` to the `backend/` folder

### Step 3: Train the Model

```powershell
cd backend
python train_model.py
```

This will:
- Load the Kaggle dataset
- Train a Random Forest model
- Display model performance metrics
- Save the model as `model.pkl`

### Step 4: Start the Backend API

Open a **NEW terminal** and run:

```powershell
cd backend
python app.py
```

The API will start on `http://localhost:5000`

### Step 5: Start the React Frontend

In your **original terminal**, run:

```powershell
npm run dev
```

The app will be available at `http://localhost:5173`

## Testing the Integration

1. Open `http://localhost:5173`
2. Sign up / Login with Firebase
3. Go to Dashboard
4. Click "House Price Prediction"
5. Fill in the form:
   - **Area**: 1500 (sq ft)
   - **Bedrooms**: 3
   - **Bathrooms**: 2
   - **Overall Quality**: 7 (scale 1-10)
   - **Garage Capacity**: 2 (cars)
   - **Year Built**: 2010
6. Click "Predict Price"

## Troubleshooting

### "Failed to connect to prediction server"
- Make sure the backend is running: `python app.py` in the `backend/` folder
- Check if `http://localhost:5000/api/health` returns a response

### "train.csv not found"
- Download the dataset from Kaggle
- Place it in the `backend/` directory

### CORS errors
- The backend has CORS enabled by default
- If issues persist, restart both servers

## Architecture

```
Frontend (React)          Backend (Flask)
localhost:5173     -->    localhost:5000
                          
User Input         POST    /api/predict
                   -->    
                          ML Model (Scikit-learn)
                          Random Forest Regressor
                   <--    
Prediction Display        JSON Response
```

## Features

The model uses these Kaggle dataset features:
- Overall Quality (1-10)
- Living Area (sq ft)
- Garage Capacity (cars)
- Bathrooms
- Year Built

The trained model provides realistic predictions based on actual house sale data from Ames, Iowa.
