import { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function PetFriendlyPlaces() {
  const { currentPet, data, setLocation: updateAppLocation } = useApp();
  const savedLocation = data.settings.location || currentPet?.location || data.pets[0]?.location || '';
  const [location, setLocation] = useState(savedLocation);

  const places = [
    { id: 'pl1', name: 'Central Park Bark Trail', category: 'park', city: 'Mumbai', state: 'Maharashtra', description: 'Shady walking paths and open dog play zones', openingTime: '6:00 AM', closingTime: '9:30 PM', tone: 'sage', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl2', name: 'Paws & Whiskers Cafe', category: 'cafe', city: 'Delhi', state: 'Delhi', description: 'Pet-friendly seating with fresh treats for furry guests', openingTime: '9:00 AM', closingTime: '10:00 PM', tone: 'peach', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl3', name: 'Greenfield Dog Trail', category: 'park', city: 'Bangalore', state: 'Karnataka', description: 'A calm nature trail with shaded walking loops', openingTime: '5:30 AM', closingTime: '8:30 PM', tone: 'sage', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl4', name: 'Cozy Corner Cafe', category: 'cafe', city: 'Mumbai', state: 'Maharashtra', description: 'Cute indoor corners and pet-welcoming menus', openingTime: '8:30 AM', closingTime: '9:30 PM', tone: 'gold', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl5', name: 'Sunset Paw Lounge', category: 'cafe', city: 'Delhi', state: 'Delhi', description: 'Relaxed outdoor seating for pets and owners', openingTime: '10:00 AM', closingTime: '11:00 PM', tone: 'peach', image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl6', name: 'Guntur Bark Garden', category: 'park', city: 'Guntur', state: 'Andhra Pradesh', description: 'Open dog walk lanes, shade cover, and rest spots', openingTime: '6:00 AM', closingTime: '8:00 PM', tone: 'sage', image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl7', name: 'Paw & Bean Lounge', category: 'cafe', city: 'Guntur', state: 'Andhra Pradesh', description: 'Cafe with pet-friendly patios and puppy treats', openingTime: '9:00 AM', closingTime: '9:00 PM', tone: 'gold', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl8', name: 'Vijayawada Walk Trail', category: 'park', city: 'Vijayawada', state: 'Andhra Pradesh', description: 'Wide open promenade designed for happy walks', openingTime: '5:30 AM', closingTime: '8:30 PM', tone: 'sage', image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl9', name: 'Happy Tails Terrace', category: 'cafe', city: 'Vizag', state: 'Andhra Pradesh', description: 'Terrace seating with calm vibes and pet treats', openingTime: '9:00 AM', closingTime: '9:30 PM', tone: 'peach', image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80' },
    { id: 'pl10', name: 'Canine Courtyard Gardens', category: 'park', city: 'Hyderabad', state: 'Telangana', description: 'Scenic garden walks and easy pet-friendly paths', openingTime: '6:30 AM', closingTime: '9:00 PM', tone: 'sage', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80' }
  ];

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

    return (
      normalizedCity.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedCity) ||
      normalizedState.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedState) ||
      normalizedCity.split(' ').some((token) => token.length > 2 && normalizedQuery.includes(token)) ||
      normalizedQuery.split(' ').some((token) => token.length > 2 && normalizedCity.includes(token))
    );
  };

  const stateCityMap: Record<string, string[]> = {
    'andhra pradesh': ['guntur', 'vijayawada', 'visakhapatnam', 'rajahmundry'],
    'maharashtra': ['mumbai', 'pune'],
    'karnataka': ['bangalore'],
    'telangana': ['hyderabad'],
    'tamil nadu': ['chennai'],
    'delhi': ['delhi']
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

  useEffect(() => {
    setLocation(savedLocation);
  }, [savedLocation]);

  const filteredPlaces = useMemo(() => {
    const query = location.trim();
    const matches = places.filter((place) => {
      const cityMatch = locationMatches(place.city, place.state, query);
      return cityMatch;
    });

    if (query && matches.length === 0) {
      const sameStateCities = getSameStateLocations(query);
      const fallback = places.filter((place) => {
        if (sameStateCities.length > 0) {
          return sameStateCities.some((city) => normalizeLocationText(place.city).includes(city) || normalizeLocationText(city).includes(normalizeLocationText(place.city)));
        }
        return true;
      });
      return fallback.length > 0 ? fallback : places;
    }

    return matches;
  }, [location]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pet-Friendly Places</h1>
        <p>Discover pet-friendly parks, cafes, and destinations near your location.</p>
      </div>

      <div className="card location-search-card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Location</label>
          <div className="location-search-row">
            <MapPin size={18} color="#55745a" />
            <input
              className="form-input"
              value={location}
              onChange={(e) => {
                const nextValue = e.target.value;
                setLocation(nextValue);
                updateAppLocation(nextValue);
              }}
              placeholder="Mumbai, Delhi, Bangalore"
            />
          </div>
        </div>
      </div>

      <div className="places-grid">
        {filteredPlaces.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state">
              <p>No pet-friendly places found for <strong>{location}</strong>. Try another city.</p>
            </div>
          </div>
        ) : (
          filteredPlaces.map((place) => (
            <div key={place.id} className={`place-card ${place.tone}`}>
              <div className="place-image-wrap">
                <img src={place.image} alt={place.name} />
              </div>

              <div className="place-card-top">
                <span className="place-emoji">{place.category === 'park' ? '🐾' : '🐶'}</span>
                <span className="place-category">{place.category}</span>
              </div>

              <div className="place-card-body">
                <h3>{place.name}</h3>
                <p className="place-description">{place.description}</p>

                <div className="place-meta">
                  <span><strong>City:</strong> {place.city}</span>
                  <span><strong>Hours:</strong> {place.openingTime} - {place.closingTime}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .location-search-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(242,246,238,0.96));
          border: 1px solid rgba(123,155,115,0.12);
          box-shadow: 0 18px 28px rgba(62, 74, 65, 0.05);
        }

        .location-search-row {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.8rem 0.9rem;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(123,155,115,0.1);
          border-radius: 14px;
        }

        .location-search-row .form-input {
          width: 100%;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 1rem;
          outline: none;
        }

        .places-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
          margin-top: 1.5rem;
        }

        .place-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 290px;
          border-radius: 26px;
          padding: 0;
          border: 1px solid rgba(123,155,115,0.12);
          box-shadow: 0 14px 26px rgba(58, 72, 60, 0.07);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .place-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 30px rgba(58, 72, 60, 0.1);
        }

        .place-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.0));
          pointer-events: none;
        }

        .place-card.sage {
          background: linear-gradient(135deg, rgba(224, 239, 218, 0.9) 0%, rgba(246, 249, 242, 0.98) 100%);
        }

        .place-card.peach {
          background: linear-gradient(135deg, rgba(247, 228, 221, 0.82) 0%, rgba(255, 252, 249, 0.98) 100%);
        }

        .place-card.gold {
          background: linear-gradient(135deg, rgba(248, 238, 217, 0.9) 0%, rgba(255, 252, 248, 1) 100%);
        }

        .place-image-wrap {
          position: relative;
          height: 142px;
          overflow: hidden;
          border-bottom: 1px solid rgba(123,155,115,0.08);
        }

        .place-image-wrap img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          filter: saturate(0.9) contrast(1.03);
        }

        .place-card-top {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 1rem 1rem 0.7rem;
        }

        .place-emoji {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(255,255,255,0.62);
          font-size: 1.6rem;
          box-shadow: inset 0 0 0 1px rgba(123,155,115,0.1);
        }

        .place-category {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem 0.7rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(123,155,115,0.12);
          color: var(--text-primary);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .place-card-body {
          position: relative;
          z-index: 1;
          margin-top: auto;
          padding: 0 1rem 1rem;
        }

        .place-card-body h3 {
          margin: 0 0 0.5rem;
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-primary);
        }

        .place-description {
          margin: 0 0 0.8rem;
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.55;
        }

        .place-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          color: var(--text-primary);
          font-size: 0.8rem;
          line-height: 1.45;
        }

        .place-meta strong {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
