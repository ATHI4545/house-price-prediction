# 🏠 House Price Prediction App

A full-stack web application for predicting house prices in Tamil Nadu using Machine Learning. Built with React, Flask, and Firebase.

![React](https://img.shields.io/badge/React-18.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![ML](https://img.shields.io/badge/ML-ScikitLearn-yellow)

## ✨ Features

- 🔐 **User Authentication** - Firebase email/password authentication
- �️ **House Price Prediction** - ML-powered predictions for Tamil Nadu properties
- 📊 **Market Analytics** - View statistics and trends by district and taluk
- 📝 **Search History** - Track your predictions and analytics searches
- ⚙️ **User Settings** - Manage account, preferences, and data
- �️ **38 Districts** - Complete coverage of Tamil Nadu with 300+ taluks
- 💰 **Indian Rupees** - Prices in ₹ (INR currency)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Firebase account
- Git

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to **Project Settings** > **General**
4. Scroll down to "Your apps" and click the web icon (`</>`)
5. Register your app and copy the Firebase configuration
6. Enable **Email/Password** authentication:
   - Go to **Authentication** > **Sign-in method**
   - Enable **Email/Password**
7. Update `src/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mlt_project
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase (see Firebase Setup above)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
mlt_project/
├── src/
│   ├── components/
│   │   ├── Login.jsx           # Login page
│   │   ├── Login.css
│   │   ├── SignUp.jsx          # Sign up page
│   │   ├── SignUp.css
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Dashboard.css
│   │   ├── HousePrediction.jsx # Price prediction form
│   │   ├── HousePrediction.css
│   │   └── ProtectedRoute.jsx  # Route guard component
│   ├── firebase.js             # Firebase configuration
│   ├── App.jsx                 # Main app component
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: Access the main dashboard after login
4. **House Prediction**: Click on "Go to Prediction" to enter house details and get price estimates

## House Prediction Features

The prediction form accepts:
- Area (square feet)
- Number of bedrooms
- Number of bathrooms
- Number of stories
- Parking spaces
- Furnished status
- Location

**Note**: Currently using a simulated prediction model. Replace with your actual ML model API endpoint in `src/components/HousePrediction.jsx`.

## Integrating Your ML Model

To connect a real machine learning model:

1. Deploy your ML model as an API endpoint
2. Update the `handlePredict` function in `src/components/HousePrediction.jsx`
3. Replace the simulated prediction with an actual API call:

```javascript
const handlePredict = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('YOUR_ML_API_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    setPrediction(data.predictedPrice);
  } catch (error) {
    console.error('Prediction error:', error);
  } finally {
    setLoading(false);
  }
};
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **Firebase** - Authentication and backend
- **React Router** - Navigation
- **React Firebase Hooks** - Firebase React integration

## Security Notes

- Never commit your Firebase configuration with real credentials to version control
- Use environment variables for sensitive data in production
- Enable Firebase security rules for production deployment

## Future Enhancements

- [ ] Add prediction history tracking
- [ ] Implement analytics dashboard
- [ ] Add user profile management
- [ ] Export predictions to PDF
- [ ] Add more house features for better predictions
- [ ] Implement password reset functionality

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
