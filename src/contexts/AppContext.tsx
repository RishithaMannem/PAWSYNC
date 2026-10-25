import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData } from '../types';
import { loadData, saveData, generateId, loadDemoData } from '../utils/storage';

interface AppContextType {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  currentPet: any;
  setCurrentPetId: (id: string | null) => void;
  setLocation: (location: string) => void;
  addPet: (pet: any) => void;
  updatePet: (id: string, pet: any) => void;
  deletePet: (id: string) => void;
  addMealLog: (log: any) => void;
  updateMealLog: (id: string, log: any) => void;
  deleteMealLog: (id: string) => void;
  addWaterLog: (log: any) => void;
  deleteWaterLog: (id: string) => void;
  addExerciseLog: (log: any) => void;
  deleteExerciseLog: (id: string) => void;
  toggleCareTask: (id: string) => void;
  addVaccination: (vacc: any) => void;
  updateVaccination: (id: string, vacc: any) => void;
  deleteVaccination: (id: string) => void;
  addAppointment: (app: any) => void;
  updateAppointment: (id: string, app: any) => void;
  deleteAppointment: (id: string) => void;
  addToCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addOrder: (order: any) => void;
  toggleFavorite: (type: 'adoption' | 'places' | 'guides', id: string) => void;
  addAdoptionInterest: (interest: any) => void;
  addLostFoundReport: (report: any) => void;
  deleteLostFoundReport: (id: string) => void;
  addExpense: (expense: any) => void;
  updateExpense: (id: string, expense: any) => void;
  deleteExpense: (id: string) => void;
  addDocumentFolder: (folder: any) => void;
  addDigitalRecord: (record: any) => void;
  deleteDigitalRecord: (id: string) => void;
  loadSampleData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const currentPet = data.pets.find(p => p.id === data.currentPetId) || null;

  const setCurrentPetId = (id: string | null) => {
    setData(prev => ({ ...prev, currentPetId: id }));
  };

  const setLocation = (location: string) => {
    const trimmed = location.trim();
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        location: trimmed
      }
    }));
  };

  const addPet = (pet: any) => {
    const newPet = { ...pet, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, pets: [...prev.pets, newPet], currentPetId: newPet.id }));
  };

  const updatePet = (id: string, pet: any) => {
    setData(prev => ({ ...prev, pets: prev.pets.map(p => p.id === id ? { ...p, ...pet } : p) }));
  };

  const deletePet = (id: string) => {
    setData(prev => {
      const filtered = prev.pets.filter(p => p.id !== id);
      return {
        ...prev,
        pets: filtered,
        currentPetId: prev.currentPetId === id ? (filtered[0]?.id || null) : prev.currentPetId
      };
    });
  };

  const addMealLog = (log: any) => {
    const newLog = { ...log, id: generateId() };
    setData(prev => ({ ...prev, mealLogs: [...prev.mealLogs, newLog] }));
  };

  const updateMealLog = (id: string, log: any) => {
    setData(prev => ({ ...prev, mealLogs: prev.mealLogs.map(m => m.id === id ? { ...m, ...log } : m) }));
  };

  const deleteMealLog = (id: string) => {
    setData(prev => ({ ...prev, mealLogs: prev.mealLogs.filter(m => m.id !== id) }));
  };

  const addWaterLog = (log: any) => {
    const newLog = { ...log, id: generateId() };
    setData(prev => ({ ...prev, waterLogs: [...prev.waterLogs, newLog] }));
  };

  const deleteWaterLog = (id: string) => {
    setData(prev => ({ ...prev, waterLogs: prev.waterLogs.filter(w => w.id !== id) }));
  };

  const addExerciseLog = (log: any) => {
    const newLog = { ...log, id: generateId() };
    setData(prev => ({ ...prev, exerciseLogs: [...prev.exerciseLogs, newLog] }));
  };

  const deleteExerciseLog = (id: string) => {
    setData(prev => ({ ...prev, exerciseLogs: prev.exerciseLogs.filter(e => e.id !== id) }));
  };

  const toggleCareTask = (id: string) => {
    setData(prev => ({ ...prev, careTasks: prev.careTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) }));
  };

  const addVaccination = (vacc: any) => {
    const newVacc = { ...vacc, id: generateId() };
    setData(prev => ({ ...prev, vaccinations: [...prev.vaccinations, newVacc] }));
  };

  const updateVaccination = (id: string, vacc: any) => {
    setData(prev => ({ ...prev, vaccinations: prev.vaccinations.map(v => v.id === id ? { ...v, ...vacc } : v) }));
  };

  const deleteVaccination = (id: string) => {
    setData(prev => ({ ...prev, vaccinations: prev.vaccinations.filter(v => v.id !== id) }));
  };

  const addAppointment = (app: any) => {
    const newApp = { ...app, id: generateId() };
    setData(prev => ({ ...prev, appointments: [...prev.appointments, newApp] }));
  };

  const updateAppointment = (id: string, app: any) => {
    setData(prev => ({ ...prev, appointments: prev.appointments.map(a => a.id === id ? { ...a, ...app } : a) }));
  };

  const deleteAppointment = (id: string) => {
    setData(prev => ({ ...prev, appointments: prev.appointments.filter(a => a.id !== id) }));
  };

  const addToCart = (productId: string) => {
    setData(prev => {
      const existing = prev.cart.find(c => c.productId === productId);
      if (existing) {
        return { ...prev, cart: prev.cart.map(c => c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c) };
      }
      return { ...prev, cart: [...prev.cart, { productId, quantity: 1 }] };
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setData(prev => ({ ...prev, cart: prev.cart.filter(c => c.productId !== productId) }));
      return;
    }
    setData(prev => ({ ...prev, cart: prev.cart.map(c => c.productId === productId ? { ...c, quantity } : c) }));
  };

  const removeFromCart = (productId: string) => {
    setData(prev => ({ ...prev, cart: prev.cart.filter(c => c.productId !== productId) }));
  };

  const clearCart = () => {
    setData(prev => ({ ...prev, cart: [] }));
  };

  const addOrder = (order: any) => {
    const newOrder = { ...order, id: generateId(), createdAt: new Date().toISOString(), status: 'confirmed' };
    setData(prev => ({ ...prev, orders: [...prev.orders, newOrder], cart: [] }));
  };

  const toggleFavorite = (type: 'adoption' | 'places' | 'guides', id: string) => {
    setData(prev => {
      const list = prev.favorites[type];
      if (list.includes(id)) {
        return { ...prev, favorites: { ...prev.favorites, [type]: list.filter(f => f !== id) } };
      }
      return { ...prev, favorites: { ...prev.favorites, [type]: [...list, id] } };
    });
  };

  const addAdoptionInterest = (interest: any) => {
    const newInterest = { ...interest, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, adoptionInterests: [...prev.adoptionInterests, newInterest] }));
  };

  const addLostFoundReport = (report: any) => {
    const newReport = { ...report, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, lostFoundReports: [...prev.lostFoundReports, newReport] }));
  };

  const deleteLostFoundReport = (id: string) => {
    setData(prev => ({ ...prev, lostFoundReports: prev.lostFoundReports.filter(r => r.id !== id) }));
  };

  const addExpense = (expense: any) => {
    const newExpense = { ...expense, id: generateId() };
    setData(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
  };

  const updateExpense = (id: string, expense: any) => {
    setData(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === id ? { ...e, ...expense } : e) }));
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const addDocumentFolder = (folder: any) => {
    const newFolder = { ...folder, id: folder.id || generateId() };
    setData(prev => ({
      ...prev,
      documentFolders: [...prev.documentFolders, newFolder]
    }));
  };

  const addDigitalRecord = (record: any) => {
    const newRecord = { ...record, id: record.id || generateId() };
    setData(prev => ({ ...prev, digitalRecords: [newRecord, ...prev.digitalRecords] }));
  };

  const deleteDigitalRecord = (id: string) => {
    setData(prev => ({ ...prev, digitalRecords: prev.digitalRecords.filter(r => r.id !== id) }));
  };

  const loadSampleData = () => {
    setData(loadDemoData());
  };

  const clearAllData = () => {
    setData({
      pets: [], vaccinations: [], medications: [], vetVisits: [], weightRecords: [],
      mealLogs: [], waterLogs: [], exerciseLogs: [], careTasks: [], reminders: [],
      appointments: [], cart: [], orders: [],
      favorites: { adoption: [], places: [], guides: [] },
      adoptionInterests: [], lostFoundReports: [], expenses: [], digitalRecords: [], documentFolders: [{ id: 'general', name: 'General' }],
      currentPetId: null,
      settings: { theme: 'light', currency: 'INR', location: '' }
    });
  };

  return (
    <AppContext.Provider value={{
      data, setData, currentPet, setCurrentPetId, setLocation, addPet, updatePet, deletePet,
      addMealLog, updateMealLog, deleteMealLog, addWaterLog, deleteWaterLog,
      addExerciseLog, deleteExerciseLog, toggleCareTask,
      addVaccination, updateVaccination, deleteVaccination,
      addAppointment, updateAppointment, deleteAppointment,
      addToCart, updateCartQuantity, removeFromCart, clearCart, addOrder,
      toggleFavorite, addAdoptionInterest, addLostFoundReport, deleteLostFoundReport,
      addExpense, updateExpense, deleteExpense, addDocumentFolder, addDigitalRecord, deleteDigitalRecord,
      loadSampleData, clearAllData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
