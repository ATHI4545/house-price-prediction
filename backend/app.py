from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# CORS Configuration for production
ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    # Add your Vercel domain after deployment
    # 'https://your-app.vercel.app'
]

# Enable CORS - Allow all origins for now (restrict in production)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # Change to ALLOWED_ORIGINS in production for security
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Load the trained model (you'll create this)
MODEL_PATH = 'model.pkl'
model = None

# Try to train model if it doesn't exist
if not os.path.exists(MODEL_PATH):
    print("⚠️  model.pkl not found. Attempting to train model...")
    try:
        import train_model
        train_model.main()
        print("✅ Model trained successfully!")
    except Exception as e:
        print(f"⚠️  Could not train model: {str(e)}")
        print("Using fallback formula for predictions")

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
        print("✅ Model loaded successfully!")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Predict house price based on input features"""
    # Handle preflight request
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Extract features from request
        # Matching the Kaggle House Prices dataset features
        features = {
            'OverallQual': data.get('overallQual', 5),  # Overall quality (1-10)
            'GrLivArea': data.get('area', 1500),  # Above grade living area
            'GarageCars': data.get('parking', 1),  # Garage capacity
            'GarageArea': data.get('parking', 1) * 300,  # Garage area
            'TotalBsmtSF': data.get('area', 1500) * 0.5,  # Basement area
            '1stFlrSF': data.get('area', 1500) * 0.5,  # First floor area
            'FullBath': data.get('bathrooms', 2),  # Full bathrooms
            'TotRmsAbvGrd': data.get('bedrooms', 3) + data.get('bathrooms', 2),  # Total rooms
            'YearBuilt': data.get('yearBuilt', 2010),  # Year built
            'YearRemodAdd': data.get('yearBuilt', 2010) + 5,  # Year remodeled
        }
        
        location = data.get('location', 'Unknown')
        
        # If model is loaded, use it
        if model is not None:
            # Prepare features for the model
            feature_array = np.array([list(features.values())])
            prediction = model.predict(feature_array)[0]
        else:
            # Fallback: Simple estimation formula based on key features
            base_price = 50000
            area_price = features['GrLivArea'] * 100
            quality_multiplier = features['OverallQual'] / 5
            garage_price = features['GarageCars'] * 15000
            bathroom_price = features['FullBath'] * 10000
            
            prediction = (base_price + area_price + garage_price + bathroom_price) * quality_multiplier
        
        return jsonify({
            'success': True,
            'predicted_price': float(prediction),
            'location': location,
            'features_used': features,
            'model_used': model is not None
        })
    
    except Exception as e:
        print(f"Error in prediction: {str(e)}")  # Log error
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    # Use environment variable for port (Render sets this automatically)
    port = int(os.environ.get('PORT', 5000))
    # Disable debug in production
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)
