import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Syringe, Calendar } from 'lucide-react';

export default function Health() {
  const { data, currentPet, addVaccination, addAppointment } = useApp();
  const [showVaccModal, setShowVaccModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [vaccForm, setVaccForm] = useState({ vaccineName: '', administrationDate: '', nextDueDate: '', notes: '' });
  const [appForm, setAppForm] = useState({ serviceName: '', date: '', time: '', notes: '' });

  if (!currentPet) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Health and Vaccinations</h1>
          <p>Track your pet's health records</p>
        </div>
        <div className="card empty-state">
          <p>Please select a pet from My Pets page</p>
        </div>
      </div>
    );
  }

  const petVaccinations = data.vaccinations.filter(v => v.petId === currentPet.id);
  const petAppointments = data.appointments.filter(a => a.petId === currentPet.id);

  const handleVaccSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVaccination({ ...vaccForm, petId: currentPet.id, status: vaccForm.nextDueDate ? 'upcoming' : 'completed' });
    setShowVaccModal(false);
    setVaccForm({ vaccineName: '', administrationDate: '', nextDueDate: '', notes: '' });
  };

  const handleAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({ ...appForm, petId: currentPet.id, status: 'upcoming' });
    setShowAppModal(false);
    setAppForm({ serviceName: '', date: '', time: '', notes: '' });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Health and Vaccinations</h1>
        <p>Health records for {currentPet.name}</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><Syringe size={22} /> Vaccinations</h2>
            <button className="btn btn-primary" onClick={() => setShowVaccModal(true)}>
              <Plus size={18} />
              Add
            </button>
          </div>
          {petVaccinations.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No vaccination records</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {petVaccinations.map(v => (
                <div key={v.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong>{v.vaccineName}</strong>
                    <span className={'badge ' + (v.status === 'completed' ? 'badge-success' : 'badge-warning')}>{v.status}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Given: {v.administrationDate}
                    {v.nextDueDate && ' • Due: ' + v.nextDueDate}
                  </div>
                  {v.notes && <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{v.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><Calendar size={22} /> Appointments</h2>
            <button className="btn btn-primary" onClick={() => setShowAppModal(true)}>
              <Plus size={18} />
              Add
            </button>
          </div>
          {petAppointments.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No appointments</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {petAppointments.map(a => (
                <div key={a.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong>{a.serviceName}</strong>
                    <span className="badge badge-info">{a.status}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {a.date} {a.time && 'at ' + a.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showVaccModal && (
        <div className="modal-overlay" onClick={() => setShowVaccModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Vaccination</h2>
              <button className="btn btn-secondary" onClick={() => setShowVaccModal(false)}>✕</button>
            </div>
            <form onSubmit={handleVaccSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Vaccine Name *</label>
                  <input type="text" className="form-input" value={vaccForm.vaccineName} onChange={(e) => setVaccForm({...vaccForm, vaccineName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Administration Date *</label>
                  <input type="date" className="form-input" value={vaccForm.administrationDate} onChange={(e) => setVaccForm({...vaccForm, administrationDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Next Due Date</label>
                  <input type="date" className="form-input" value={vaccForm.nextDueDate} onChange={(e) => setVaccForm({...vaccForm, nextDueDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" value={vaccForm.notes} onChange={(e) => setVaccForm({...vaccForm, notes: e.target.value})}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowVaccModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAppModal && (
        <div className="modal-overlay" onClick={() => setShowAppModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Appointment</h2>
              <button className="btn btn-secondary" onClick={() => setShowAppModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAppSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Service/Reason *</label>
                  <input type="text" className="form-input" value={appForm.serviceName} onChange={(e) => setAppForm({...appForm, serviceName: e.target.value})} required />
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input type="date" className="form-input" value={appForm.date} onChange={(e) => setAppForm({...appForm, date: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input type="time" className="form-input" value={appForm.time} onChange={(e) => setAppForm({...appForm, time: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" value={appForm.notes} onChange={(e) => setAppForm({...appForm, notes: e.target.value})}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAppModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
