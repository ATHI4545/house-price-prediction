import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Analytics.css';

// Tamil Nadu Districts with their Taluks (same as HousePrediction)
const TAMIL_NADU_DISTRICTS = {
  'Ariyalur': ['Ariyalur', 'Andimadam', 'Sendurai', 'Udayarpalayam'],
  'Chengalpattu': ['Chengalpattu', 'Thirukalukundram', 'Tambaram', 'Pallavaram', 'Madurantakam'],
  'Chennai': ['Alandur', 'Ambattur', 'Guindy', 'Madhavaram', 'Sholinganallur', 'Perungudi', 'Tondiarpet', 'Mambalam', 'Royapuram', 'Egmore', 'Fort-Tondiarpet', 'Mylapore-Triplicane', 'Anna Nagar', 'T. Nagar', 'Adyar'],
  'Coimbatore': ['Coimbatore North', 'Coimbatore South', 'Pollachi', 'Valparai', 'Mettupalayam', 'Sulur', 'Madukkarai', 'Anaimalai', 'Kinathukadavu', 'Annur'],
  'Cuddalore': ['Cuddalore', 'Chidambaram', 'Kattumannarkoil', 'Kurinjipadi', 'Panruti', 'Veppur', 'Virudhachalam', 'Tittakudi', 'Bhuvanagiri'],
  'Dharmapuri': ['Dharmapuri', 'Harur', 'Karimangalam', 'Palacode', 'Pennagaram', 'Pappireddipatti'],
  'Dindigul': ['Dindigul East', 'Dindigul West', 'Guziliyamparai', 'Natham', 'Nilakottai', 'Oddanchatram', 'Palani', 'Vedasandur', 'Athoor'],
  'Erode': ['Erode', 'Anthiyur', 'Bhavani', 'Gobichettipalayam', 'Kodumudi', 'Modakkurichi', 'Perundurai', 'Sathyamangalam', 'Thalavadi', 'Ammapettai'],
  'Kallakurichi': ['Kallakurichi', 'Chinnaselam', 'Kalvarayan Hills', 'Sankarapuram', 'Tirukoilur', 'Ulundurpet'],
  'Kancheepuram': ['Kancheepuram', 'Kundrathur', 'Sriperumbudur', 'Uthiramerur', 'Walajabad'],
  'Kanyakumari': ['Agastheeswaram', 'Kalkulam', 'Thovalai', 'Vilavancode'],
  'Karur': ['Karur', 'Aravakurichi', 'Kadavur', 'Krishnarayapuram', 'Kulithalai', 'Manmangalam'],
  'Krishnagiri': ['Krishnagiri', 'Bargur', 'Denkanikottai', 'Hosur', 'Pochampalli', 'Shoolagiri', 'Uthangarai', 'Veppanahalli', 'Anchetti'],
  'Madurai': ['Madurai North', 'Madurai South', 'Kalligudi', 'Melur', 'Peraiyur', 'Thirumangalam', 'Thiruparankundram', 'Usilampatti', 'Vadipatti', 'T. Kallupatti'],
  'Mayiladuthurai': ['Mayiladuthurai', 'Kuthalam', 'Sirkali', 'Tharangambadi'],
  'Nagapattinam': ['Nagapattinam', 'Kilvelur', 'Thirukkuvalai', 'Vedaranyam'],
  'Namakkal': ['Namakkal', 'Kolli Hills', 'Kumarapalayam', 'Mohanur', 'Paramathi Velur', 'Rasipuram', 'Senthamangalam', 'Tiruchengode'],
  'Nilgiris': ['Coonoor', 'Gudalur', 'Kotagiri', 'Kundah', 'Panthalur', 'Udhagamandalam (Ooty)'],
  'Perambalur': ['Perambalur', 'Alathur', 'Kunnam', 'Veppanthattai'],
  'Pudukkottai': ['Pudukkottai', 'Alangudi', 'Aranthangi', 'Avudaiyarkoil', 'Gandarvakottai', 'Illupur', 'Karambakudi', 'Kulathur', 'Manamelkudi', 'Ponnamaravathi', 'Thirumayam', 'Viralimalai'],
  'Ramanathapuram': ['Ramanathapuram', 'Kadaladi', 'Kamuthi', 'Kilakarai', 'Mudukulathur', 'Paramakudi', 'Rajasingamangalam', 'Rameswaram', 'Tiruvadanai'],
  'Ranipet': ['Arakkonam', 'Arcot', 'Nemili', 'Ranipet', 'Sholingur', 'Walajah'],
  'Salem': ['Attur', 'Edappadi', 'Gangavalli', 'Kadayampatti', 'Mettur', 'Omalur', 'Pethanaickenpalayam', 'Salem', 'Sankari', 'Vazhapadi', 'Yercaud'],
  'Sivaganga': ['Sivaganga', 'Devakottai', 'Ilayankudi', 'Kalaiyarkovil', 'Karaikudi', 'Manamadurai', 'Singampunari', 'Tirupathur', 'Tirupattur'],
  'Tenkasi': ['Tenkasi', 'Alangulam', 'Kadayanallur', 'Sankarankovil', 'Shencottai', 'Sivagiri', 'Thiruvengadam', 'Veerakeralampudur'],
  'Thanjavur': ['Thanjavur', 'Budalur', 'Kumbakonam', 'Orathanadu', 'Papanasam', 'Pattukottai', 'Peravurani', 'Thiruvaiyaru', 'Thiruvidaimarudur'],
  'Theni': ['Theni', 'Andipatti', 'Bodinayakkanur', 'Periyakulam', 'Uthamapalayam'],
  'Thoothukudi': ['Thoothukudi', 'Eral', 'Ettayapuram', 'Kayathar', 'Kovilpatti', 'Ottapidaram', 'Sattankulam', 'Srivaikundam', 'Tiruchendur', 'Vilathikulam'],
  'Tiruchirappalli': ['Lalgudi', 'Manachanallur', 'Manapparai', 'Marungapuri', 'Musiri', 'Srirangam', 'Thottiyam', 'Thuraiyur', 'Tiruchirappalli (East)', 'Tiruchirappalli (West)', 'Tiruverumbur'],
  'Tirunelveli': ['Tirunelveli', 'Ambasamudram', 'Cheranmahadevi', 'Manur', 'Nanguneri', 'Palayamkottai', 'Radhapuram'],
  'Tirupathur': ['Tirupathur', 'Ambur', 'Natrampalli', 'Vaniyambadi'],
  'Tiruppur': ['Tiruppur North', 'Tiruppur South', 'Avinashi', 'Dharapuram', 'Kangeyam', 'Madathukulam', 'Palladam', 'Udumalpet', 'Uthukuli'],
  'Tiruvallur': ['Tiruvallur', 'Avadi', 'Gummidipoondi', 'Pallipattu', 'Ponneri', 'Poonamallee', 'R.K. Pet', 'Tiruttani', 'Uthukottai'],
  'Tiruvannamalai': ['Tiruvannamalai', 'Arni', 'Chengam', 'Chetpet', 'Cheyyar', 'Jamunamarathur', 'Kalasapakkam', 'Kilpennathur', 'Polur', 'Thandramet', 'Vandavasi', 'Vembakkam'],
  'Tiruvarur': ['Tiruvarur', 'Kudavasal', 'Koothanallur', 'Mannargudi', 'Nannilam', 'Needamangalam', 'Thiruthuraipoondi', 'Valangaiman'],
  'Vellore': ['Vellore', 'Aanicuts', 'Gudiyatham', 'K V Kuppam', 'Katpadi', 'Pernambut'],
  'Viluppuram': ['Viluppuram', 'Gingee', 'Kandachipuram', 'Marakkanam', 'Melmalaiyanur', 'Thiruvennainallur', 'Tindivanam', 'Vanur', 'Vikravandi'],
  'Virudhunagar': ['Virudhunagar', 'Aruppukkottai', 'Kariyapatti', 'Rajapalayam', 'Sattur', 'Sivakasi', 'Srivilliputhur', 'Tiruchuli', 'Vembakottai', 'Watrap']
};

// Sample analytics data generator
const generateAnalytics = (district, taluk) => {
  const basePrice = {
    'Chennai': 8500000,
    'Coimbatore': 4500000,
    'Madurai': 3500000,
    'Salem': 3000000,
    'Tiruchirappalli': 3200000
  };

  const base = basePrice[district] || 2500000;
  const variation = Math.random() * 0.3 - 0.15; // -15% to +15%
  
  return {
    averagePrice: Math.round(base * (1 + variation)),
    pricePerSqft: Math.round((base * (1 + variation)) / 1200),
    totalListings: Math.floor(Math.random() * 500) + 50,
    avgArea: Math.floor(Math.random() * 800) + 1000,
    priceGrowth: (Math.random() * 15 - 5).toFixed(1),
    demandIndex: Math.floor(Math.random() * 40) + 60,
    popularPropertyTypes: [
      { type: 'Apartments', percentage: 45 },
      { type: 'Independent Houses', percentage: 30 },
      { type: 'Villas', percentage: 15 },
      { type: 'Plots', percentage: 10 }
    ],
    priceRangeDistribution: [
      { range: 'Below ₹25L', count: Math.floor(Math.random() * 50) + 10 },
      { range: '₹25L - ₹50L', count: Math.floor(Math.random() * 80) + 30 },
      { range: '₹50L - ₹1Cr', count: Math.floor(Math.random() * 100) + 40 },
      { range: 'Above ₹1Cr', count: Math.floor(Math.random() * 70) + 20 }
    ]
  };
};

function Analytics() {
  const navigate = useNavigate();
  const [district, setDistrict] = useState('');
  const [taluk, setTaluk] = useState('');
  const [availableTaluks, setAvailableTaluks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setTaluk('');
    setAvailableTaluks(TAMIL_NADU_DISTRICTS[selectedDistrict] || []);
    setAnalytics(null);
  };

  const handleTalukChange = (e) => {
    setTaluk(e.target.value);
  };

  const handleViewAnalytics = () => {
    if (district && taluk) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const data = generateAnalytics(district, taluk);
        setAnalytics(data);
        
        // Save to history
        saveToHistory(data);
        
        setLoading(false);
      }, 800);
    }
  };

  const saveToHistory = (analyticsData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const historyItem = {
      id: Date.now().toString(),
      type: 'analytics',
      timestamp: new Date().toISOString(),
      district: district,
      taluk: taluk,
      avgPrice: analyticsData.averagePrice,
      pricePerSqft: analyticsData.pricePerSqft,
      totalListings: analyticsData.totalListings,
      demandIndex: analyticsData.demandIndex
    };

    // Get existing history
    const existingHistory = localStorage.getItem(`history_${userId}`);
    const history = existingHistory ? JSON.parse(existingHistory) : [];

    // Add new item to beginning
    history.unshift(historyItem);

    // Keep only last 50 items
    const trimmedHistory = history.slice(0, 50);

    // Save back to localStorage
    localStorage.setItem(`history_${userId}`, JSON.stringify(trimmedHistory));
  };

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>📊 Housing Market Analytics</h1>
        <p className="subtitle">Real estate trends and insights across Tamil Nadu</p>
      </header>

      <div className="analytics-content">
        <div className="location-selector">
          <h2>Select Location</h2>
          <div className="selector-grid">
            <div className="form-group">
              <label htmlFor="district">District</label>
              <select
                id="district"
                value={district}
                onChange={handleDistrictChange}
              >
                <option value="">Select District</option>
                {Object.keys(TAMIL_NADU_DISTRICTS).sort().map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="taluk">Taluk</label>
              <select
                id="taluk"
                value={taluk}
                onChange={handleTalukChange}
                disabled={!district}
              >
                <option value="">
                  {district ? 'Select Taluk' : 'Select District First'}
                </option>
                {availableTaluks.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="view-analytics-btn"
              onClick={handleViewAnalytics}
              disabled={!district || !taluk || loading}
            >
              {loading ? 'Loading...' : 'View Analytics'}
            </button>
          </div>
        </div>

        {analytics && (
          <div className="analytics-results">
            <div className="location-header">
              <h2>📍 {taluk}, {district} District</h2>
              <p>Tamil Nadu, India</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Average Price</h3>
                  <p className="stat-value">₹{analytics.averagePrice.toLocaleString('en-IN')}</p>
                  <span className={`growth ${analytics.priceGrowth > 0 ? 'positive' : 'negative'}`}>
                    {analytics.priceGrowth > 0 ? '↑' : '↓'} {Math.abs(analytics.priceGrowth)}% YoY
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📐</div>
                <div className="stat-content">
                  <h3>Price per Sq.Ft</h3>
                  <p className="stat-value">₹{analytics.pricePerSqft.toLocaleString('en-IN')}</p>
                  <span className="info-text">Average rate</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏘️</div>
                <div className="stat-content">
                  <h3>Total Listings</h3>
                  <p className="stat-value">{analytics.totalListings}</p>
                  <span className="info-text">Active properties</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📏</div>
                <div className="stat-content">
                  <h3>Average Area</h3>
                  <p className="stat-value">{analytics.avgArea} sq.ft</p>
                  <span className="info-text">Typical property size</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3>Demand Index</h3>
                  <p className="stat-value">{analytics.demandIndex}/100</p>
                  <span className={`info-text ${analytics.demandIndex > 70 ? 'high-demand' : ''}`}>
                    {analytics.demandIndex > 70 ? 'High demand' : 'Moderate demand'}
                  </span>
                </div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <h3>Property Type Distribution</h3>
                <div className="property-types">
                  {analytics.popularPropertyTypes.map((type, index) => (
                    <div key={index} className="property-type-item">
                      <div className="type-info">
                        <span className="type-name">{type.type}</span>
                        <span className="type-percentage">{type.percentage}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h3>Price Range Distribution</h3>
                <div className="price-ranges">
                  {analytics.priceRangeDistribution.map((range, index) => (
                    <div key={index} className="range-item">
                      <span className="range-label">{range.range}</span>
                      <div className="range-bar">
                        <div
                          className="range-fill"
                          style={{
                            width: `${(range.count / Math.max(...analytics.priceRangeDistribution.map(r => r.count))) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="range-count">{range.count} listings</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="insights-card">
              <h3>💡 Market Insights</h3>
              <ul className="insights-list">
                <li>
                  The average property price in {taluk} is{' '}
                  <strong>₹{analytics.averagePrice.toLocaleString('en-IN')}</strong>
                </li>
                <li>
                  Property prices have{' '}
                  <strong>{analytics.priceGrowth > 0 ? 'increased' : 'decreased'} by {Math.abs(analytics.priceGrowth)}%</strong>{' '}
                  in the past year
                </li>
                <li>
                  Most popular property type: <strong>{analytics.popularPropertyTypes[0].type}</strong>{' '}
                  ({analytics.popularPropertyTypes[0].percentage}%)
                </li>
                <li>
                  Current demand index is <strong>{analytics.demandIndex}/100</strong>,{' '}
                  indicating {analytics.demandIndex > 70 ? 'high' : 'moderate'} buyer interest
                </li>
              </ul>
            </div>
          </div>
        )}

        {!analytics && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Select a location to view analytics</h3>
            <p>Choose a district and taluk to see detailed housing market insights</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
