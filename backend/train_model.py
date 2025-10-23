"""
House Price Prediction Model Training
Based on Kaggle House Prices Dataset
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import pickle

def load_and_prepare_data(filepath='train.csv'):
    """
    Load and prepare the Kaggle House Prices dataset
    Download from: https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data
    """
    try:
        df = pd.read_csv(filepath)
        print(f"Dataset loaded: {df.shape}")
        return df
    except FileNotFoundError:
        print(f"Error: {filepath} not found!")
        print("Please download the dataset from Kaggle:")
        print("https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data")
        return None

def feature_engineering(df):
    """Select and engineer important features"""
    
    # Key features that correlate well with SalePrice
    important_features = [
        'OverallQual',    # Overall quality
        'GrLivArea',      # Above grade living area
        'GarageCars',     # Garage capacity
        'GarageArea',     # Garage area
        'TotalBsmtSF',    # Basement area
        '1stFlrSF',       # First floor area
        'FullBath',       # Full bathrooms
        'TotRmsAbvGrd',   # Total rooms above grade
        'YearBuilt',      # Year built
        'YearRemodAdd',   # Year remodeled
    ]
    
    # Select features that exist in the dataset
    available_features = [f for f in important_features if f in df.columns]
    
    # Create feature dataframe
    X = df[available_features].copy()
    
    # Fill missing values with median
    X = X.fillna(X.median())
    
    # Target variable
    y = df['SalePrice']
    
    return X, y, available_features

def train_model(X, y):
    """Train the prediction model"""
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training set size: {X_train.shape}")
    print(f"Test set size: {X_test.shape}")
    
    # Train Random Forest model
    print("\nTraining Random Forest model...")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)
    
    # Predictions
    y_pred = rf_model.predict(X_test)
    
    # Evaluate
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"RMSE: ${rmse:,.2f}")
    print(f"R² Score: {r2:.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 5 Most Important Features:")
    print(feature_importance.head())
    
    return rf_model

def save_model(model, filename='model.pkl'):
    """Save the trained model"""
    with open(filename, 'wb') as f:
        pickle.dump(model, f)
    print(f"\nModel saved to {filename}")

def main():
    """Main training pipeline"""
    print("=" * 60)
    print("House Price Prediction Model Training")
    print("=" * 60)
    
    # Load data
    df = load_and_prepare_data('train.csv')
    
    if df is None:
        print("\n⚠️  Dataset not found!")
        print("\nTo train the model:")
        print("1. Download train.csv from Kaggle:")
        print("   https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data")
        print("2. Place train.csv in the backend/ directory")
        print("3. Run: python train_model.py")
        return
    
    # Prepare features
    X, y, features = feature_engineering(df)
    print(f"\nUsing {len(features)} features:")
    print(features)
    
    # Train model
    model = train_model(X, y)
    
    # Save model
    save_model(model, 'model.pkl')
    
    print("\n✅ Training complete!")
    print("You can now start the Flask API with: python app.py")

if __name__ == '__main__':
    main()
