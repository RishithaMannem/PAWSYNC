import { useEffect, useMemo, useState } from 'react';
import { Bot, Send, Sparkles, RefreshCcw, LoaderCircle, PawPrint } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const defaultPrompts = [
  'What should I remember for my pet today?',
  'Summarize my pet\'s upcoming care tasks.',
  'Help me organize a vet visit.',
  'Suggest questions to ask my veterinarian.',
  'Summarize my pet\'s meal and exercise logs.',
  'Explain general pet-care practices.'
];

function formatPetName(pet: any) {
  return pet?.name || 'your pet';
}

function buildDemoReply(question: string, pet: any, data: any) {
  if (!pet) {
    return 'Please add a pet profile first so PAWSYNC AI can personalize your care reminders and suggestions.';
  }

  const q = question.toLowerCase();
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = (data.careTasks || []).filter((task: any) => task.petId === pet.id && task.date === today);
  const completedTasks = todayTasks.filter((task: any) => task.completed).length;
  const upcomingVaccinations = (data.vaccinations || []).filter((v: any) => v.petId === pet.id && v.status !== 'completed').slice(0, 2);
  const upcomingAppointments = (data.appointments || []).filter((a: any) => a.petId === pet.id && a.status === 'upcoming').slice(0, 2);
  const mealLogs = (data.mealLogs || []).filter((log: any) => log.petId === pet.id && log.date === today);
  const waterLogs = (data.waterLogs || []).filter((log: any) => log.petId === pet.id && log.date === today);
  const exerciseLogs = (data.exerciseLogs || []).filter((log: any) => log.petId === pet.id && log.date === today);
  const waterTotal = waterLogs.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0);

  if (q.includes('remember') || q.includes('today')) {
    const reminders: string[] = [];
    if (todayTasks.length) {
      reminders.push(`${todayTasks.length} care task${todayTasks.length > 1 ? 's' : ''} scheduled today (${completedTasks} completed).`);
    } else {
      reminders.push('No care tasks scheduled for today.');
    }
    if (upcomingVaccinations.length) {
      reminders.push(`${upcomingVaccinations.length} vaccination reminder${upcomingVaccinations.length > 1 ? 's' : ''} is upcoming.`);
    }
    if (upcomingAppointments.length) {
      reminders.push(`${upcomingAppointments.length} appointment${upcomingAppointments.length > 1 ? 's' : ''} are on the calendar.`);
    }
    return `For ${pet.name}, the main things to remember today are: ${reminders.join(' ')}`;
  }

  if (q.includes('upcoming') || q.includes('task') || q.includes('care')) {
    const tasksText = todayTasks.length
      ? todayTasks.map((task: any) => `${task.title}${task.completed ? ' (done)' : ' (pending)'}`).join(', ')
      : 'No tasks are scheduled today.';
    const vaccineText = upcomingVaccinations.length
      ? upcomingVaccinations.map((v: any) => `${v.vaccineName} due ${v.nextDueDate || 'soon'}`).join(', ')
      : 'No vaccination reminders are due soon.';
    return `${pet.name}'s care overview: ${tasksText}. Vaccinations: ${vaccineText}.`;
  }

  if (q.includes('vet') || q.includes('visit') || q.includes('appointment')) {
    return `For a vet visit with ${pet.name}, useful questions to bring are: 1) What is improving or changing in ${pet.name}'s health? 2) Are there any warning signs we should monitor at home? 3) What follow-up check is recommended and when? If your pet seems urgent or very uncomfortable, contact a veterinarian promptly.`;
  }

  if (q.includes('question') || q.includes('ask')) {
    return `A good checklist for your vet conversation: appetite/energy changes, bathroom habits, recent weight or behavior shifts, exercise and meal routine, and any vaccine or medication updates for ${pet.name}.`;
  }

  if (q.includes('meal') || q.includes('exercise') || q.includes('log')) {
    const mealSummary = mealLogs.length
      ? mealLogs.map((item: any) => `${item.foodName} (${item.quantity}${item.unit})`).join(', ')
      : 'No meals logged today yet.';
    const exerciseSummary = exerciseLogs.length
      ? exerciseLogs.map((item: any) => `${item.activityType} for ${item.duration}`).join(', ')
      : 'No exercise logged today yet.';
    return `${pet.name}'s daily summary: meals: ${mealSummary}. Water: ${waterTotal} ${waterLogs[0]?.unit || 'ml'} total. Exercise: ${exerciseSummary}.`;
  }

  if (q.includes('general') || q.includes('care practice') || q.includes('pet-care')) {
    return `General pet-care reminders: keep feeding and hydration consistent, monitor appetite and behavior, maintain regular checkups, and watch for changes in movement, bathroom habits, or mood. For any urgent symptoms, contact a veterinarian for advice.`;
  }

  return `I can help with ${pet.name}'s schedule, meals, water, exercise, vet prep, or general care reminders. Try asking about today\'s tasks, upcoming vaccines, or a quick summary of your pet\'s routine.`;
}

export default function AIAssistant() {
  const { data, currentPet } = useApp();
  const [selectedPetId, setSelectedPetId] = useState(currentPet?.id ?? data.pets[0]?.id ?? '');
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi! I\'m PAWSYNC AI in demo mode. I can help you review your pet\'s routine, upcoming care, meals, hydration, exercise, and vet prep using the information saved in your app.'
    }
  ]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentPet && currentPet.id !== selectedPetId) {
      setSelectedPetId(currentPet.id);
    }
  }, [currentPet, selectedPetId]);

  const selectedPet = useMemo(() => {
    return data.pets.find((pet: any) => pet.id === selectedPetId) || currentPet || data.pets[0] || null;
  }, [data.pets, currentPet, selectedPetId]);

  const submitPrompt = (promptText?: string) => {
    const value = (promptText ?? draft).trim();
    if (!value) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', text: value }]);
    setDraft('');
    setIsLoading(true);

    window.setTimeout(() => {
      const reply = buildDemoReply(value, selectedPet, data);
      setMessages((prev) => [...prev, { id: Date.now().toString() + '-bot', role: 'assistant', text: reply }]);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>PAWSYNC AI</h1>
        <p>Demo assistant using your saved pet data</p>
      </div>

      <div className="card ai-shell">
        <div className="ai-topbar">
          <div className="ai-status">
            <div className="ai-badge"><Bot size={18} /></div>
            <div>
              <strong>Demo AI Assistant</strong>
              <small>Not connected to a live model</small>
            </div>
          </div>

          <div className="pet-picker">
            <label htmlFor="pet-select">Pet</label>
            <select
              id="pet-select"
              value={selectedPet?.id ?? ''}
              onChange={(e) => setSelectedPetId(e.target.value)}
            >
              {data.pets.length === 0 ? (
                <option value="">No pets added</option>
              ) : (
                data.pets.map((pet: any) => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))
              )}
            </select>
          </div>
        </div>

        {!selectedPet ? (
          <div className="empty-state ai-empty">
            <PawPrint size={42} />
            <h3>No pet selected</h3>
            <p>Add a pet profile to unlock personalized PAWSYNC AI suggestions.</p>
          </div>
        ) : (
          <>
            <div className="ai-chat">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.role}`}>
                  <div className="chat-avatar">
                    {message.role === 'assistant' ? <Bot size={16} /> : <Sparkles size={16} />}
                  </div>
                  <div className="chat-bubble">
                    {message.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="chat-message assistant">
                  <div className="chat-avatar"><LoaderCircle size={16} className="spin" /></div>
                  <div className="chat-bubble loading">Thinking...</div>
                </div>
              )}
            </div>

            <div className="suggestions">
              {defaultPrompts.map((prompt) => (
                <button key={prompt} type="button" className="prompt-chip" onClick={() => submitPrompt(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <div className="chat-input-row">
              <input
                type="text"
                value={draft}
                placeholder={`Ask PAWSYNC AI about ${formatPetName(selectedPet)}...`}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitPrompt();
                }}
              />
              <button type="button" className="btn btn-primary" onClick={() => submitPrompt()} disabled={isLoading}>
                <Send size={16} />
                Send
              </button>
            </div>
          </>
        )}

        <div className="ai-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setMessages([{ id: 'reset', role: 'assistant', text: `Hi! I’m PAWSYNC AI for ${formatPetName(selectedPet)}. Ask me about care reminders, meals, exercise, or a vet visit plan.` }])}>
            <RefreshCcw size={16} />
            Reset chat
          </button>
          <span>Uses stored app data only. No live AI model is connected.</span>
        </div>
      </div>
    </div>
  );
}
