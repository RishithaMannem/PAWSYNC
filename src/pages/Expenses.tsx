import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Trash2, DollarSign, UploadCloud, FileText, ScanLine } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Expenses() {
  const { data, currentPet, addExpense, deleteExpense, addDigitalRecord, deleteDigitalRecord, addDocumentFolder } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [formData, setFormData] = useState({ category: 'food', amount: '', date: new Date().toISOString().split('T')[0], description: '', petId: currentPet?.id || '' });
  const [recordForm, setRecordForm] = useState({
    title: '',
    category: 'prescription',
    folderId: data.documentFolders[0]?.id || 'general',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    file: null as File | null
  });
  const [newFolderName, setNewFolderName] = useState('');
  const customFolders = data.documentFolders.length ? data.documentFolders : [{ id: 'general', name: 'General' }];

  const petExpenses = currentPet ? data.expenses.filter(e => e.petId === currentPet.id) : data.expenses;
  const total = petExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = petExpenses.reduce((acc: any, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({ ...formData, amount: parseFloat(formData.amount), petId: currentPet?.id || formData.petId });
    setShowModal(false);
    setFormData({ category: 'food', amount: '', date: new Date().toISOString().split('T')[0], description: '', petId: currentPet?.id || '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this expense?')) deleteExpense(id);
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordForm.title.trim()) return;

    const file = recordForm.file;
    const newRecord = {
      id: `${Date.now()}`,
      petId: currentPet?.id || 'guest',
      folderId: recordForm.folderId,
      title: recordForm.title.trim(),
      category: recordForm.category,
      date: recordForm.date,
      notes: recordForm.notes.trim(),
      fileName: file?.name || 'uploaded-document',
      fileType: file?.type || 'application/octet-stream'
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const recordWithFile = { ...newRecord, dataUrl: typeof reader.result === 'string' ? reader.result : undefined };
        addDigitalRecord(recordWithFile);
      };
      reader.readAsDataURL(file);
    } else {
      addDigitalRecord(newRecord);
    }

    setRecordForm({ title: '', category: 'prescription', folderId: customFolders[0]?.id || 'general', date: new Date().toISOString().split('T')[0], notes: '', file: null });
    setShowRecordModal(false);
  };

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    const normalized = trimmed.toLowerCase().replace(/\s+/g, '-');
    if (customFolders.some(folder => folder.id === normalized)) {
      setNewFolderName('');
      return;
    }

    const newFolder = { id: normalized, name: trimmed };
    addDocumentFolder(newFolder);
    setRecordForm(prev => ({ ...prev, folderId: normalized }));
    setNewFolderName('');
  };

  const handleRemoveRecord = (id: string) => {
    deleteDigitalRecord(id);
  };

  const recordsForPet = data.digitalRecords.filter(record => record.petId === (currentPet?.id || 'guest'));
  const folderGroups = customFolders.map(folder => ({
    ...folder,
    records: recordsForPet.filter(record => record.folderId === folder.id)
  }));

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Expenses</h1>
            <p>Track pet-related expenses {currentPet && 'for ' + currentPet.name}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>Total Expenses</h2>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--brand-primary)' }}>Rs {total}</div>
          <p style={{ color: 'var(--text-secondary)' }}>{petExpenses.length} entries</p>
        </div>
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>Category Breakdown</h2>
          {chartData.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No expenses yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--brand-primary)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <h2 className="card-title" style={{ margin: 0 }}>Digital Pet Records</h2>
          <button className="btn btn-primary" onClick={() => setShowRecordModal(true)}>
            <UploadCloud size={18} />
            Upload Record
          </button>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {customFolders.map(folder => (
            <span key={folder.id} style={{ padding: '0.4rem 0.7rem', borderRadius: '999px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.78rem', border: '1px solid rgba(148,163,184,0.2)' }}>
              {folder.name} ({recordsForPet.filter(record => record.folderId === folder.id).length})
            </span>
          ))}
        </div>

        {recordsForPet.length === 0 ? (
          <div className="empty-state" style={{ marginTop: '1rem' }}>
            <FileText size={48} />
            <h3>No digital records yet</h3>
            <p>Upload vaccination cards, prescriptions, lab reports, or scans.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            {folderGroups.filter(folder => folder.records.length > 0).map(folder => (
              <div key={folder.id}>
                <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', color: 'var(--text-primary)' }}>{folder.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {folder.records.map(record => (
                    <div key={record.id} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.2)' }}>
                      {record.dataUrl && record.fileType.startsWith('image/') ? (
                        <img src={record.dataUrl} alt={record.title} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(167,139,250,0.18))' }}>
                          <ScanLine size={40} color="var(--brand-primary)" />
                        </div>
                      )}

                      <div style={{ padding: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1rem' }}>{record.title}</h3>
                          <button className="btn btn-danger" style={{ padding: '0.35rem 0.5rem' }} onClick={() => handleRemoveRecord(record.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{record.category} • {record.date}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{record.notes || 'No notes added'}</p>
                        <div style={{ marginTop: '0.7rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{record.fileName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>Expense History</h2>
        {petExpenses.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={48} />
            <h3>No expenses recorded</h3>
            <p>Add your first expense to track spending</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {petExpenses.sort((a,b) => b.date.localeCompare(a.date)).map(exp => (
              <div key={exp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{exp.description}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{exp.category} • {exp.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--brand-primary)' }}>Rs {exp.amount}</span>
                  <button className="btn btn-danger" style={{ padding: '0.375rem' }} onClick={() => handleDelete(exp.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Expense</h2>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="food">Food</option>
                    <option value="veterinary">Veterinary</option>
                    <option value="grooming">Grooming</option>
                    <option value="medication">Medication</option>
                    <option value="toys">Toys</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Amount (Rs) *</label>
                    <input type="number" className="form-input" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input type="date" className="form-input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <input type="text" className="form-input" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRecordModal && (
        <div className="modal-overlay" onClick={() => setShowRecordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Digital Record</h2>
              <button className="btn btn-secondary" onClick={() => setShowRecordModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRecordSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Record title *</label>
                  <input type="text" className="form-input" value={recordForm.title} onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })} placeholder="Vaccination card, prescription, scan, etc." required />
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={recordForm.category} onChange={(e) => setRecordForm({ ...recordForm, category: e.target.value })}>
                      <option value="vaccination">Vaccination</option>
                      <option value="prescription">Prescription</option>
                      <option value="lab">Lab report</option>
                      <option value="scan">Scan / X-ray</option>
                      <option value="invoice">Invoice</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Folder</label>
                  <select className="form-select" value={recordForm.folderId} onChange={(e) => setRecordForm({ ...recordForm, folderId: e.target.value })}>
                    {customFolders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Create new folder</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className="form-input" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="e.g. Grooming, Travel, Lab reports" />
                    <button type="button" className="btn btn-secondary" onClick={handleCreateFolder}>Add</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} rows={3} placeholder="Doctor notes, medication details, visit summary..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Upload file</label>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*,.pdf"
                    onChange={(e) => setRecordForm({ ...recordForm, file: e.target.files?.[0] || null })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRecordModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
