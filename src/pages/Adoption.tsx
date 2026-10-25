import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Heart, MapPin, Plus } from 'lucide-react';

const initialAdoptionPets = [
  { id: 'a1', name: 'Buddy', species: 'dog', breed: 'Labrador Mix', age: '2 years', gender: 'male', location: 'Mumbai, India', image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400', description: 'Friendly and energetic dog looking for a loving home' },
  { id: 'a2', name: 'Whiskers', species: 'cat', breed: 'Domestic Shorthair', age: '1 year', gender: 'female', location: 'Delhi, India', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', description: 'Sweet cat, good with kids' },
  { id: 'a3', name: 'Max', species: 'dog', breed: 'Beagle', age: '3 years', gender: 'male', location: 'Bangalore, India', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', description: 'Loyal companion, house trained' },
];

export default function Adoption() {
  const { data, toggleFavorite, addAdoptionInterest } = useApp();
  const [adoptionPets, setAdoptionPets] = React.useState(initialAdoptionPets);
  const [search, setSearch] = React.useState('');
  const [speciesFilter, setSpeciesFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [showListingModal, setShowListingModal] = React.useState(false);
  const [selectedPet, setSelectedPet] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({ name: '', email: '', phone: '', livingSituation: '', message: '' });
  const [listingForm, setListingForm] = React.useState({
    petName: '',
    species: 'dog',
    breed: '',
    age: '',
    gender: 'male',
    location: '',
    aboutPet: '',
    problem: '',
    ownerName: '',
    ownerPhone: '',
  });

  const filtered = adoptionPets.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || p.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const handleInterest = (pet: any) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAdoptionInterest({ ...formData, adoptionPetId: selectedPet.id });
    alert('Adoption interest submitted! (Demo - not sent to a real shelter)');
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', livingSituation: '', message: '' });
  };

  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPet = {
      id: `a${Date.now()}`,
      name: listingForm.petName.trim(),
      species: listingForm.species,
      breed: listingForm.breed.trim() || 'Mixed Breed',
      age: listingForm.age.trim() || 'Unknown age',
      gender: listingForm.gender,
      location: listingForm.location.trim() || 'India',
      image: listingForm.species === 'cat'
        ? 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=400'
        : 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
      description: listingForm.aboutPet.trim(),
      problem: listingForm.problem.trim(),
    };

    setAdoptionPets(prev => [newPet, ...prev]);
    setShowListingModal(false);
    setListingForm({
      petName: '',
      species: 'dog',
      breed: '',
      age: '',
      gender: 'male',
      location: '',
      aboutPet: '',
      problem: '',
      ownerName: '',
      ownerPhone: '',
    });

    alert('Your pet adoption listing has been added successfully.');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Adoption</h1>
        <p>Find your perfect pet companion</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" className="form-input" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: '200px' }} />
          <select className="form-select" value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="all">All Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
          <button type="button" className="btn btn-primary" onClick={() => setShowListingModal(true)}>
            <Plus size={18} />
            List My Pet
          </button>
        </div>
      </div>

      <div className="grid grid-3">
        {filtered.map(pet => (
          <div key={pet.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={pet.image} alt={pet.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <button 
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                onClick={() => toggleFavorite('adoption', pet.id)}
              >
                <Heart size={20} fill={data.favorites.adoption.includes(pet.id) ? '#d97757' : 'none'} color={data.favorites.adoption.includes(pet.id) ? '#d97757' : '#2d3a2e'} />
              </button>
            </div>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{pet.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{pet.breed} • {pet.age} • {pet.gender}</p>
              <p style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                <MapPin size={14} /> {pet.location}
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{pet.description}</p>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleInterest(pet)}>
                I'm Interested
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>Demo listing</p>
            </div>
          </div>
        ))}
      </div>

      {showListingModal && (
        <div className="modal-overlay" onClick={() => setShowListingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>List your pet for adoption</h2>
              <button type="button" className="btn btn-secondary" onClick={() => setShowListingModal(false)}>✕</button>
            </div>
            <form onSubmit={handleListingSubmit}>
              <div className="modal-body">
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Pet Name *</label>
                    <input type="text" className="form-input" value={listingForm.petName} onChange={(e) => setListingForm({ ...listingForm, petName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Species *</label>
                    <select className="form-select" value={listingForm.species} onChange={(e) => setListingForm({ ...listingForm, species: e.target.value })} required>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="rabbit">Rabbit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Breed *</label>
                    <input type="text" className="form-input" value={listingForm.breed} onChange={(e) => setListingForm({ ...listingForm, breed: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input type="text" className="form-input" value={listingForm.age} onChange={(e) => setListingForm({ ...listingForm, age: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select className="form-select" value={listingForm.gender} onChange={(e) => setListingForm({ ...listingForm, gender: e.target.value })} required>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="unknown">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location *</label>
                    <input type="text" className="form-input" value={listingForm.location} onChange={(e) => setListingForm({ ...listingForm, location: e.target.value })} placeholder="e.g. Vijayawada, Andhra Pradesh" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">About your pet *</label>
                  <textarea className="form-textarea" placeholder="Tell people about your pet's personality, habits, likes, health, and temperament..." value={listingForm.aboutPet} onChange={(e) => setListingForm({ ...listingForm, aboutPet: e.target.value })} required></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">What problem are you facing? *</label>
                  <textarea className="form-textarea" placeholder="Why are you looking for adoption? e.g. moving abroad, allergies, family changes, can't provide care..." value={listingForm.problem} onChange={(e) => setListingForm({ ...listingForm, problem: e.target.value })} required></textarea>
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Owner Name *</label>
                    <input type="text" className="form-input" value={listingForm.ownerName} onChange={(e) => setListingForm({ ...listingForm, ownerName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Owner Phone *</label>
                    <input type="tel" className="form-input" value={listingForm.ownerPhone} onChange={(e) => setListingForm({ ...listingForm, ownerPhone: e.target.value })} required />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowListingModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adoption Interest - {selectedPet?.name}</h2>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Living Situation *</label>
                  <input type="text" className="form-input" placeholder="e.g., Apartment, House with yard" value={formData.livingSituation} onChange={(e) => setFormData({...formData, livingSituation: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-textarea" placeholder="Tell us why you'd like to adopt..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required></textarea>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Demo form - submission not sent to real shelter</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Interest</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
