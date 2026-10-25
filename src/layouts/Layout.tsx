import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Dog, Heart, Calendar, MessageCircle, 
  Scissors, ShoppingBag, HomeIcon, MapPin, 
  Search, Users, DollarSign, Settings, Menu,
  Bell, User, LogOut, Lock, Trash2, ChevronDown,
  Plus, UploadCloud, X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { generateId } from '../utils/storage';
import './Layout.css';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home / Dashboard' },
  { path: '/pets', icon: Dog, label: 'My Pets' },
  { path: '/health', icon: Heart, label: 'Health & Vaccinations' },
  { path: '/daily-care', icon: Calendar, label: 'Daily Care' },
  { path: '/ai-assistant', icon: MessageCircle, label: 'AI Pet Assistant' },
  { path: '/services', icon: Scissors, label: 'Services' },
  { path: '/shop', icon: ShoppingBag, label: 'Shop' },
  { path: '/adoption', icon: HomeIcon, label: 'Adoption' },
  { path: '/places', icon: MapPin, label: 'Pet-Friendly Places' },
  { path: '/lost-found', icon: Search, label: 'Lost & Found' },
  { path: '/community', icon: Users, label: 'Community & Guides' },
  { path: '/expenses', icon: DollarSign, label: 'Expenses' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [recordForm, setRecordForm] = useState({
    title: '',
    category: 'prescription',
    folderId: 'general',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    file: null as File | null
  });
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data, currentPet, addDocumentFolder, addDigitalRecord } = useApp();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);
  
  const cartCount = (data.cart || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  
  const getPageTitle = () => {
    const item = navItems.find(item => location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/'));
    return item?.label || 'PAWSYNC';
  };

  const handleProfileAction = (action: 'profile' | 'password' | 'logout' | 'delete') => {
    setProfileMenuOpen(false);

    if (action === 'profile') {
      window.location.href = '/settings';
      return;
    }

    if (action === 'password') {
      alert('Password change requested. Please check your email for reset instructions.');
      return;
    }

    if (action === 'logout') {
      alert('Logged out successfully.');
      return;
    }

    if (window.confirm('This will permanently delete your account and local app data. Continue?')) {
      localStorage.removeItem('pawsync_data');
      localStorage.removeItem('pawsync_profile');
      alert('Account deleted successfully.');
    }
  };

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    const normalized = trimmed.toLowerCase().replace(/\s+/g, '-');
    if (data.documentFolders.some(folder => folder.id === normalized)) {
      setNewFolderName('');
      return;
    }

    addDocumentFolder({ id: normalized, name: trimmed });
    setRecordForm(prev => ({ ...prev, folderId: normalized }));
    setNewFolderName('');
  };

  const handleQuickRecordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!recordForm.title.trim()) return;

    const file = recordForm.file;
    const newRecord = {
      id: generateId(),
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
        addDigitalRecord({
          ...newRecord,
          dataUrl: typeof reader.result === 'string' ? reader.result : undefined
        });
      };
      reader.readAsDataURL(file);
    } else {
      addDigitalRecord(newRecord);
    }

    setRecordForm({
      title: '',
      category: 'prescription',
      folderId: data.documentFolders[0]?.id || 'general',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      file: null
    });
    setShowRecordModal(false);
  };

  return (
    <div className="layout">
      <aside className={'sidebar ' + (sidebarOpen ? 'open' : '')}>
        <div className="sidebar-header">
          <div className="brand-lockup" aria-label="PAWSYNC logo and brand">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64" role="img" aria-label="Paw logo">
                <defs>
                  <linearGradient id="paw-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f7f1ea" />
                    <stop offset="100%" stopColor="#f4d38d" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.12)" />
                <circle cx="22" cy="23" r="5.5" fill="url(#paw-brand-gradient)" />
                <circle cx="32" cy="16" r="5.5" fill="url(#paw-brand-gradient)" />
                <circle cx="42" cy="23" r="5.5" fill="url(#paw-brand-gradient)" />
                <circle cx="27" cy="34" r="5.5" fill="url(#paw-brand-gradient)" />
                <circle cx="37" cy="34" r="5.5" fill="url(#paw-brand-gradient)" />
                <path d="M32 40c-7.2 0-12.6 5.7-12.6 12.2 0 2.6 2.1 4.8 4.8 4.8h15.6c2.7 0 4.8-2.2 4.8-4.8C44.6 45.7 39.2 40 32 40z" fill="url(#paw-brand-gradient)" />
              </svg>
            </div>
            <div className="brand-copy">
              <span className="logo">PAWSYNC</span>
              <span className="tagline">Pet care companion</span>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 'nav-item ' + (isActive ? 'active' : '')}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.path === '/shop' && cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="page-title">{getPageTitle()}</h2>
          </div>
          <div className="header-right">
            <button className="header-btn" onClick={() => setShowRecordModal(true)} title="Save a document or record">
              <Plus size={20} />
            </button>
            <button className="header-btn"><Bell size={20} /></button>
            <div className="profile-menu-wrapper" ref={profileMenuRef}>
              <button
                type="button"
                className="header-btn profile-trigger"
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              >
                <User size={20} />
                <ChevronDown size={14} />
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-avatar">P</div>
                    <div>
                      <strong>Pet Parent</strong>
                      <small>petparent@demo.com</small>
                    </div>
                  </div>

                  <button className="profile-dropdown-item" onClick={() => handleProfileAction('profile')}>
                    <User size={16} />
                    View profile
                  </button>
                  <button className="profile-dropdown-item" onClick={() => handleProfileAction('password')}>
                    <Lock size={16} />
                    Change password
                  </button>
                  <button className="profile-dropdown-item" onClick={() => handleProfileAction('logout')}>
                    <LogOut size={16} />
                    Log out
                  </button>
                  <button className="profile-dropdown-item danger" onClick={() => handleProfileAction('delete')}>
                    <Trash2 size={16} />
                    Delete account
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="page-content">
          {children}
        </main>
      </div>

      {showRecordModal && (
        <div className="modal-overlay" onClick={() => setShowRecordModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Save a digital record</h2>
              <button className="btn btn-secondary" onClick={() => setShowRecordModal(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleQuickRecordSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Record title *</label>
                  <input type="text" className="form-input" value={recordForm.title} onChange={(event) => setRecordForm({ ...recordForm, title: event.target.value })} placeholder="Vaccination card, invoice, prescription, scan..." required />
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={recordForm.category} onChange={(event) => setRecordForm({ ...recordForm, category: event.target.value })}>
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
                    <input type="date" className="form-input" value={recordForm.date} onChange={(event) => setRecordForm({ ...recordForm, date: event.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Folder</label>
                  <select className="form-select" value={recordForm.folderId} onChange={(event) => setRecordForm({ ...recordForm, folderId: event.target.value })}>
                    {data.documentFolders.map((folder) => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Create new folder</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className="form-input" value={newFolderName} onChange={(event) => setNewFolderName(event.target.value)} placeholder="e.g. Travel, Grooming, Vet notes" />
                    <button type="button" className="btn btn-secondary" onClick={handleCreateFolder}>Add</button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" rows={3} value={recordForm.notes} onChange={(event) => setRecordForm({ ...recordForm, notes: event.target.value })} placeholder="Any extra details or reminders..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload file</label>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*,.pdf"
                    onChange={(event) => setRecordForm({ ...recordForm, file: event.target.files?.[0] || null })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRecordModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <UploadCloud size={18} />
                  Save document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
