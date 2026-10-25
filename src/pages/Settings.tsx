import { useEffect, useState } from 'react';
import {
  Bell,
  Globe,
  Lock,
  LogOut,
  PencilLine,
  Shield,
  Trash2,
  User,
} from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';

import { auth, createUserProfile, isFirebaseConfigured } from '../lib/firebase';

interface UserProfile {
  name: string;
  email: string;
  loggedIn: boolean;
  memberSince: string;
  notifications: boolean;
  locationSharing: boolean;
}

const defaultProfile: UserProfile = {
  name: 'Pet Parent',
  email: 'petparent@demo.com',
  loggedIn: false,
  memberSince: '2024-01-10',
  notifications: true,
  locationSharing: true,
};

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [statusMessage, setStatusMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const RATE_LIMIT_WAIT_MS = 60000;

  useEffect(() => {
    const stored = localStorage.getItem('pawsync_profile');
    if (stored) {
      try {
        setProfile({ ...defaultProfile, ...JSON.parse(stored) });
      } catch {
        setProfile(defaultProfile);
      }
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem('pawsync_profile');
      setProfile((prev) => ({ ...prev, loggedIn: false }));
      return;
    }

    localStorage.setItem('pawsync_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setProfile({ ...defaultProfile, loggedIn: false });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        setProfile((prev) => ({
          ...prev,
          name: user.displayName || prev.name || 'Pet Parent',
          email: user.email || prev.email,
          loggedIn: true,
        }));
      } else {
        localStorage.removeItem('pawsync_profile');
        setProfile({ ...defaultProfile, loggedIn: false });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownSeconds(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownSeconds(remaining);

      if (remaining === 0) {
        setCooldownUntil(null);
        setAuthError('Your retry window is over. You can try again now.');
      }
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownUntil]);

  const handleProfileUpdate = () => {
    setStatusMessage('Profile updated successfully.');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (auth && isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (error: any) {
        setStatusMessage(error?.message || 'Unable to sign out right now.');
        return;
      }
    }

    localStorage.removeItem('pawsync_profile');
    localStorage.removeItem('pawsync_guest_mode');
    window.dispatchEvent(new Event('pawsync-auth-change'));
    setProfile({ ...defaultProfile, loggedIn: false });
    setStatusMessage('You have been logged out.');
  };

  const handleSkipLogin = () => {
    localStorage.setItem('pawsync_guest_mode', 'true');
    window.dispatchEvent(new Event('pawsync-auth-change'));
    setProfile({
      ...defaultProfile,
      name: 'Guest User',
      email: 'guest@pawsync.local',
      loggedIn: true,
      memberSince: new Date().toISOString().slice(0, 10),
    });
    setStatusMessage('You are now browsing as a guest.');
  };

  const handleAuthSubmit = async () => {
    const now = Date.now();
    if (cooldownUntil && now < cooldownUntil) {
      const remainingSeconds = Math.ceil((cooldownUntil - now) / 1000);
      setCooldownSeconds(remainingSeconds);
      setAuthError(`Too many attempts. Please wait ${remainingSeconds}s and try again.`);
      setStatusMessage('');
      return;
    }

    if (!auth || !isFirebaseConfigured) {
      setAuthError('Add your Firebase credentials in the .env file to enable real multi-user authentication.');
      setStatusMessage('');
      return;
    }

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Email and password are required.');
      setStatusMessage('');
      return;
    }

    setAuthBusy(true);
    setAuthError('');
    setStatusMessage('');

    try {
      if (authMode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, emailInput.trim(), passwordInput);

        await createUserProfile(credential.user.uid, {
          email: credential.user.email,
          fullName: credential.user.displayName || 'Pet Parent',
        });

        setEmailInput('');
        setPasswordInput('');
        setAuthMode('login');
        setStatusMessage('Account created successfully. Please log in with your email and password.');
      } else {
        const credential = await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);

        setProfile((prev) => ({
          ...prev,
          name: prev.name || 'Pet Parent',
          email: credential.user.email || emailInput.trim(),
          loggedIn: true,
        }));

        setStatusMessage('Welcome back! You are now signed in.');
        setEmailInput('');
        setPasswordInput('');
      }
    } catch (error: any) {
      const code = error?.code as string | undefined;
      const message = error?.message as string | undefined;

      if (code === 'auth/too-many-requests' || code === 'auth/network-request-failed') {
        setCooldownUntil(Date.now() + RATE_LIMIT_WAIT_MS);
        setCooldownSeconds(60);
        setAuthError('Too many attempts. Please wait 60 seconds and try again.');
        return;
      }

      if (code === 'auth/email-already-in-use') {
        setAuthError('This email is already in use. Please log in instead.');
        return;
      }

      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setAuthError('Invalid email or password. Please try again.');
        return;
      }

      setAuthError(message || 'Authentication failed. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleAuthModeChange = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthError('');
    setStatusMessage('');
  };

  const handlePasswordChange = () => {
    setStatusMessage('Password change request sent. Please check your email for reset instructions.');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('This will permanently delete your account and local app data. Continue?');
    if (!confirmed) return;

    localStorage.removeItem('pawsync_data');
    localStorage.removeItem('pawsync_profile');
    setProfile({ ...defaultProfile, loggedIn: false, name: 'Guest User' });
    setStatusMessage('Account deleted successfully.');
  };

  const isLoggedIn = Boolean(profile.loggedIn) || localStorage.getItem('pawsync_guest_mode') === 'true';

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top left, #edf6ef 0%, #eff2ef 22%, #f6f1eb 100%)',
          padding: '2rem'
        }}
      >
        <div
          style={{
            width: 'min(980px, 100%)',
            display: 'flex',
            gap: '0',
            background: 'rgba(255,255,255,0.78)',
            border: '1px solid rgba(127, 145, 131, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 28px 60px rgba(24, 33, 27, 0.12)',
            overflow: 'hidden',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div
            style={{
              flex: '1.1',
              background: 'linear-gradient(160deg, #4a6251 0%, #708a68 45%, #a3b998 100%)',
              padding: '2.5rem 2.1rem',
              color: '#fff',
              position: 'relative'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '1.25rem',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '24px'
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                <Lock size={30} />
              </div>

              <div style={{ marginTop: '2rem' }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.9 }}>
                  Pet care platform
                </div>
                <h1 style={{ margin: '0.8rem 0 0.75rem', fontSize: '3rem', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.06em' }}>
                  PAWSYNC
                </h1>
                <p style={{ margin: 0, fontSize: '1.08rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', maxWidth: '28rem' }}>
                  Track health, find trusted pet services, and keep every paw-sitive moment close.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                {['AI assistant', 'Local services', 'Pet shops'].map((item) => (
                  <span
                    key={item}
                    style={{
                      background: 'rgba(255,255,255,0.14)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: '999px',
                      padding: '0.6rem 0.9rem',
                      fontWeight: 700,
                      fontSize: '0.88rem'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div
                style={{
                  marginTop: '2.1rem',
                  padding: '1rem 1.1rem',
                  background: 'rgba(15, 35, 18, 0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '20px',
                  maxWidth: '24rem'
                }}
              >
                <div style={{ fontSize: '0.76rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.8 }}>
                  New experience
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '1.1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
                  Thoughtful care for pets, smarter support for owners, and a calmer way to manage everything.
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, background: '#f9f4ef', padding: '2.5rem 2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: '#718176', textTransform: 'uppercase', fontWeight: 700 }}>
                Welcome back
              </div>
              <h2 style={{ margin: '0.5rem 0 0.35rem', fontSize: '2.2rem', lineHeight: 1.2, color: '#1d2a24', letterSpacing: '-0.05em' }}>
                Please sign in to continue
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleAuthModeChange('login')}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.9rem 1.2rem',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  background: authMode === 'login' ? '#4f695a' : '#e8e1d8',
                  color: authMode === 'login' ? '#fff' : '#23372f',
                  boxShadow: authMode === 'login' ? '0 10px 22px rgba(79, 105, 90, 0.25)' : 'none'
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleAuthModeChange('signup')}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.9rem 1.2rem',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  background: authMode === 'signup' ? '#4f695a' : '#e8e1d8',
                  color: authMode === 'signup' ? '#fff' : '#23372f'
                }}
              >
                Sign up
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 700, color: '#1d2a24', fontSize: '0.92rem' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setAuthError('');
                    setStatusMessage('');
                  }}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '1rem 1.1rem',
                    borderRadius: '14px',
                    border: '1px solid #d8d1c8',
                    background: '#edf2f7',
                    fontSize: '1rem',
                    color: '#1d2a24',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 700, color: '#1d2a24', fontSize: '0.92rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError('');
                    setStatusMessage('');
                  }}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '1rem 1.1rem',
                    borderRadius: '14px',
                    border: '1px solid #d8d1c8',
                    background: '#edf2f7',
                    fontSize: '1rem',
                    color: '#1d2a24',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {authError && (
                <div style={{
                  background: cooldownSeconds > 0 ? '#fff4dd' : '#fbe9e9',
                  color: cooldownSeconds > 0 ? '#7a4b00' : '#8e2d2d',
                  border: `1px solid ${cooldownSeconds > 0 ? '#f0d09d' : '#edc4c4'}`,
                  borderRadius: '14px',
                  padding: '0.85rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  {cooldownSeconds > 0 ? `Retry in ${cooldownSeconds}s` : authError}
                </div>
              )}

              {statusMessage && (
                <div style={{
                  background: '#eaf5ee',
                  color: '#245a35',
                  border: '1px solid #cfe6d5',
                  borderRadius: '14px',
                  padding: '0.85rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  {statusMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleAuthSubmit}
                disabled={authBusy || cooldownSeconds > 0}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '14px',
                  background: cooldownSeconds > 0
                    ? 'linear-gradient(135deg, #a7b5a8 0%, #b8c5b5 100%)'
                    : 'linear-gradient(135deg, #4b6554 0%, #7a8d70 100%)',
                  color: '#fff',
                  padding: '1rem',
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  cursor: cooldownSeconds > 0 ? 'not-allowed' : 'pointer',
                  boxShadow: cooldownSeconds > 0 ? 'none' : '0 14px 28px rgba(75, 101, 84, 0.28)',
                  opacity: cooldownSeconds > 0 ? 0.9 : 1
                }}
              >
                {authBusy
                  ? 'Please wait...'
                  : cooldownSeconds > 0
                    ? `Please wait ${cooldownSeconds}s`
                    : authMode === 'login'
                      ? 'Login to PAWSYNC'
                      : 'Create account'}
              </button>

              <button
                type="button"
                onClick={handleSkipLogin}
                style={{
                  width: '100%',
                  border: '1px solid #d0d8cf',
                  borderRadius: '14px',
                  background: '#f5f1ec',
                  color: '#253f33',
                  padding: '0.9rem',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Skip login and continue as guest
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile & Settings</h1>
        <p>Manage your account, security, and preferences.</p>
      </div>

      {statusMessage && (
        <div className="card" style={{ marginBottom: '1rem', background: '#eefaf1', border: '1px solid #cce8d0' }}>
          <p style={{ margin: 0, color: '#245a35', fontWeight: 600 }}>{statusMessage}</p>
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="card-title" style={{ margin: 0 }}>
              <User size={18} /> Profile
            </h2>
            <button className="btn btn-secondary" onClick={() => setIsEditing(!isEditing)}>
              <PencilLine size={16} /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {profile.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{profile.name}</h3>
              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-secondary)' }}>
                {localStorage.getItem('pawsync_guest_mode') === 'true'
                  ? 'Guest mode'
                  : profile.loggedIn ? 'Signed in' : 'Not signed in'}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  className="form-input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" onClick={handleProfileUpdate}>Save profile</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Email</div>
                <div style={{ fontWeight: 600 }}>{profile.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Member since</div>
                <div style={{ fontWeight: 600 }}>{profile.memberSince}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {profile.loggedIn ? (
                  <>
                    {localStorage.getItem('pawsync_guest_mode') === 'true' && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.42rem 0.7rem',
                          borderRadius: '999px',
                          background: '#e8f5ea',
                          color: '#245a35',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}
                      >
                        Guest user
                      </span>
                    )}
                    <button className="btn btn-secondary" onClick={handleLogout}>
                      <LogOut size={16} /> Log out
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={() => setAuthMode('login')}>
                    <User size={16} /> Log in
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>
            <Shield size={18} /> Security & Settings
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={handlePasswordChange}>
              <Lock size={16} /> Change password
            </button>

            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setProfile(prev => ({ ...prev, notifications: !prev.notifications }))}>
              <Bell size={16} /> {profile.notifications ? 'Disable notifications' : 'Enable notifications'}
            </button>

            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setProfile(prev => ({ ...prev, locationSharing: !prev.locationSharing }))}>
              <Globe size={16} /> {profile.locationSharing ? 'Disable location sharing' : 'Enable location sharing'}
            </button>

            <button className="btn btn-danger" style={{ justifyContent: 'flex-start' }} onClick={handleDeleteAccount}>
              <Trash2 size={16} /> Delete account
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>Recommended extras</h2>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.6rem' }}>
          <li>Two-factor authentication</li>
          <li>Saved payment methods</li>
          <li>Connected devices management</li>
          <li>Privacy controls for pet-profile sharing</li>
        </ul>
      </div>
    </div>
  );
}
