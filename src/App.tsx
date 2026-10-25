import { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocateFixed, MapPin, X } from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import MyPets from './pages/MyPets';
import Health from './pages/Health';
import DailyCare from './pages/DailyCare';
import AIAssistant from './pages/AIAssistant';
import Services from './pages/Services';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Adoption from './pages/Adoption';
import PetFriendlyPlaces from './pages/PetFriendlyPlaces';
import LostFound from './pages/LostFound';
import Community from './pages/Community';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import { useApp } from './contexts/AppContext';
import { auth, isFirebaseConfigured } from './lib/firebase';

async function getCityFromCoordinates(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: { 'Accept-Language': 'en' }
      }
    );

    if (!response.ok) {
      throw new Error('Unable to reverse geocode location');
    }

    const data = await response.json();
    return data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.municipality || data?.address?.state || 'Current location';
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Current location';
  }
}

function LocationSetupModal() {
  const { data, setLocation } = useApp();
  const [manualCity, setManualCity] = useState('');
  const [isOpen, setIsOpen] = useState(!data.settings.location);
  const [status, setStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setIsOpen(!data.settings.location);
  }, [data.settings.location]);

  const useCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setStatus('Location access is not supported in this browser. Please enter your city manually.');
      return;
    }

    setIsLocating(true);
    setStatus('Checking your current location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const detectedCity = await getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
        setLocation(detectedCity);
        setManualCity(detectedCity);
        setIsLocating(false);
        setIsOpen(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setStatus('Location access is blocked. Please enter your city manually.');
          return;
        }
        setStatus('We could not detect your current location. Please enter your city manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  const handleManualSave = () => {
    const trimmed = manualCity.trim();
    if (!trimmed) {
      setStatus('Please enter a city name to continue.');
      return;
    }

    setLocation(trimmed);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(!data.settings.location ? true : false)}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Set your location</h2>
          <button className="btn btn-secondary" onClick={() => setIsOpen(false)} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            We’ll use this location to show nearby services, pet-friendly places, and shops.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={useCurrentLocation} disabled={isLocating}>
              <LocateFixed size={18} />
              {isLocating ? 'Detecting...' : 'Use my current location'}
            </button>
          </div>

          {status && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: '12px', background: '#fff7df', border: '1px solid #f0d99d', color: 'var(--text-primary)' }}>
              {status}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Or enter city manually</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#55745a" />
              <input
                className="form-input"
                value={manualCity}
                onChange={(event) => setManualCity(event.target.value)}
                placeholder="Mumbai, Delhi, Bangalore"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>
            Skip for now
          </button>
          <button type="button" className="btn btn-primary" onClick={handleManualSave}>
            Save location
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const applySessionState = () => {
    const guestMode = localStorage.getItem('pawsync_guest_mode') === 'true';

    if (guestMode) {
      setUser({ uid: 'guest-user', email: 'guest@pawsync.local', displayName: 'Guest User' } as User);
      setLoading(false);
      return;
    }

    if (!auth || !isFirebaseConfigured) {
      setUser(null);
      setLoading(false);
      return;
    }

    onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  };

  useEffect(() => {
    applySessionState();

    const handleAuthChange = () => {
      applySessionState();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('pawsync-auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('pawsync-auth-change', handleAuthChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: '420px', margin: '4rem auto', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 700 }}>Loading PAWSYNC...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#eef1eb' }}>
        <Settings />
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthGate>
        <LocationSetupModal />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pets" element={<MyPets />} />
            <Route path="/health" element={<Health />} />
            <Route path="/daily-care" element={<DailyCare />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/services" element={<Services />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/places" element={<PetFriendlyPlaces />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/community" element={<Community />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </AuthGate>
    </Router>
  );
}

export default App;
