import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Trash2 } from 'lucide-react';

export default function LostFound() {
  const { data, addLostFoundReport, deleteLostFoundReport } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: 'lost', petName: '', species: '', lastSeenLocation: '', date: new Date().toISOString().split('T')[0], contactMethod: '', additionalNotes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLostFoundReport(formData);
    alert('Report submitted! (Demo only)');
    setShowModal(false);
    setFormData({ type: 'lost', petName: '', species: '', lastSeenLocation: '', date: new Date().toISOString().split('T')[0], contactMethod: '', additionalNotes: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this report?')) deleteLostFoundReport(id);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Lost and Found</h1>
            <p>Report lost or found pets</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Create Report
          </button>
        </div>
      </div>

      {data.lostFoundReports.length === 0 ? (
        <div className="card empty-state">
          <p>No reports yet</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {data.lostFoundReports.map(report => (
            <div key={report.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className={'badge ' + (report.type === 'lost' ? 'badge-danger' : 'badge-success')}>{report.type.toUpperCase()}</span>
                <button className="btn btn-danger" style={{ padding: '0.375rem' }} onClick={() => handleDelete(report.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{report.petName || 'Unknown'}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Species: {report.species}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Location: {report.lastSeenLocation}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Date: {report.date}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Contact: {report.contactMethod}</p>
              {report.additionalNotes && <p style={{ fontSize: '0.875rem' }}>{report.additionalNotes}</p>}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Demo report</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Report</h2>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Report Type *</label>
                  <select className="form-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pet Name</label>
                  <input type="text" className="form-input" value={formData.petName} onChange={(e) => setFormData({...formData, petName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Species *</label>
                  <input type="text" className="form-input" placeholder="Dog, Cat, etc." value={formData.species} onChange={(e) => setFormData({...formData, species: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" className="form-input" value={formData.lastSeenLocation} onChange={(e) => setFormData({...formData, lastSeenLocation: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Method *</label>
                  <input type="text" className="form-input" placeholder="Phone/Email" value={formData.contactMethod} onChange={(e) => setFormData({...formData, contactMethod: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea className="form-textarea" value={formData.additionalNotes} onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}></textarea>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Demo report - not publicly distributed</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
