import { useApp } from '../contexts/AppContext';
import { Plus, Dog } from 'lucide-react';
import { Link } from 'react-router-dom';

function DashboardHeroIllustration() {
  return (
    <div className="dashboard-hero" aria-label="Cute pet illustration for dashboard">
      <div className="hero-doodle hero-doodle-paw hero-doodle-left" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="32" cy="30" r="12" fill="rgba(123,155,115,0.72)" />
          <circle cx="58" cy="22" r="12" fill="rgba(123,155,115,0.72)" />
          <circle cx="84" cy="30" r="12" fill="rgba(123,155,115,0.72)" />
          <circle cx="44" cy="58" r="12" fill="rgba(123,155,115,0.72)" />
          <circle cx="72" cy="58" r="12" fill="rgba(123,155,115,0.72)" />
          <path d="M60 72c-15 0-28 11-28 26 0 7 6 12 13 12h30c7 0 13-5 13-12 0-15-13-26-28-26z" fill="rgba(123,155,115,0.72)" />
        </svg>
      </div>

      <div className="hero-doodle hero-doodle-bone hero-doodle-right" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <path d="M20 46c0-12 10-22 22-22h36c12 0 22 10 22 22v12c0 3-2 5-5 5h-8v10c0 8-6 14-14 14H58c-8 0-14-6-14-14V63h-8c-3 0-5-2-5-5V46zm18 0h44v12H38V46zm26 18h16v12H64V64z" fill="rgba(244,211,141,0.8)"/>
          <circle cx="28" cy="64" r="5" fill="rgba(255,255,255,0.8)"/>
          <circle cx="92" cy="64" r="5" fill="rgba(255,255,255,0.8)"/>
        </svg>
      </div>

      <div className="hero-doodle hero-doodle-heart hero-doodle-bottom" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <path d="M60 93c-24-18-40-31-40-48 0-11 8-20 18-20 8 0 14 4 19 12 5-8 11-12 19-12 10 0 18 9 18 20 0 17-16 30-40 48z" fill="rgba(217,138,101,0.75)"/>
        </svg>
      </div>

      <div className="hero-card">
        <div className="hero-card-glow" />
        <svg viewBox="0 0 320 220" className="pet-illustration" role="img" aria-label="Cute dog and cat illustration">
          <defs>
            <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f6ebdb" />
              <stop offset="100%" stopColor="#ebf1e8" />
            </linearGradient>
            <linearGradient id="heroDog" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d98a65" />
              <stop offset="100%" stopColor="#c96d4b" />
            </linearGradient>
            <linearGradient id="heroCat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7b9b73" />
              <stop offset="100%" stopColor="#66896b" />
            </linearGradient>
          </defs>

          <ellipse cx="163" cy="178" rx="110" ry="24" fill="rgba(86,108,84,0.12)" />
          <path d="M69 164c0-31 15-56 45-69 21-9 52-9 73 1 17 8 30 22 37 40 9 22 6 50-11 65-21 18-59 26-92 18-25-7-42-24-52-55z" fill="url(#heroBg)" />

          <g transform="translate(92 55)">
            <circle cx="53" cy="56" r="42" fill="url(#heroDog)"/>
            <circle cx="12" cy="18" r="9" fill="#f8f2ed"/>
            <circle cx="95" cy="18" r="9" fill="#f8f2ed"/>
            <circle cx="18" cy="18" r="5" fill="#203128"/>
            <circle cx="89" cy="18" r="5" fill="#203128"/>
            <path d="M34 75c9 13 20 19 35 19s26-6 35-19" fill="none" stroke="#f8f2ed" strokeWidth="8" strokeLinecap="round"/>
            <path d="M42 52c-9-4-16-14-17-24" fill="none" stroke="#f8f2ed" strokeWidth="7" strokeLinecap="round"/>
            <path d="M64 52c9-4 16-14 17-24" fill="none" stroke="#f8f2ed" strokeWidth="7" strokeLinecap="round"/>
            <path d="M18 78l-14 18" stroke="#f8f2ed" strokeWidth="7" strokeLinecap="round"/>
            <path d="M88 78l14 18" stroke="#f8f2ed" strokeWidth="7" strokeLinecap="round"/>
            <path d="M53 90l-8 15" stroke="#f8f2ed" strokeWidth="7" strokeLinecap="round"/>
            <path d="M63 90l8 15" stroke="#f8f2ed" strokeWidth="7" strokeLinecap="round"/>
          </g>

          <g transform="translate(165 85)">
            <circle cx="52" cy="32" r="32" fill="url(#heroCat)"/>
            <path d="M25 26l-16-16 16 2 6 14-6 0z" fill="url(#heroCat)"/>
            <path d="M79 26l16-16-16 2-6 14 6 0z" fill="url(#heroCat)"/>
            <circle cx="41" cy="35" r="4" fill="#203128"/>
            <circle cx="63" cy="35" r="4" fill="#203128"/>
            <path d="M46 48c8 8 13 8 20 0" fill="none" stroke="#f8f2ed" strokeWidth="5" strokeLinecap="round"/>
            <path d="M42 22l-8 10" stroke="#f8f2ed" strokeWidth="6" strokeLinecap="round"/>
            <path d="M62 22l8 10" stroke="#f8f2ed" strokeWidth="6" strokeLinecap="round"/>
          </g>

          <g transform="translate(35 146)" fill="#f4d38d" opacity="0.9">
            <circle cx="10" cy="10" r="6"/>
            <circle cx="28" cy="10" r="6"/>
            <circle cx="18" cy="25" r="6"/>
            <path d="M18 36c-7 0-12 6-12 13 0 3 2 5 5 5h14c3 0 5-2 5-5 0-7-5-13-12-13z"/>
          </g>
        </svg>
      </div>

      <div className="hero-badge hero-badge-top">🐾 3 walks</div>
      <div className="hero-badge hero-badge-bottom">❤ 9 meals</div>

      <style>{`
        .pet-photo-strip {
          display: flex;
          justify-content: center;
          gap: 0.9rem;
          margin: -0.6rem 0 1.5rem;
          flex-wrap: wrap;
        }

        .pet-thumb {
          width: 86px;
          height: 86px;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(123,155,115,0.12);
          box-shadow: 0 12px 24px rgba(50, 68, 53, 0.08);
          transform: rotate(-2deg);
        }

        .pet-thumb:nth-child(2) {
          transform: rotate(2deg);
          margin-top: 0.7rem;
        }

        .pet-thumb:nth-child(3) {
          transform: rotate(-3deg);
        }

        .pet-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: saturate(0.9) contrast(1.03);
        }

        .dashboard-hero {
          position: relative;
          margin: 1.2rem 0 1.6rem;
          padding: 1rem;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(123,155,115,0.12) 0%, rgba(244,211,141,0.18) 100%);
          border: 1px solid rgba(123,155,115,0.12);
          box-shadow: 0 18px 40px rgba(58, 77, 63, 0.08);
          overflow: hidden;
        }

        .hero-card {
          position: relative;
          width: min(100%, 760px);
          margin: 0 auto;
          padding: 0.5rem 0 0;
        }

        .hero-card-glow {
          position: absolute;
          inset: 12% 18% 8% 18%;
          border-radius: 24px;
          background: radial-gradient(circle, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.08) 65%, transparent 100%);
        }

        .pet-illustration {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%;
          height: auto;
          filter: drop-shadow(0 18px 26px rgba(46, 70, 52, 0.08));
        }

        .hero-doodle {
          position: absolute;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
        }

        .hero-doodle svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .hero-doodle-left {
          width: 124px;
          height: 124px;
          left: 8%;
          top: 10%;
          transform: rotate(-10deg);
        }

        .hero-doodle-right {
          width: 118px;
          height: 118px;
          right: 9%;
          top: 12%;
          transform: rotate(12deg);
        }

        .hero-doodle-bottom {
          width: 90px;
          height: 90px;
          right: 17%;
          bottom: 13%;
        }

        .hero-badge {
          position: absolute;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.45rem 0.8rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(123,155,115,0.16);
          box-shadow: 0 10px 22px rgba(52, 65, 53, 0.08);
          backdrop-filter: blur(4px);
        }

        .hero-badge-top {
          top: 18%;
          left: 7%;
        }

        .hero-badge-bottom {
          right: 8%;
          bottom: 20%;
        }

        @media (max-width: 700px) {
          .dashboard-hero {
            padding: 0.75rem;
          }

          .hero-badge {
            font-size: 0.7rem;
            padding: 0.35rem 0.65rem;
          }

          .hero-badge-top {
            left: 4%;
            top: 16%;
          }

          .hero-badge-bottom {
            right: 6%;
            bottom: 18%;
          }
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  const { data, currentPet, toggleCareTask } = useApp();
  const today = new Date().toISOString().split('T')[0];
  
  const todayTasks = data.careTasks.filter(t => t.date === today);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  
  const upcomingVaccinations = data.vaccinations.filter(v => v.status === 'upcoming').slice(0, 3);
  
  const todayMeals = data.mealLogs.filter(m => m.date === today);
  const todayWater = data.waterLogs.filter(w => w.date === today);
  const todayExercise = data.exerciseLogs.filter(e => e.date === today);
  
  const waterTotal = todayWater.reduce((sum, w) => sum + parseFloat(w.quantity || '0'), 0);
  const mealCount = todayMeals.length;
  
  return (
    <div className="page">
      <DashboardHeroIllustration />

      <div className="pet-photo-strip" aria-label="Cute pet gallery">
        <div className="pet-thumb pet-thumb-one"><img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80" alt="Happy dog" /></div>
        <div className="pet-thumb pet-thumb-two"><img src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&q=80" alt="Cute cat" /></div>
        <div className="pet-thumb pet-thumb-three"><img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80" alt="Pet smiling" /></div>
      </div>

      <div className="page-header">
        <h1>Welcome to PAWSYNC</h1>
        <p>Here's your pet care overview for today</p>
      </div>

      {!currentPet && data.pets.length === 0 ? (
        <div className="card empty-state">
          <Dog size={48} />
          <h3>No pets yet</h3>
          <p>Get started by adding your first pet profile</p>
          <Link to="/pets" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <Plus size={20} />
            Add Your First Pet
          </Link>
        </div>
      ) : (
        <>
          {currentPet && (
            <div className="card pet-spotlight">
              <div className="pet-spotlight-header">
                <div>
                  <p className="pet-kicker">Primary pet</p>
                  <h2 className="card-title">Your Pet</h2>
                </div>
                <Link to="/pets" className="btn btn-secondary">Switch Pet</Link>
              </div>

              <div className="pet-spotlight-body">
                <div className="pet-profile-visual">
                  <div className="pet-avatar">
                    {currentPet.emoji || (currentPet.species === 'dog' ? '🐶' : currentPet.species === 'cat' ? '🐱' : currentPet.species === 'bird' ? '🐦' : currentPet.species === 'rabbit' ? '🐰' : '🐾')}
                  </div>
                  <span className="pet-status">Healthy</span>
                </div>

                <div className="pet-profile-copy">
                  <h3>{currentPet.name}</h3>
                  <p className="pet-breed">{currentPet.breed}</p>

                  <div className="pet-meta-row">
                    <span>{currentPet.age}</span>
                    <span>{currentPet.sex}</span>
                    <span>{currentPet.species}</span>
                  </div>

                  <div className="pet-mini-stats">
                    <div>
                      <strong>Care</strong>
                      <small>On track</small>
                    </div>
                    <div>
                      <strong>Routine</strong>
                      <small>Daily</small>
                    </div>
                    <div>
                      <strong>Next</strong>
                      <small>Vet check</small>
                    </div>
                  </div>
                </div>
              </div>

              <style>{`
                .pet-spotlight {
                  position: relative;
                  overflow: hidden;
                  background: linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(247,241,234,0.95) 100%);
                  border: 1px solid rgba(123,155,115,0.18);
                  box-shadow: 0 18px 36px rgba(50, 66, 52, 0.08);
                }

                .pet-spotlight::before {
                  content: '';
                  position: absolute;
                  inset: -30% auto auto -10%;
                  width: 180px;
                  height: 180px;
                  border-radius: 50%;
                  background: radial-gradient(circle, rgba(244,211,141,0.38) 0%, rgba(244,211,141,0) 70%);
                }

                .pet-spotlight-header {
                  position: relative;
                  z-index: 1;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 1rem;
                  margin-bottom: 1rem;
                }

                .pet-kicker {
                  margin: 0 0 0.25rem;
                  font-size: 0.72rem;
                  letter-spacing: 0.1em;
                  text-transform: uppercase;
                  color: var(--text-secondary);
                  font-weight: 700;
                }

                .pet-spotlight-body {
                  position: relative;
                  z-index: 1;
                  display: flex;
                  align-items: center;
                  gap: 1.25rem;
                  flex-wrap: wrap;
                }

                .pet-profile-visual {
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 130px;
                  height: 130px;
                  border-radius: 28px;
                  background: linear-gradient(135deg, rgba(123,155,115,0.16) 0%, rgba(244,211,141,0.22) 100%);
                  box-shadow: inset 0 0 0 1px rgba(123,155,115,0.12);
                }

                .pet-avatar {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 82px;
                  height: 82px;
                  border-radius: 24px;
                  background: rgba(255,255,255,0.66);
                  font-size: 2.5rem;
                  box-shadow: 0 12px 22px rgba(55, 73, 58, 0.08);
                }

                .pet-status {
                  position: absolute;
                  right: 8px;
                  bottom: 8px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0.35rem 0.6rem;
                  border-radius: 999px;
                  background: rgba(123,155,115,0.14);
                  color: var(--brand-primary-dark);
                  font-size: 0.7rem;
                  font-weight: 700;
                  border: 1px solid rgba(123,155,115,0.18);
                }

                .pet-profile-copy {
                  flex: 1;
                  min-width: 220px;
                }

                .pet-profile-copy h3 {
                  margin: 0 0 0.25rem;
                  font-size: clamp(1.4rem, 2vw, 2rem);
                  font-weight: 800;
                  letter-spacing: -0.05em;
                  color: var(--text-primary);
                }

                .pet-breed {
                  margin: 0;
                  font-size: 0.98rem;
                  color: var(--text-secondary);
                  font-weight: 600;
                }

                .pet-meta-row {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.5rem;
                  margin-top: 0.9rem;
                }

                .pet-meta-row span {
                  padding: 0.45rem 0.7rem;
                  border-radius: 999px;
                  background: rgba(255,255,255,0.72);
                  border: 1px solid rgba(123,155,115,0.14);
                  color: var(--text-primary);
                  font-size: 0.78rem;
                  font-weight: 700;
                }

                .pet-mini-stats {
                  display: grid;
                  grid-template-columns: repeat(3, minmax(90px, 1fr));
                  gap: 0.7rem;
                  margin-top: 1rem;
                }

                .pet-mini-stats div {
                  padding: 0.8rem 0.7rem;
                  border-radius: 16px;
                  background: rgba(255,255,255,0.76);
                  border: 1px solid rgba(123,155,115,0.12);
                  display: flex;
                  flex-direction: column;
                  gap: 0.2rem;
                }

                .pet-mini-stats strong {
                  font-size: 0.76rem;
                  letter-spacing: 0.04em;
                  text-transform: uppercase;
                  color: var(--text-secondary);
                }

                .pet-mini-stats small {
                  font-size: 0.88rem;
                  font-weight: 700;
                  color: var(--text-primary);
                }

                @media (max-width: 700px) {
                  .pet-spotlight-header {
                    flex-direction: column;
                    align-items: flex-start;
                  }

                  .pet-profile-visual {
                    width: 110px;
                    height: 110px;
                  }

                  .pet-mini-stats {
                    grid-template-columns: repeat(3, minmax(80px, 1fr));
                  }
                }
              `}</style>
            </div>
          )}

          <div className="grid grid-2">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Today's Care Checklist</h2>
                <span className="badge badge-info">{completedTasks}/{todayTasks.length} done</span>
              </div>
              {todayTasks.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No tasks scheduled for today</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {todayTasks.map(task => (
                    <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: task.completed ? 'var(--bg-secondary)' : 'transparent', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={task.completed} onChange={() => toggleCareTask(task.id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{task.title}</span>
                      {task.time && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{task.time}</span>}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Today's Progress</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <span>Meals</span>
                  <span style={{ fontWeight: '600' }}>{mealCount} logged</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <span>Water</span>
                  <span style={{ fontWeight: '600' }}>{waterTotal} logged</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <span>Exercise</span>
                  <span style={{ fontWeight: '600' }}>{todayExercise.length} sessions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Upcoming Vaccinations</h2>
                <Link to="/health" className="btn btn-secondary">View All</Link>
              </div>
              {upcomingVaccinations.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No upcoming vaccinations</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {upcomingVaccinations.map(v => (
                    <div key={v.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                      <div style={{ fontWeight: '500' }}>{v.vaccineName}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Due: {v.nextDueDate}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Link to="/pets" className="btn btn-secondary" style={{ justifyContent: 'center' }}><Plus size={18} />Add Pet</Link>
                <Link to="/daily-care" className="btn btn-secondary" style={{ justifyContent: 'center' }}>Log Meal</Link>
                <Link to="/health" className="btn btn-secondary" style={{ justifyContent: 'center' }}>Add Reminder</Link>
                <Link to="/services" className="btn btn-secondary" style={{ justifyContent: 'center' }}>Book Service</Link>
                <Link to="/ai-assistant" className="btn btn-primary" style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>Ask AI</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
