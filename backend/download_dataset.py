#!/usr/bin/env python3
"""
Download Kaggle dataset for deployment
Run this script on your deployment server if train.csv is not included in git
"""

import os
import sys

def download_kaggle_dataset():
    """Download Kaggle house prices dataset"""
    try:
        # Check if kaggle is installed
        import kaggle
        
        print("📥 Downloading Kaggle house prices dataset...")
        
        # Download the dataset
        kaggle.api.competition_download_files(
            'house-prices-advanced-regression-techniques',
            path='.',
            quiet=False
        )
        
        print("✅ Dataset downloaded successfully!")
        
        # Extract if needed
        import zipfile
        if os.path.exists('house-prices-advanced-regression-techniques.zip'):
            print("📦 Extracting files...")
            with zipfile.ZipFile('house-prices-advanced-regression-techniques.zip', 'r') as zip_ref:
                zip_ref.extractall('.')
            os.remove('house-prices-advanced-regression-techniques.zip')
            print("✅ Files extracted!")
            
    except ImportError:
        print("❌ Kaggle package not installed")
        print("Run: pip install kaggle")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\n💡 Alternative: Download manually from:")
        print("https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data")
        sys.exit(1)

if __name__ == '__main__':
    download_kaggle_dataset()
