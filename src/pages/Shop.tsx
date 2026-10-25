import { useEffect, useMemo, useState } from 'react';
import { Clock3, MapPin, ShoppingBag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const shopCatalog = [
  {
    id: 'shop-1',
    name: 'Pawfect Basket',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Andheri West',
    timings: '9:00 AM - 9:00 PM',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200',
    description: 'Premium pet food, grooming essentials, and health supplements.',
    products: [
      { id: 'p1', name: 'Premium Dog Food', price: 2500, stock: 10, category: 'food' },
      { id: 'p2', name: 'Cat Treats', price: 450, stock: 25, category: 'food' },
      { id: 'p3', name: 'Grooming Brush', price: 800, stock: 12, category: 'grooming' },
      { id: 'p4', name: 'Pet Collar', price: 650, stock: 20, category: 'accessories' }
    ]
  },
  {
    id: 'shop-2',
    name: 'Bark & Bone',
    city: 'Delhi',
    state: 'Delhi',
    address: 'Saket',
    timings: '10:00 AM - 8:30 PM',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=1200',
    description: 'A neighborhood pet store with toys, nutrition, and wellness products.',
    products: [
      { id: 'p5', name: 'Vitamin Supplements', price: 1200, stock: 8, category: 'health' },
      { id: 'p6', name: 'Chew Toy', price: 350, stock: 15, category: 'toys' },
      { id: 'p7', name: 'Dog Shampoo', price: 620, stock: 18, category: 'grooming' },
      { id: 'p8', name: 'Pet Carrier', price: 2100, stock: 6, category: 'accessories' }
    ]
  },
  {
    id: 'shop-3',
    name: 'Happy Tails Mart',
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'Koramangala',
    timings: '8:30 AM - 9:30 PM',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200',
    description: 'Trusted pet essentials for dogs, cats, and birds across all breeds.',
    products: [
      { id: 'p9', name: 'Bird Seed Mix', price: 420, stock: 22, category: 'food' },
      { id: 'p10', name: 'Cat Litter', price: 780, stock: 14, category: 'health' },
      { id: 'p11', name: 'Paw Cleaner', price: 560, stock: 19, category: 'grooming' },
      { id: 'p12', name: 'Interactive Toy', price: 890, stock: 16, category: 'toys' }
    ]
  },
  {
    id: 'shop-4',
    name: 'Whisker & Wag',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Powai',
    timings: '9:00 AM - 10:00 PM',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    description: 'Pet food, grooming care, and accessories for active companions.',
    products: [
      { id: 'p13', name: 'Omega Oil', price: 1500, stock: 9, category: 'health' },
      { id: 'p14', name: 'Bamboo Grooming Kit', price: 990, stock: 11, category: 'grooming' },
      { id: 'p15', name: 'Dog Harness', price: 1400, stock: 10, category: 'accessories' },
      { id: 'p16', name: 'Cat Scratcher', price: 1200, stock: 7, category: 'toys' }
    ]
  },
  {
    id: 'shop-5',
    name: 'Guntur Pet Market',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Lakshmipuram',
    timings: '9:00 AM - 9:00 PM',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200',
    description: 'Essential food, grooming, and wellness products for local pet families.',
    products: [
      { id: 'p17', name: 'Local Dog Food Pack', price: 1550, stock: 11, category: 'food' },
      { id: 'p18', name: 'Pet Shampoo', price: 680, stock: 20, category: 'grooming' },
      { id: 'p19', name: 'Chew Bone', price: 420, stock: 18, category: 'toys' },
      { id: 'p20', name: 'Pet Harness', price: 1150, stock: 8, category: 'accessories' }
    ]
  },
  {
    id: 'shop-6',
    name: 'Paw & Tail Guntur',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Brodipet',
    timings: '8:30 AM - 9:00 PM',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=1200',
    description: 'A trusted local pet shop for daily essentials, accessories, and grooming products.',
    products: [
      { id: 'p21', name: 'Puppy Growth Mix', price: 1700, stock: 12, category: 'food' },
      { id: 'p22', name: 'Flea Treatment', price: 980, stock: 10, category: 'health' },
      { id: 'p23', name: 'Grooming Gloves', price: 540, stock: 15, category: 'grooming' },
      { id: 'p24', name: 'Travel Carrier', price: 2400, stock: 7, category: 'accessories' }
    ]
  },
  {
    id: 'shop-7',
    name: 'Pet Zone Guntur',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Arundelpet',
    timings: '10:00 AM - 10:00 PM',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=1200',
    description: 'A well-stocked neighborhood shop with nutrition, hygiene, and pet care products.',
    products: [
      { id: 'p25', name: 'Complete Pet Diet', price: 1850, stock: 13, category: 'food' },
      { id: 'p26', name: 'Calcium Supplements', price: 1250, stock: 9, category: 'health' },
      { id: 'p27', name: 'Pet Bath Kit', price: 760, stock: 16, category: 'grooming' },
      { id: 'p28', name: 'Rope Toy Set', price: 520, stock: 22, category: 'toys' }
    ]
  },
  {
    id: 'shop-8',
    name: 'Vijayawada Pet Supply Hub',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    address: 'Benz Circle',
    timings: '8:30 AM - 9:30 PM',
    rating: 4.7,
    description: 'Neighborhood pet supply store for everyday needs and wellness products.',
    products: [
      { id: 'p29', name: 'Premium Puppy Mix', price: 1700, stock: 12, category: 'food' },
      { id: 'p30', name: 'Flea Treatment', price: 980, stock: 10, category: 'health' },
      { id: 'p31', name: 'Grooming Gloves', price: 540, stock: 15, category: 'grooming' },
      { id: 'p32', name: 'Travel Carrier', price: 2400, stock: 7, category: 'accessories' }
    ]
  },
  {
    id: 'shop-9',
    name: 'Paw Haven Vizag',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    address: 'MVP Colony',
    timings: '9:00 AM - 9:00 PM',
    rating: 4.8,
    description: 'A full-service pet store with food, wellness, toys, and everyday care essentials.',
    products: [
      { id: 'p33', name: 'Fish Protein Mix', price: 1650, stock: 13, category: 'food' },
      { id: 'p34', name: 'Pet Wellness Drops', price: 1100, stock: 9, category: 'health' },
      { id: 'p35', name: 'Paw Bath Kit', price: 760, stock: 16, category: 'grooming' },
      { id: 'p36', name: 'Pet Rope Toy', price: 520, stock: 22, category: 'toys' }
    ]
  }
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
    normalizedQuery.split(' ').some((token) => token.length > 2 && normalizedCity.includes(token)) ||
    normalizedState.split(' ').some((token) => token.length > 2 && normalizedQuery.includes(token))
  );
};

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

const getSameStateLocations = (query: string) => {
  const normalizedQuery = normalizeLocationText(query);
  if (!normalizedQuery) return [] as string[];

  const matchingState = Object.entries(stateCityMap).find(([stateName, cities]) => {
    const stateText = normalizeLocationText(stateName);
    return stateText.includes(normalizedQuery) || cities.some(city => normalizeLocationText(city).includes(normalizedQuery));
  });

  return matchingState ? matchingState[1] : [];
};

export default function Shop() {
  const { currentPet, data, addToCart, setLocation: updateAppLocation } = useApp();
  const savedLocation = data.settings.location || currentPet?.location || data.pets[0]?.location || '';
  const [location, setLocation] = useState(savedLocation);

  useEffect(() => {
    setLocation(savedLocation);
  }, [savedLocation]);

  const filteredShops = useMemo(() => {
    const query = location.trim();
    const normalizedQuery = normalizeLocationText(query);

    if (!query) {
      return shopCatalog.slice(0, 3);
    }

    const cityMatches = shopCatalog.filter((shop) => {
      const normalizedCity = normalizeLocationText(shop.city);
      return normalizedCity === normalizedQuery || normalizedCity.includes(normalizedQuery) || normalizedQuery.includes(normalizedCity);
    });

    if (cityMatches.length > 0) {
      return cityMatches.slice(0, 3);
    }

    const stateMatches = getSameStateLocations(query);
    if (stateMatches.length > 0) {
      const sameStateResults = shopCatalog.filter((shop) =>
        stateMatches.some((city) => normalizeLocationText(shop.city) === normalizeLocationText(city))
      );
      if (sameStateResults.length > 0) {
        return sameStateResults.slice(0, 3);
      }
    }

    const broadMatches = shopCatalog.filter((shop) => locationMatches(shop.city, shop.state, query));
    return broadMatches.slice(0, 3);
  }, [location]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pet Shops</h1>
        <p>Find nearby pet stores with product availability and shop timings.</p>
      </div>

      <div className="card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Location</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

      <div className="grid grid-2">
        {filteredShops.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state">
              <p>No nearby pet shops found for <strong>{location}</strong>. Try another city.</p>
            </div>
          </div>
        ) : (
          filteredShops.map((shop) => (
            <div key={shop.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img src={shop.image || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200'} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.05), rgba(15,23,42,0.55))' }} />
                <div style={{ position: 'absolute', left: '1rem', right: '1rem', bottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>{shop.name}</h3>
                  <span className="badge badge-success" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderColor: 'rgba(255,255,255,0.25)' }}>★ {shop.rating}</span>
                </div>
              </div>

              <div style={{ padding: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: '0.75rem' }}>{shop.description}</p>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}><strong>Location:</strong> {shop.city}, {shop.state}, {shop.address}</p>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}><strong>Open:</strong> {shop.timings}</p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShoppingBag size={18} color="#55745a" />
                  <strong>Available pet products</strong>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {shop.products.map((product) => (
                    <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem 0.85rem', background: 'rgba(255,255,255,0.35)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={
                            product.category === 'food'
                              ? 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300'
                              : product.category === 'grooming'
                              ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'
                              : product.category === 'health'
                              ? 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300'
                              : 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300'
                          }
                          alt={product.name}
                          style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', marginBottom: '0.2rem' }}>{product.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{product.category} • {product.stock} in stock</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: '700' }}>₹{product.price}</span>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 0.8rem' }} onClick={() => addToCart(product.id)}>
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Clock3 size={16} />
                Timing: {shop.timings}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
