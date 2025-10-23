import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './HousePrediction.css';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Tamil Nadu Districts with their Taluks
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

function HousePrediction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    area: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    overallQual: 5,
    yearBuilt: new Date().getFullYear() - 10,
    district: '',
    taluk: ''
  });
  const [availableTaluks, setAvailableTaluks] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'district') {
      // When district changes, update available taluks and reset taluk selection
      setFormData(prev => ({
        ...prev,
        district: value,
        taluk: ''
      }));
      setAvailableTaluks(TAMIL_NADU_DISTRICTS[value] || []);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          area: parseFloat(formData.area),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          parking: parseInt(formData.parking),
          overallQual: parseInt(formData.overallQual),
          yearBuilt: parseInt(formData.yearBuilt),
          location: formData.location
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction from server');
      }

      const data = await response.json();
      
      if (data.success) {
        // Convert USD to INR (approximate rate: 1 USD = 83 INR)
        const priceInINR = data.predicted_price * 83;
        setPrediction(priceInINR);
        
        // Save to history
        saveToHistory(priceInINR);
      } else {
        throw new Error(data.error || 'Prediction failed');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      
      // More specific error messages
      if (err.message.includes('fetch')) {
        setError('Cannot connect to prediction server. Please ensure the backend is running at http://localhost:5000');
      } else {
        setError(err.message || 'An error occurred while predicting the price. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (predictedPrice) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const historyItem = {
      id: Date.now().toString(),
      type: 'prediction',
      timestamp: new Date().toISOString(),
      district: formData.district,
      taluk: formData.taluk,
      area: formData.area,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      parking: formData.parking,
      overallQual: formData.overallQual,
      yearBuilt: formData.yearBuilt,
      predictedPrice: predictedPrice
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
    <div className="prediction-container">
      <header className="prediction-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>House Price Prediction</h1>
      </header>

      <div className="prediction-content">
        <div className="prediction-form-container">
          <h2>Enter House Details</h2>
          <form onSubmit={handlePredict} className="prediction-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area">Area (sq ft)</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="e.g., 1500"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="overallQual">Overall Quality (1-10)</label>
                <input
                  type="number"
                  id="overallQual"
                  name="overallQual"
                  value={formData.overallQual}
                  onChange={handleInputChange}
                  placeholder="e.g., 7"
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="parking">Garage Capacity (cars)</label>
                <input
                  type="number"
                  id="parking"
                  name="parking"
                  value={formData.parking}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  min="0"
                  max="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="yearBuilt">Year Built</label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  placeholder="e.g., 2010"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="district">District</label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select District</option>
                  {Object.keys(TAMIL_NADU_DISTRICTS).sort().map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="taluk">Taluk</label>
                <select
                  id="taluk"
                  name="taluk"
                  value={formData.taluk}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.district}
                >
                  <option value="">
                    {formData.district ? 'Select Taluk' : 'Select District First'}
                  </option>
                  {availableTaluks.map((taluk) => (
                    <option key={taluk} value={taluk}>
                      {taluk}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Full Address (Optional)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                placeholder="e.g., Street name, Landmark"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="predict-btn" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Price'}
            </button>
          </form>
        </div>

        {prediction && (
          <div className="prediction-result">
            <h2>Predicted Price</h2>
            <div className="price-display">
              <span className="currency">₹</span>
              <span className="amount">{Math.round(prediction).toLocaleString('en-IN')}</span>
            </div>
            <div className="location-details">
              <p className="location-info">
                <strong>📍 Location:</strong> {formData.taluk}, {formData.district} District
              </p>
              <p className="location-info">
                <strong>🏛️ State:</strong> Tamil Nadu, India
              </p>
            </div>
            <p className="disclaimer">
              * This is an estimated price based on the provided features. 
              Actual market prices may vary based on exact location and market conditions. 
              Price is in Indian Rupees (INR).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HousePrediction;
