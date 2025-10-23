# 🚀 Quick Deployment Steps

Follow these steps to deploy your House Price Prediction app online!

## ⚡ Fast Track (15 minutes)

### Step 1: Push to GitHub (3 min)

```powershell
# Initialize git if needed
git init

# Add all files
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub: https://github.com/new
# Name it: house-price-prediction

# Connect and push
git remote add origin https://github.com/YOUR_USERNAME/house-price-prediction.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Backend on Render (5 min)

1. **Go to**: https://render.com (Sign in with GitHub)

2. **Click**: "New +" → "Web Service"

3. **Select**: Your `house-price-prediction` repository

4. **Configure**:
   ```
   Name: house-price-api
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt && python train_model.py
   Start Command: gunicorn app:app
   Instance Type: Free
   ```

5. **Click**: "Create Web Service"

6. **Wait**: 5-10 minutes for deployment

7. **Copy URL**: `https://house-price-api-xxxx.onrender.com`

**⚠️ Important**: Free tier takes 50 seconds to wake up on first request!

---

### Step 3: Deploy Frontend on Vercel (5 min)

1. **Go to**: https://vercel.com (Sign in with GitHub)

2. **Click**: "Add New" → "Project"

3. **Import**: Your `house-price-prediction` repository

4. **Configure**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variable**:
   ```
   Name: VITE_API_URL
   Value: https://house-price-api-xxxx.onrender.com
   ```
   (Use your Render URL from Step 2)

6. **Click**: "Deploy"

7. **Wait**: 2-3 minutes

8. **Get URL**: `https://your-app.vercel.app`

---

### Step 4: Update Firebase (2 min)

1. **Go to**: https://console.firebase.google.com

2. **Select**: mltproject-d8cb9

3. **Navigate**: Authentication → Settings → Authorized domains

4. **Add**: `your-app.vercel.app` (without https://)

5. **Save**

---

### Step 5: Update Backend CORS (Optional)

For better security, update `backend/app.py`:

```python
ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://your-app.vercel.app'  # Add your Vercel URL
]

CORS(app, resources={
    r"/api/*": {
        "origins": ALLOWED_ORIGINS,  # Change from "*"
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

Then push:
```powershell
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy in 2 minutes!

---

## ✅ Testing Your Live App

1. **Visit**: `https://your-app.vercel.app`

2. **Sign Up**: Create a new account

3. **Test Features**:
   - ✅ House Price Prediction
   - ✅ Analytics
   - ✅ History
   - ✅ Settings

---

## 🎉 You're Live!

Share your app URL:
```
https://your-app.vercel.app
```

---

## 🔧 Troubleshooting

### Backend not responding?
- Check Render dashboard: https://dashboard.render.com
- View logs for errors
- Free tier takes 50 seconds to wake up after inactivity

### Firebase auth error?
- Verify domain added in Firebase Console
- Check API keys in firebase.js

### CORS error?
- Verify VITE_API_URL in Vercel environment variables
- Check backend CORS settings

---

## 📊 Monitor Your App

### Vercel Dashboard
- Real-time logs
- Performance metrics
- Custom domain setup

### Render Dashboard
- Backend health
- API logs
- Resource usage

---

## 🔄 Future Updates

Make changes and deploy automatically:

```powershell
# Edit your code
git add .
git commit -m "Your changes"
git push
```

Both Vercel and Render will auto-deploy! 🚀

---

## 💡 Pro Tips

1. **Custom Domain**: Buy domain and connect to Vercel
2. **Analytics**: Add Google Analytics to track users
3. **Monitoring**: Use Vercel Analytics for insights
4. **Backup**: Export Firebase data regularly
5. **Security**: Enable 2FA on all accounts

---

## 📱 Share Your App

Your portfolio-ready links:
- **Live App**: https://your-app.vercel.app
- **GitHub**: https://github.com/YOUR_USERNAME/house-price-prediction
- **Backend API**: https://house-price-api-xxxx.onrender.com

---

Need detailed instructions? See `DEPLOYMENT_GUIDE.md` 📖
