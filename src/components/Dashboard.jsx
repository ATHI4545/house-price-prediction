import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const goToHousePrediction = () => {
    navigate('/house-prediction');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>House Price Prediction Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome!</h2>
          <p>Predict house prices using our machine learning model</p>
        </div>

        <div className="features-grid">
          <div className="feature-card" onClick={goToHousePrediction}>
            <div className="feature-icon">🏠</div>
            <h3>House Price Prediction</h3>
            <p>Get accurate house price predictions based on various features</p>
            <button className="feature-btn">Go to Prediction</button>
          </div>

          <div className="feature-card" onClick={() => navigate('/analytics')}>
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>View detailed analytics and market trends by district and taluk</p>
            <button className="feature-btn">View Analytics</button>
          </div>

          <div className="feature-card" onClick={() => navigate('/history')}>
            <div className="feature-icon">📈</div>
            <h3>History</h3>
            <p>View your prediction and analytics search history</p>
            <button className="feature-btn">View History</button>
          </div>

          <div className="feature-card" onClick={() => navigate('/settings')}>
            <div className="feature-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Manage your account and app preferences</p>
            <button className="feature-btn">Open Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
