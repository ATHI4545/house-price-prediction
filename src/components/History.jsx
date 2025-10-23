import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './History.css';

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'prediction', 'analytics'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  useEffect(() => {
    // Load history from localStorage
    loadHistory();
  }, []);

  const loadHistory = () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const storedHistory = localStorage.getItem(`history_${userId}`);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    }
  };

  const clearHistory = () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      if (window.confirm('Are you sure you want to clear all history?')) {
        localStorage.removeItem(`history_${userId}`);
        setHistory([]);
      }
    }
  };

  const deleteItem = (id) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem(`history_${userId}`, JSON.stringify(updatedHistory));
    }
  };

  const getFilteredHistory = () => {
    let filtered = history;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.type === filter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
    });

    return filtered;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="history-container">
      <header className="history-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>📜 Search History</h1>
        <p className="subtitle">Your prediction and analytics search history</p>
      </header>

      <div className="history-content">
        <div className="controls-bar">
          <div className="filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({history.length})
            </button>
            <button
              className={`filter-btn ${filter === 'prediction' ? 'active' : ''}`}
              onClick={() => setFilter('prediction')}
            >
              Predictions ({history.filter(h => h.type === 'prediction').length})
            </button>
            <button
              className={`filter-btn ${filter === 'analytics' ? 'active' : ''}`}
              onClick={() => setFilter('analytics')}
            >
              Analytics ({history.filter(h => h.type === 'analytics').length})
            </button>
          </div>

          <div className="actions">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            {history.length > 0 && (
              <button className="clear-btn" onClick={clearHistory}>
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No history found</h3>
            <p>
              {filter === 'all'
                ? 'Start making predictions or viewing analytics to build your history'
                : `No ${filter} searches found`}
            </p>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((item) => (
              <div key={item.id} className={`history-item ${item.type}`}>
                <div className="item-header">
                  <div className="item-type">
                    {item.type === 'prediction' ? '🏠 Prediction' : '📊 Analytics'}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item.id)}
                    title="Delete"
                  >
                    ×
                  </button>
                </div>

                <div className="item-content">
                  <div className="location-info">
                    <h3>📍 {item.taluk}, {item.district}</h3>
                    <p className="timestamp">{formatDate(item.timestamp)}</p>
                  </div>

                  {item.type === 'prediction' && (
                    <div className="prediction-details">
                      <div className="predicted-price">
                        <span className="label">Predicted Price:</span>
                        <span className="value">₹{item.predictedPrice?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="property-specs">
                        <span className="spec">📐 {item.area} sq.ft</span>
                        <span className="spec">🛏️ {item.bedrooms} beds</span>
                        <span className="spec">🚿 {item.bathrooms} baths</span>
                        <span className="spec">🚗 {item.parking} parking</span>
                      </div>
                      <div className="additional-info">
                        <span className="info-item">Quality: {item.overallQual}/10</span>
                        <span className="info-item">Year: {item.yearBuilt}</span>
                      </div>
                    </div>
                  )}

                  {item.type === 'analytics' && (
                    <div className="analytics-details">
                      <div className="analytics-summary">
                        <div className="summary-item">
                          <span className="label">Avg Price</span>
                          <span className="value">₹{item.avgPrice?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Price/Sq.ft</span>
                          <span className="value">₹{item.pricePerSqft?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Listings</span>
                          <span className="value">{item.totalListings}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Demand</span>
                          <span className="value">{item.demandIndex}/100</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="item-footer">
                  <button
                    className="repeat-btn"
                    onClick={() => {
                      if (item.type === 'prediction') {
                        navigate('/house-prediction');
                      } else {
                        navigate('/analytics');
                      }
                    }}
                  >
                    {item.type === 'prediction' ? '🔄 New Prediction' : '🔄 View Analytics'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
