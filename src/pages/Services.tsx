import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, CalendarClock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const serviceCatalog = [
  { id: 's1', name: 'Happy Paws Vet Clinic', category: 'veterinary', city: 'Mumbai', state: 'Maharashtra', description: 'Full-service veterinary care for routine checks and urgent concerns.', priceRange: '₹500 - ₹5000', availability: 'Open today until 8:00 PM', tone: 'sage', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80' },
  { id: 's2', name: 'Purrfect Grooming', category: 'grooming', city: 'Delhi', state: 'Delhi', description: 'Professional grooming, bathing, and coat maintenance.', priceRange: '₹800 - ₹2000', availability: '3 slots left today', tone: 'peach', image: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=900&q=80' },
  { id: 's3', name: 'Pet Paradise Daycare', category: 'daycare', city: 'Bangalore', state: 'Karnataka', description: 'Safe playtime, naps, and enrichment for busy owners.', priceRange: '₹500/day', availability: 'Available for drop-in care', tone: 'sage', image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80' },
  { id: 's4', name: 'Woof & Whisker Spa', category: 'grooming', city: 'Pune', state: 'Maharashtra', description: 'Gentle grooming and hygiene care for pets of all sizes.', priceRange: '₹900 - ₹2500', availability: 'Open this weekend', tone: 'gold', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80' },
  { id: 's5', name: 'BarkBuddy Boarding', category: 'daycare', city: 'Hyderabad', state: 'Telangana', description: 'Boarding and daycare for dogs and cats with care supervision.', priceRange: '₹700/day', availability: 'Limited weekday slots', tone: 'sage', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80' },
  { id: 's6', name: 'VetNest Pet Clinic', category: 'veterinary', city: 'Chennai', state: 'Tamil Nadu', description: 'Preventive healthcare, vaccinations, and consultations.', priceRange: '₹600 - ₹4000', availability: 'Vaccination drive this week', tone: 'sage', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80' },
  { id: 's7', name: 'PawCare Animal Hospital', category: 'veterinary', city: 'Ahmedabad', state: 'Gujarat', description: 'Preventive healthcare and pet nutrition support.', priceRange: '₹600 - ₹4500', availability: 'Same-day consults available', tone: 'sage', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80' },
  { id: 's8', name: 'TailWag Groom House', category: 'grooming', city: 'Jaipur', state: 'Rajasthan', description: 'Spa sessions, ear cleaning, and hygienic grooming.', priceRange: '₹750 - ₹2200', availability: 'Weekend slots open', tone: 'gold', image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80' },
  { id: 's9', name: 'City Pets Lodge', category: 'daycare', city: 'Kochi', state: 'Kerala', description: 'Daytime stay, social play, and medication monitoring.', priceRange: '₹550/day', availability: 'Open 7 days a week', tone: 'sage', image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80' },
  { id: 's10', name: 'Guntur Pet Wellness Center', category: 'veterinary', city: 'Guntur', state: 'Andhra Pradesh', description: 'Routine care, vaccinations, and health monitoring for pets in the city.', priceRange: '₹450 - ₹3500', availability: 'Open today until 7:30 PM', tone: 'sage', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80' },
  { id: 's11', name: 'Guntur Paws Groom Studio', category: 'grooming', city: 'Guntur', state: 'Andhra Pradesh', description: 'Bathing, styling, and routine grooming for dogs and cats.', priceRange: '₹700 - ₹2200', availability: '2 slots left today', tone: 'gold', image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80' },
  { id: 's12', name: 'Vijayawada Pet Stay Club', category: 'daycare', city: 'Vijayawada', state: 'Andhra Pradesh', description: 'Safe daycare, play sessions, and supervised rest for pets.', priceRange: '₹600/day', availability: 'Available this week', tone: 'sage', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80' },
  { id: 's13', name: 'Vizag Happy Tails Care', category: 'veterinary', city: 'Visakhapatnam', state: 'Andhra Pradesh', description: 'Clinic consultations, vaccinations, and holistic pet wellness care.', priceRange: '₹500 - ₹4000', availability: 'Consultation slots open', tone: 'sage', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80' },
  { id: 's14', name: 'Rajahmundry Pet Lounge', category: 'grooming', city: 'Rajahmundry', state: 'Andhra Pradesh', description: 'Premium grooming, spa care, and hygiene treatments.', priceRange: '₹800 - ₹2400', availability: 'Weekend appointments open', tone: 'peach', image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80' }
];

const petFriendlyPlaces = [
  { id: 'p1', name: 'Greenfield Dog Park', category: 'park', city: 'Mumbai', state: 'Maharashtra', description: 'Large fenced park and walking routes for active dogs.' },
  { id: 'p2', name: 'Paws Cafe Lounge', category: 'cafe', city: 'Delhi', state: 'Delhi', description: 'Dog-friendly seating and pet-safe treats.' },
  { id: 'p3', name: 'Sunset Pet Trail', category: 'park', city: 'Bangalore', state: 'Karnataka', description: 'Shaded walking path and water stations.' },
  { id: 'p4', name: 'Cozy Cat Corner', category: 'cafe', city: 'Mumbai', state: 'Maharashtra', description: 'Calm cafe space with indoor pet seating.' },
  { id: 'p5', name: 'Mango Bark Walk', category: 'park', city: 'Hyderabad', state: 'Telangana', description: 'Open-air walk track with benches and shade.' },
  { id: 'p6', name: 'Whisker & Bean', category: 'cafe', city: 'Chennai', state: 'Tamil Nadu', description: 'Coffee and treats for both pets and people.' },
  { id: 'p7', name: 'Skyline Pet Path', category: 'park', city: 'Pune', state: 'Maharashtra', description: 'Comfortable walking track with pet hydration points.' },
  { id: 'p8', name: 'Golden Paw Terrace', category: 'cafe', city: 'Kochi', state: 'Kerala', description: 'Relaxed outdoor seating and pet-friendly menu.' },
  { id: 'p9', name: 'Guntur Bark Garden', category: 'park', city: 'Guntur', state: 'Andhra Pradesh', description: 'Dog-friendly walk path with open space and shade.' },
  { id: 'p10', name: 'Paw & Bean Lounge', category: 'cafe', city: 'Guntur', state: 'Andhra Pradesh', description: 'Relaxed seating for pets and owners in the city center.' },
  { id: 'p11', name: 'Vijayawada Walk Trail', category: 'park', city: 'Vijayawada', state: 'Andhra Pradesh', description: 'Spacious walking area with pet-friendly seating.' },
  { id: 'p12', name: 'Vizag Tail Cafe', category: 'cafe', city: 'Visakhapatnam', state: 'Andhra Pradesh', description: 'Pet-friendly cafe serving treats and coffee for owners.' }
];

const stateCityMap: Record<string, string[]> = {
  'andhra pradesh': ['guntur', 'vijayawada', 'visakhapatnam', 'rajahmundry'],
  'maharashtra': ['mumbai', 'pune'],
  'karnataka': ['bangalore'],
  'telangana': ['hyderabad'],
  'tamil nadu': ['chennai'],
  'gujarat': ['ahmedabad'],
  'rajasthan': ['jaipur'],
  'kerala': ['kochi'],
  'delhi': ['delhi']
};

const normalizeLocationText = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');

const locationMatches = (candidateCity: string, candidateState: string, query: string) => {
  if (!query) return true;

  const normalizedCity = normalizeLocationText(candidateCity);
  const normalizedState = normalizeLocationText(candidateState);
  const normalizedQuery = normalizeLocationText(query);

  if (!normalizedCity || !normalizedQuery) return true;

  return (
    normalizedCity.includes(normalizedQuery) ||
    normalizedQuery.includes(normalizedCity) ||
    normalizedState.includes(normalizedQuery) ||
    normalizedQuery.includes(normalizedState) ||
    normalizedCity.split(' ').some((token) => token.length > 2 && normalizedQuery.includes(token)) ||
    normalizedQuery.split(' ').some((token) => token.length > 2 && normalizedCity.includes(token)) ||
    normalizedState.split(' ').some((token) => token.length > 2 && normalizedQuery.includes(token))
  );
};

const getSameStateLocations = (query: string) => {
  const normalizedQuery = normalizeLocationText(query);
  if (!normalizedQuery) return [] as string[];

  const matchingState = Object.entries(stateCityMap).find(([stateName, cities]) => {
    const stateText = normalizeLocationText(stateName);
    return stateText.includes(normalizedQuery) || cities.some(city => normalizeLocationText(city).includes(normalizedQuery));
  });

  return matchingState ? matchingState[1] : [];
};

async function getCityFromCoordinates(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      { headers: { 'Accept-Language': 'en' } }
    );

    if (!response.ok) {
      throw new Error('Location lookup failed');
    }

    const data = await response.json();
    return data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.municipality || data?.address?.state || 'Current location';
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Current location';
  }
}

export default function Services() {
  const { currentPet, data, addAppointment, setLocation: updateAppLocation } = useApp();
  const savedLocation = data.settings.location || currentPet?.location || data.pets[0]?.location || '';
  const [location, setLocation] = useState(savedLocation);
  const [category, setCategory] = useState('all');
  const [searchInput, setSearchInput] = useState(savedLocation);
  const [searchCategory, setSearchCategory] = useState('all');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setLocation(savedLocation);
    setSearchInput(savedLocation);
  }, [savedLocation]);

  const triggerSearch = () => {
    setLocation(searchInput);
    setCategory(searchCategory);
    updateAppLocation(searchInput);
  };

  const hasExactLocationServiceMatch = useMemo(() => {
    const query = location.trim();
    if (!query) return true;
    return serviceCatalog.some((service) => locationMatches(service.city, service.state, query));
  }, [location]);

  const hasExactLocationPlaceMatch = useMemo(() => {
    const query = location.trim();
    if (!query) return true;
    return petFriendlyPlaces.some((place) => locationMatches(place.city, place.state, query));
  }, [location]);

  const filteredServices = useMemo(() => {
    const query = location.trim();
    const matches = serviceCatalog.filter((service) => {
      const cityMatch = locationMatches(service.city, service.state, query);
      const categoryMatch = category === 'all' || service.category === category;
      return cityMatch && categoryMatch;
    });

    if (query && matches.length === 0) {
      const sameStateCities = getSameStateLocations(query);
      const stateFallback = serviceCatalog.filter((service) => {
        const categoryMatch = category === 'all' || service.category === category;
        if (!categoryMatch) return false;
        if (sameStateCities.length > 0) {
          return sameStateCities.some((city) => normalizeLocationText(service.city).includes(city) || normalizeLocationText(city).includes(normalizeLocationText(service.city)));
        }
        return true;
      });
      return stateFallback.length > 0 ? stateFallback : serviceCatalog.filter((service) => category === 'all' || service.category === category);
    }

    return matches;
  }, [location, category]);

  const filteredPlaces = useMemo(() => {
    const query = location.trim();
    const matches = petFriendlyPlaces.filter((place) => {
      const cityMatch = locationMatches(place.city, place.state, query);
      const categoryMatch = category === 'all' || place.category === category;
      return cityMatch && categoryMatch;
    });

    if (query && matches.length === 0) {
      const sameStateCities = getSameStateLocations(query);
      const stateFallback = petFriendlyPlaces.filter((place) => {
        const categoryMatch = category === 'all' || place.category === category;
        if (!categoryMatch) return false;
        if (sameStateCities.length > 0) {
          return sameStateCities.some((city) => normalizeLocationText(place.city).includes(city) || normalizeLocationText(city).includes(normalizeLocationText(place.city)));
        }
        return true;
      });
      return stateFallback.length > 0 ? stateFallback : petFriendlyPlaces.filter((place) => category === 'all' || place.category === category);
    }

    return matches;
  }, [location, category]);

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Location access is not supported in this browser. Please type your city or town manually.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const detected = await getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
        setSearchInput(detected);
        setLocation(detected);
        setSearchCategory(category);
        setCategory(category);
        updateAppLocation(detected);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert('We could not access your location. Please type your city or town manually.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  };

  const handleBook = (service: (typeof serviceCatalog)[number]) => {
    const pet = currentPet || data.pets[0];
    if (!pet) {
      alert('Please add or select a pet profile before booking a service.');
      return;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 2);

    addAppointment({
      petId: pet.id,
      serviceName: service.name,
      date: nextDate.toISOString().split('T')[0],
      time: '10:30',
      status: 'upcoming',
      notes: `Demo booking for ${service.category} in ${service.city}, ${service.state}`
    });

    alert(`${service.name} has been added to your upcoming appointments.`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Services</h1>
        <p>Find pet services and places based on your current location or the city or town you type in.</p>
      </div>

      <div className="card">
        <div className="grid grid-2" style={{ alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">Pet location</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#55745a" />
              <input
                className="form-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Type your city or town, or use GPS"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Service type</label>
            <select className="form-select" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="all">All services</option>
              <option value="veterinary">Veterinary</option>
              <option value="grooming">Grooming</option>
              <option value="daycare">Daycare</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={triggerSearch}>
            <Search size={18} />
            Search
          </button>
          <button className="btn btn-secondary" onClick={handleUseCurrentLocation} disabled={isLocating}>
            <MapPin size={18} />
            {isLocating ? 'Detecting location...' : 'Use my current location'}
          </button>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', alignSelf: 'center' }}>
            Showing results for: <strong>{location || 'all cities'}</strong>
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><Search size={18} /> Available nearby services</h2>
          <span className="badge badge-info">{filteredServices.length} results</span>
        </div>

        {!hasExactLocationServiceMatch && location && (
          <div style={{ marginBottom: '1rem', padding: '0.9rem 1rem', borderRadius: '12px', background: '#fff7dc', border: '1px solid #f0d899', color: '#533d00', fontWeight: 600 }}>
            No exact city match found for <strong>{location}</strong>. Showing general pet services available in the demo catalog for this search.
          </div>
        )}

        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <p>No matching services found for <strong>{location || 'your selected city'}</strong>. Try another city or use current location.</p>
          </div>
        ) : (
          <div className="service-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className={`service-card ${service.tone}`}>
                <div className="service-image-wrap">
                  <img src={service.image} alt={service.name} />
                </div>

                <div className="service-card-body">
                  <div className="service-card-header">
                    <span className="service-emoji">{service.category === 'veterinary' ? '🩺' : service.category === 'grooming' ? '✂️' : '🏠'}</span>
                    <span className="service-category">{service.category}</span>
                  </div>

                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-meta">
                    <span><strong>Location:</strong> {service.city}, {service.state}</span>
                    <span><strong>Price:</strong> {service.priceRange}</span>
                    <span><strong>Availability:</strong> {service.availability}</span>
                  </div>

                  <button className="btn btn-primary service-book-btn" onClick={() => handleBook(service)}>
                    <CalendarClock size={18} />
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><MapPin size={18} /> Pet-friendly places nearby</h2>
          <span className="badge badge-success">{filteredPlaces.length} spots</span>
        </div>

        {!hasExactLocationPlaceMatch && location && (
          <div style={{ marginBottom: '1rem', padding: '0.9rem 1rem', borderRadius: '12px', background: '#eaf9ee', border: '1px solid #cfead7', color: '#215a32', fontWeight: 600 }}>
            No exact place match found for <strong>{location}</strong>. Showing general demo pet-friendly spots for this search.
          </div>
        )}

        {filteredPlaces.length === 0 ? (
          <div className="empty-state">
            <p>No nearby pet-friendly places found for this location yet.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{place.name}</h3>
                <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>{place.category}</span>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{place.description}</p>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>City:</strong> {place.city}, {place.state}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Demo listing for a pet-friendly place in your area.</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .service-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 26px;
          border: 1px solid rgba(123,155,115,0.12);
          box-shadow: 0 14px 26px rgba(58, 72, 60, 0.07);
          background: linear-gradient(135deg, rgba(255,255,255,0.94), rgba(248,243,238,0.95));
        }

        .service-card.sage {
          background: linear-gradient(135deg, rgba(228,239,220,0.9) 0%, rgba(255,255,255,0.96) 100%);
        }

        .service-card.peach {
          background: linear-gradient(135deg, rgba(247,228,221,0.82) 0%, rgba(255,255,255,0.96) 100%);
        }

        .service-card.gold {
          background: linear-gradient(135deg, rgba(248,238,217,0.9) 0%, rgba(255,255,255,0.96) 100%);
        }

        .service-image-wrap {
          height: 192px;
          overflow: hidden;
          border-bottom: 1px solid rgba(123,155,115,0.08);
          background: #f1efe9;
          border-radius: 22px 22px 0 0;
        }

        .service-image-wrap img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
          filter: saturate(0.9) contrast(1.03);
          transform: scale(1.04);
        }

        .service-card-body {
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }

        .service-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .service-emoji {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.62);
          font-size: 1.3rem;
          box-shadow: inset 0 0 0 1px rgba(123,155,115,0.1);
        }

        .service-category {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem 0.7rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(123,155,115,0.12);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .service-card-body h3 {
          margin: 0 0 0.45rem;
          font-size: 1.18rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-primary);
        }

        .service-description {
          margin: 0 0 0.8rem;
          font-size: 0.9rem;
          line-height: 1.55;
          color: var(--text-secondary);
        }

        .service-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          color: var(--text-primary);
          line-height: 1.45;
        }

        .service-meta strong {
          color: var(--text-secondary);
        }

        .service-book-btn {
          width: 100%;
          justify-content: center;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
