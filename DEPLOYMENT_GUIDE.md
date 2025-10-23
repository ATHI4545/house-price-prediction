# Complete Deployment Guide

This guide will help you deploy your House Price Prediction app online using **Vercel** (Frontend) and **Render** (Backend).

## 🎯 Deployment Architecture

```
Frontend (React + Vite)  →  Vercel (vercel.com)
Backend (Flask + ML)     →  Render (render.com)
Database (User History)  →  Firebase (already configured)
Authentication          →  Firebase Auth (already configured)
```

---

## 📋 Prerequisites

- [x] GitHub account
- [x] Vercel account (sign up with GitHub at vercel.com)
- [x] Render account (sign up with GitHub at render.com)
- [x] Firebase project (already configured)
- [x] Git installed

---

## Part 1: Prepare Your Code for Deployment

### Step 1: Create GitHub Repository

```powershell
# Initialize git (if not already done)
cd c:\Users\HP\Desktop\mlt_project
git init

# Create .gitignore
```

Then create `.gitignore` file with the provided content (see below).

```powershell
# Add all files
git add .
git commit -m "Initial commit - House Price Prediction App"

# Create repository on GitHub (github.com/new)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/house-price-prediction.git
git branch -M main
git push -u origin main
```

### Step 2: Update Backend for Production

The backend needs to be configured for production deployment (files will be created below).

---

## Part 2: Deploy Backend to Render

### Step 1: Add Backend Configuration Files

We'll create:
- `Procfile` - Tells Render how to start the app
- `runtime.txt` - Specifies Python version
- Update `app.py` - For production settings

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `house-price-prediction-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free`

5. Click **"Create Web Service"**

6. Once deployed, copy your backend URL (e.g., `https://house-price-prediction-api.onrender.com`)

### Step 3: Upload Model File

Since Git doesn't handle large files well:

**Option A: Train model on Render (Recommended)**
- The model will be trained when the service starts
- Add code to train model if `model.pkl` doesn't exist

**Option B: Use GitHub Releases**
- Upload `model.pkl` to GitHub Releases
- Download it during Render build

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Update Environment Variables

You need to update the backend API URL in your React app.

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render backend URL (from Part 2, Step 6)

6. Click **"Deploy"**

7. Once deployed, you'll get a URL like: `https://house-price-prediction-xyz.vercel.app`

### Step 3: Update Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `mltproject-d8cb9`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `house-price-prediction-xyz.vercel.app`

---

## Part 4: Final Configuration

### Update CORS in Backend

Make sure your backend allows requests from your Vercel domain:

```python
# In app.py
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "https://house-price-prediction-xyz.vercel.app"  # Your Vercel URL
        ]
    }
})
```

Then push changes and Render will auto-deploy.

---

## 🧪 Testing Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Sign up / Login
3. Test house price prediction
4. Check analytics and history features
5. Verify all features work online

### Common Issues:

**"Failed to connect to prediction server"**
- Check if Render backend is running (green status)
- Verify API URL in Vercel environment variables
- Check Render logs for errors

**"Firebase Auth Error"**
- Make sure Vercel domain is in Firebase authorized domains
- Check Firebase API key in firebase.js

**"Model not found"**
- Check Render logs
- Verify model.pkl is available or train on startup

---

## 📊 Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor performance
- Set up custom domain

### Render Dashboard  
- View backend logs
- Monitor API health
- Check resource usage

---

## 🚀 Continuous Deployment

Now configured for automatic deployments:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Update feature X"
   git push
   ```
3. Vercel and Render will automatically deploy updates!

---

## 💰 Costs

- **Vercel**: Free tier (100GB bandwidth/month)
- **Render**: Free tier (750 hours/month)
- **Firebase**: Free tier (50K reads/day, 20K writes/day)

All services are **FREE** to start! 🎉

---

## 📱 Custom Domain (Optional)

### Add Custom Domain to Vercel:
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel Dashboard → Settings → Domains
3. Add your domain and update DNS records

---

## 🔐 Security Checklist

- [x] Firebase API keys are client-safe (already configured)
- [ ] Never commit sensitive data to GitHub
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set up Firebase Security Rules
- [ ] Monitor for unusual activity

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Firebase Docs**: https://firebase.google.com/docs

**Your deployment is almost ready!** Follow the steps above to get your app live. 🚀
