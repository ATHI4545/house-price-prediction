import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { updateProfile, updatePassword, signOut } from 'firebase/auth';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings
  const [displayName, setDisplayName] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  
  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  // Preferences
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    saveHistory: true,
    darkMode: false,
    currency: 'INR',
    language: 'English'
  });
  const [preferencesMessage, setPreferencesMessage] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
      
      // Load preferences from localStorage
      const userId = currentUser.uid;
      const savedPrefs = localStorage.getItem(`preferences_${userId}`);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      setProfileMessage('Profile updated successfully! ✓');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (error) {
      setProfileMessage(`Error: ${error.message}`);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match!');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters!');
      return;
    }
    
    try {
      await updatePassword(auth.currentUser, newPassword);
      setPasswordMessage('Password updated successfully! ✓');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setPasswordMessage('Please log out and log in again to change password.');
      } else {
        setPasswordMessage(`Error: ${error.message}`);
      }
    }
  };

  const handleUpdatePreferences = () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences));
      setPreferencesMessage('Preferences saved successfully! ✓');
      setTimeout(() => setPreferencesMessage(''), 3000);
    }
  };

  const handleClearHistory = () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      if (window.confirm('Are you sure you want to clear all search history? This cannot be undone.')) {
        localStorage.removeItem(`history_${userId}`);
        setPreferencesMessage('Search history cleared successfully! ✓');
        setTimeout(() => setPreferencesMessage(''), 3000);
      }
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Clear all cached data? This will log you out.')) {
      const userId = auth.currentUser?.uid;
      if (userId) {
        localStorage.removeItem(`history_${userId}`);
        localStorage.removeItem(`preferences_${userId}`);
      }
      signOut(auth);
      navigate('/login');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ WARNING: Delete your account permanently? This action cannot be undone!')) {
      if (window.confirm('Are you absolutely sure? All your data will be lost forever.')) {
        // TODO: Implement account deletion
        alert('Account deletion feature will be implemented. Please contact support.');
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-container">
      <header className="settings-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>⚙️ Settings</h1>
        <p className="subtitle">Manage your account and preferences</p>
      </header>

      <div className="settings-content">
        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            🎨 Preferences
          </button>
          <button
            className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            💾 Data & Privacy
          </button>
        </div>

        <div className="settings-panel">
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Profile Information</h2>
              <div className="user-info-card">
                <div className="user-avatar">
                  {displayName ? displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <div className="user-details">
                  <h3>{displayName || 'User'}</h3>
                  <p>{user.email}</p>
                  <span className="user-since">
                    Member since {new Date(user.metadata.creationTime).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="settings-form">
                <div className="form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="disabled-input"
                  />
                  <small className="help-text">Email cannot be changed</small>
                </div>

                {profileMessage && (
                  <div className={`message ${profileMessage.includes('Error') ? 'error' : 'success'}`}>
                    {profileMessage}
                  </div>
                )}

                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-content">
              <h2>Security Settings</h2>
              
              <form onSubmit={handleUpdatePassword} className="settings-form">
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                {passwordMessage && (
                  <div className={`message ${passwordMessage.includes('Error') || passwordMessage.includes('!') ? 'error' : 'success'}`}>
                    {passwordMessage}
                  </div>
                )}

                <button type="submit" className="save-btn">
                  Update Password
                </button>
              </form>

              <div className="security-info">
                <h3>Security Tips</h3>
                <ul>
                  <li>Use a strong password with at least 8 characters</li>
                  <li>Include uppercase, lowercase, numbers, and symbols</li>
                  <li>Don't reuse passwords from other websites</li>
                  <li>Change your password regularly</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="tab-content">
              <h2>App Preferences</h2>
              
              <div className="preferences-section">
                <h3>Notifications</h3>
                <div className="preference-item">
                  <div className="preference-info">
                    <strong>Enable Notifications</strong>
                    <p>Receive alerts about price changes and updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <strong>Email Updates</strong>
                    <p>Get weekly market insights via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.emailUpdates}
                      onChange={(e) => setPreferences({...preferences, emailUpdates: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="preferences-section">
                <h3>History & Data</h3>
                <div className="preference-item">
                  <div className="preference-info">
                    <strong>Save Search History</strong>
                    <p>Keep track of your predictions and analytics</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.saveHistory}
                      onChange={(e) => setPreferences({...preferences, saveHistory: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="preferences-section">
                <h3>Display</h3>
                <div className="preference-item">
                  <div className="preference-info">
                    <strong>Currency</strong>
                    <p>Choose your preferred currency</p>
                  </div>
                  <select
                    className="preference-select"
                    value={preferences.currency}
                    onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                  >
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                  </select>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <strong>Language</strong>
                    <p>Select your preferred language</p>
                  </div>
                  <select
                    className="preference-select"
                    value={preferences.language}
                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  >
                    <option value="English">English</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>

              {preferencesMessage && (
                <div className="message success">
                  {preferencesMessage}
                </div>
              )}

              <button onClick={handleUpdatePreferences} className="save-btn">
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="tab-content">
              <h2>Data & Privacy</h2>
              
              <div className="data-section">
                <h3>Your Data</h3>
                <div className="data-item">
                  <div className="data-info">
                    <strong>Clear Search History</strong>
                    <p>Remove all prediction and analytics history</p>
                  </div>
                  <button onClick={handleClearHistory} className="action-btn warning">
                    Clear History
                  </button>
                </div>

                <div className="data-item">
                  <div className="data-info">
                    <strong>Clear Cache</strong>
                    <p>Remove all cached data and preferences</p>
                  </div>
                  <button onClick={handleClearCache} className="action-btn warning">
                    Clear Cache
                  </button>
                </div>
              </div>

              <div className="data-section danger-zone">
                <h3>⚠️ Danger Zone</h3>
                <div className="data-item">
                  <div className="data-info">
                    <strong>Delete Account</strong>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <button onClick={handleDeleteAccount} className="action-btn danger">
                    Delete Account
                  </button>
                </div>
              </div>

              <div className="privacy-info">
                <h3>Privacy Policy</h3>
                <p>
                  We take your privacy seriously. Your data is stored securely and never shared with third parties. 
                  All predictions and analytics searches are saved locally on your device.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
