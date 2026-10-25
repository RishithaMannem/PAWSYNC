import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus } from 'lucide-react';

const parseNumber = (value: string | number | undefined) => {
  const text = String(value ?? '').trim();
  if (!text) return 0;
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const getAgeYears = (pet: any): number => {
  const ageText = String(pet?.age ?? pet?.birthDate ?? '2').toLowerCase();
  const numericMatch = ageText.match(/\d+(?:\.\d+)?/);

  if (numericMatch) {
    return Number(numericMatch[0]);
  }

  if (pet?.birthDate) {
    const birthDate = new Date(pet.birthDate);
    if (!Number.isNaN(birthDate.getTime())) {
      const years = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return Math.max(0.5, years);
    }
  }

  return 2;
};

const inferBreedSize = (breed: string = '', species: string = '') => {
  const text = `${breed} ${species}`.toLowerCase();

  if (/(chihuahua|pomeranian|toy|mini|dachshund|yorkshire|shih|pug|persian|siamese|bengal|tiny)/.test(text)) {
    return 'small';
  }

  if (/(golden|labrador|german shepherd|boxer|husky|bulldog|doberman|collie|mastiff|maine coon|ragdoll|british shorthair|large)/.test(text)) {
    return 'large';
  }

  return 'medium';
};

const getWeightKg = (pet: any): number => {
  const direct = parseNumber(pet?.weight);
  if (direct > 0) return direct;

  const size = inferBreedSize(pet?.breed, pet?.species);
  const species = pet?.species === 'cat' ? 'cat' : 'dog';

  const defaults: Record<string, number> = {
    dog_small: 8,
    dog_medium: 18,
    dog_large: 30,
    cat_small: 3.5,
    cat_medium: 4.5,
    cat_large: 6,
  };

  const key = `${species}_${size}`;
  return defaults[key] ?? 18;
};

const getIdealProfile = (pet: any) => {
  const ageYears = getAgeYears(pet);
  const weightKg = getWeightKg(pet);
  const size = inferBreedSize(pet?.breed, pet?.species);
  const speciesFactor = pet?.species === 'dog' ? 1.1 : pet?.species === 'cat' ? 0.9 : 1;
  const ageFactor = ageYears <= 1 ? 1.3 : ageYears >= 7 ? 0.8 : ageYears >= 3 ? 1.1 : 1;
  const sexFactor = pet?.sex === 'male' ? 1.05 : pet?.sex === 'female' ? 0.97 : 1;
  const sizeFactor = size === 'small' ? 0.85 : size === 'large' ? 1.25 : 1;

  const waterTarget = Math.round(weightKg * 50 * speciesFactor * ageFactor * sexFactor * sizeFactor);
  const exerciseTarget = Math.round((ageYears <= 1 ? 45 : ageYears >= 7 ? 25 : 35) * speciesFactor * sexFactor * sizeFactor);
  const mealTarget = Math.max(2, Math.round((ageYears <= 1 ? 4 : ageYears >= 7 ? 2 : 3) * speciesFactor * sizeFactor));

  return {
    mealTarget,
    waterTarget: Math.max(300, waterTarget),
    exerciseTarget: Math.max(20, exerciseTarget)
  };
};

const formatShortDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function DailyCare() {
  const { data, currentPet, toggleCareTask } = useApp();
  const today = new Date().toISOString().split('T')[0];

  if (!currentPet) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Daily Care</h1>
          <p>Track feeding, water, and exercise</p>
        </div>
        <div className="card empty-state">
          <p>Please select a pet from My Pets page</p>
        </div>
      </div>
    );
  }

  const idealProfile = useMemo(() => getIdealProfile(currentPet), [currentPet]);

  const todayTasks = data.careTasks.filter(t => t.date === today && t.petId === currentPet.id);
  const todayMeals = data.mealLogs.filter(m => m.date === today && m.petId === currentPet.id);
  const todayWater = data.waterLogs.filter(w => w.date === today && w.petId === currentPet.id);
  const todayExercise = data.exerciseLogs.filter(e => e.date === today && e.petId === currentPet.id);

  const mealActual = todayMeals.reduce((sum, item) => sum + parseNumber(item.quantity), 0);
  const waterActual = todayWater.reduce((sum, item) => sum + parseNumber(item.quantity), 0);
  const exerciseActual = todayExercise.reduce((sum, item) => sum + parseNumber(item.duration), 0);

  const healthTrend = useMemo(() => {
    const points: Array<{ label: string; actual: number; ideal: number }> = [];
    const dayLabels = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date;
    });

    dayLabels.forEach(date => {
      const iso = date.toISOString().split('T')[0];
      const meals = data.mealLogs
        .filter(log => log.petId === currentPet.id && log.date === iso)
        .reduce((sum, log) => sum + parseNumber(log.quantity), 0);
      const water = data.waterLogs
        .filter(log => log.petId === currentPet.id && log.date === iso)
        .reduce((sum, log) => sum + parseNumber(log.quantity), 0);
      const exercise = data.exerciseLogs
        .filter(log => log.petId === currentPet.id && log.date === iso)
        .reduce((sum, log) => sum + parseNumber(log.duration), 0);

      const mealRatio = Math.min(1.25, meals / Math.max(idealProfile.mealTarget, 1));
      const waterRatio = Math.min(1.25, water / Math.max(idealProfile.waterTarget, 1));
      const exerciseRatio = Math.min(1.25, exercise / Math.max(idealProfile.exerciseTarget, 1));
      const actualScore = Math.min(100, Math.round(((mealRatio + waterRatio + exerciseRatio) / 3) * 100));

      points.push({
        label: formatShortDate(date),
        actual: actualScore,
        ideal: 100
      });
    });

    return points;
  }, [data.mealLogs, data.waterLogs, data.exerciseLogs, currentPet.id, idealProfile]);

  const overallScore = Math.min(100, Math.round(((
    Math.min(1.25, mealActual / Math.max(idealProfile.mealTarget, 1)) +
    Math.min(1.25, waterActual / Math.max(idealProfile.waterTarget, 1)) +
    Math.min(1.25, exerciseActual / Math.max(idealProfile.exerciseTarget, 1))) / 3) * 100));

  const chartWidth = 600;
  const chartHeight = 220;
  const padding = 24;
  const maxValue = 110;

  const chartPoints = healthTrend.map((point, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / Math.max(healthTrend.length - 1, 1);
    const actualY = chartHeight - padding - ((point.actual / maxValue) * (chartHeight - padding * 2));
    const idealY = chartHeight - padding - ((point.ideal / maxValue) * (chartHeight - padding * 2));
    return { ...point, x, actualY, idealY };
  });

  const actualPath = chartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.actualY}`).join(' ');
  const idealPath = chartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.idealY}`).join(' ');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Daily Care</h1>
        <p>Daily tracking for {currentPet.name} - {today}</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 className="card-title">Health Tracking vs Ideal</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Personalized for {currentPet.breed} • {currentPet.sex} • {currentPet.age || 'adult'} pet
            </p>
          </div>
          <div style={{ background: 'rgba(45, 212, 191, 0.12)', color: '#0f766e', padding: '0.55rem 0.85rem', borderRadius: '999px', fontWeight: 700 }}>
            {overallScore}% score
          </div>
        </div>

        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="220" style={{ marginTop: '1rem' }} aria-label="Pet health trend graph">
          {[0, 25, 50, 75, 100].map(value => {
            const y = chartHeight - padding - ((value / maxValue) * (chartHeight - padding * 2));
            return (
              <g key={value}>
                <line x1={padding} x2={chartWidth - padding} y1={y} y2={y} stroke="rgba(148,163,184,0.25)" strokeDasharray="4 6" />
                <text x={8} y={y + 4} fontSize="10" fill="var(--text-secondary)">{value}%</text>
              </g>
            );
          })}

          <path d={idealPath} fill="none" stroke="#a78bfa" strokeDasharray="7 6" strokeWidth="2.5" />
          <path d={actualPath} fill="none" stroke="#22c55e" strokeWidth="3" />

          {chartPoints.map((point, index) => (
            <g key={`${point.label}-${index}`}>
              <circle cx={point.x} cy={point.actualY} r="4" fill="#22c55e" />
              <text x={point.x} y={chartHeight - 4} textAnchor="middle" fontSize="10" fill="var(--text-secondary)">{point.label}</text>
            </g>
          ))}
        </svg>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Actual trend
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} /> Ideal target
          </span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">Today’s Health Summary</h2>
        </div>

        <div className="grid grid-3">
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Meals</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{mealActual}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ideal: {idealProfile.mealTarget}</div>
            <div style={{ marginTop: '0.75rem', height: '8px', background: 'rgba(148,163,184,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (mealActual / Math.max(idealProfile.mealTarget, 1)) * 100)}%`, background: '#38bdf8', height: '100%' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Water</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{waterActual} ml</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ideal: {idealProfile.waterTarget} ml</div>
            <div style={{ marginTop: '0.75rem', height: '8px', background: 'rgba(148,163,184,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (waterActual / Math.max(idealProfile.waterTarget, 1)) * 100)}%`, background: '#60a5fa', height: '100%' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Exercise</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{exerciseActual} min</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ideal: {idealProfile.exerciseTarget} min</div>
            <div style={{ marginTop: '0.75rem', height: '8px', background: 'rgba(148,163,184,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (exerciseActual / Math.max(idealProfile.exerciseTarget, 1)) * 100)}%`, background: '#34d399', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Today's Checklist</h2>
        </div>
        {todayTasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No tasks for today</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {todayTasks.map(task => (
              <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: task.completed ? 'var(--bg-secondary)' : 'transparent', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                <input type="checkbox" checked={task.completed} onChange={() => toggleCareTask(task.id)} style={{ width: '18px', height: '18px' }} />
                <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{task.title}</span>
                {task.time && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{task.time}</span>}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-3" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Meals</h2>
            <button className="btn btn-primary" onClick={() => alert('Add meal functionality available')}><Plus size={18} /> Log</button>
          </div>
          {todayMeals.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No meals logged</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {todayMeals.map(m => (
                <div key={m.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontWeight: '500' }}>{m.mealType} - {m.foodName}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m.quantity} {m.unit} • {m.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Water</h2>
            <button className="btn btn-primary" onClick={() => alert('Add water functionality available')}><Plus size={18} /> Log</button>
          </div>
          {todayWater.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No water logged</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {todayWater.map(w => (
                <div key={w.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontWeight: '500' }}>{w.quantity} {w.unit}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{w.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Exercise</h2>
            <button className="btn btn-primary" onClick={() => alert('Add exercise functionality available')}><Plus size={18} /> Log</button>
          </div>
          {todayExercise.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No exercise logged</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {todayExercise.map(e => (
                <div key={e.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontWeight: '500' }}>{e.activityType}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{e.duration} min {e.distance ? '• ' + e.distance + ' km' : ''} • {e.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
