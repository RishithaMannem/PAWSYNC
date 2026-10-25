import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Edit, Trash2, Dog } from 'lucide-react';

const petEmojiOptions = {
  dog: ['🐕', '🐶', '🐩', '🦮', '🐕‍🦺', '🐾'],
  cat: ['🐱', '🐈', '🐈‍⬛', '😺', '🐯', '😸'],
  bird: ['🐦', '🦜', '🐤', '🐣', '🕊️', '🐧'],
  rabbit: ['🐰', '🐇', '🐾', '🐹', '🥕', '🦫'],
  other: ['🐾', '🦴', '🦄', '🐼', '🐥', '🐍']
};

export default function MyPets() {
  const { data, addPet, updatePet, deletePet, setCurrentPetId } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', species: 'dog', breed: '', location: '', birthDate: '', age: '', sex: 'male',
    weight: '', activityLevel: 'medium', dietaryPreferences: '', allergies: '',
    medicalConditions: '', specialCareInstructions: '', vetName: '', vetPhone: '', notes: '', emoji: '🐕'
  });

  const openAddModal = () => {
    setEditingPet(null);
    setFormData({
      name: '', species: 'dog', breed: '', location: '', birthDate: '', age: '', sex: 'male',
      weight: '', activityLevel: 'medium', dietaryPreferences: '', allergies: '',
      medicalConditions: '', specialCareInstructions: '', vetName: '', vetPhone: '', notes: '', emoji: '🐕'
    });
    setShowModal(true);
  };

  const openEditModal = (pet: any) => {
    setEditingPet(pet);
    setFormData({
      ...pet,
      emoji: pet.emoji || petEmojiOptions[pet.species as keyof typeof petEmojiOptions]?.[0] || '🐾'
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed) {
      alert('Please fill in name and breed');
      return;
    }
    if (editingPet) {
      updatePet(editingPet.id, formData);
    } else {
      addPet(formData);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this pet profile?')) {
      deletePet(id);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>My Pets</h1>
            <p>Manage your pet profiles</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={20} />
            Add New Pet
          </button>
        </div>
      </div>

      {data.pets.length === 0 ? (
        <div className="card empty-state">
          <Dog size={48} />
          <h3>No pets added yet</h3>
          <p>Create your first pet profile to get started with PAWSYNC</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={openAddModal}>
            <Plus size={20} />
            Add Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {data.pets.map(pet => (
            <div key={pet.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setCurrentPetId(pet.id)}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                  {pet.emoji || (pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : pet.species === 'bird' ? '🦜' : pet.species === 'rabbit' ? '🐰' : '🐾')}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{pet.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{pet.breed} • {pet.age || 'Age unknown'} • {pet.sex}</p>
                  {data.currentPetId === pet.id && <span className="badge badge-success">Current Pet</span>}
                </div>
              </div>
              {pet.weight && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>⚖️ Weight: {pet.weight} kg</p>}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); openEditModal(pet); }}>
                  <Edit size={18} />
                  Edit
                </button>
                <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); handleDelete(pet.id); }}>
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPet ? 'Edit Pet' : 'Add New Pet'}</h2>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Pet Name *</label>
                    <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Species *</label>
                    <select className="form-select" value={formData.species} onChange={(e) => {
                      const nextSpecies = e.target.value;
                      const nextEmoji = petEmojiOptions[nextSpecies as keyof typeof petEmojiOptions]?.[0] || '🐾';
                      setFormData({ ...formData, species: nextSpecies, emoji: nextEmoji });
                    }}>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pet Emoji</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(petEmojiOptions[formData.species as keyof typeof petEmojiOptions] || petEmojiOptions.other).map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, emoji })}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          border: formData.emoji === emoji ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                          background: formData.emoji === emoji ? 'rgba(124, 58, 237, 0.08)' : 'var(--bg-secondary)',
                          fontSize: '1.5rem',
                          cursor: 'pointer'
                        }}
                        aria-label={`Choose pet emoji ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Breed *</label>
                    <input type="text" className="form-input" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sex</label>
                    <select className="form-select" value={formData.sex} onChange={(e) => setFormData({...formData, sex: e.target.value})}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="text" className="form-input" placeholder="e.g., 3 years" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input type="text" className="form-input" placeholder="e.g., 15" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-input" placeholder="Mumbai, Delhi, Bangalore" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Birth Date</label>
                  <input type="date" className="form-input" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dietary Preferences</label>
                  <input type="text" className="form-input" value={formData.dietaryPreferences} onChange={(e) => setFormData({...formData, dietaryPreferences: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Allergies</label>
                  <input type="text" className="form-input" value={formData.allergies} onChange={(e) => setFormData({...formData, allergies: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Veterinarian Name</label>
                  <input type="text" className="form-input" value={formData.vetName} onChange={(e) => setFormData({...formData, vetName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Veterinarian Phone</label>
                  <input type="tel" className="form-input" value={formData.vetPhone} onChange={(e) => setFormData({...formData, vetPhone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingPet ? 'Update' : 'Add'} Pet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
