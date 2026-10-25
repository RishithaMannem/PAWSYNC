import { v4 as uuidv4 } from 'uuid';
import { AppData } from '../types';

const STORAGE_KEY = 'pawsync_data';

const initialData: AppData = {
  pets: [],
  vaccinations: [],
  medications: [],
  vetVisits: [],
  weightRecords: [],
  mealLogs: [],
  waterLogs: [],
  exerciseLogs: [],
  careTasks: [],
  reminders: [],
  appointments: [],
  cart: [],
  orders: [],
  favorites: { adoption: [], places: [], guides: [] },
  adoptionInterests: [],
  lostFoundReports: [],
  expenses: [],
  digitalRecords: [],
  documentFolders: [{ id: 'general', name: 'General' }, { id: 'vaccines', name: 'Vaccines' }, { id: 'bills', name: 'Bills' }],
  currentPetId: null,
  settings: { theme: 'light', currency: 'INR', location: '' }
};

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return JSON.parse(JSON.stringify(initialData));
    const parsed = JSON.parse(stored);
    return {
      ...initialData,
      ...parsed,
      settings: {
        ...initialData.settings,
        ...(parsed.settings || {})
      }
    };
  } catch {
    return JSON.parse(JSON.stringify(initialData));
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}

export function generateId(): string {
  return uuidv4();
}

export function loadDemoData(): AppData {
  const data = JSON.parse(JSON.stringify(initialData));
  
  // Add sample pets
  const pet1Id = generateId();
  const pet2Id = generateId();
  
  data.pets = [
    {
      id: pet1Id,
      name: 'Max',
      species: 'dog',
      breed: 'Golden Retriever',
      location: 'Mumbai',
      birthDate: '2021-03-15',
      age: '3 years',
      sex: 'male',
      weight: '32',
      activityLevel: 'high',
      dietaryPreferences: 'Premium kibble',
      allergies: 'None known',
      medicalConditions: 'None',
      specialCareInstructions: 'Daily exercise needed',
      vetName: 'Dr. Sarah Johnson',
      vetPhone: '+91 98765 43210',
      notes: 'Very friendly and loves water'
    },
    {
      id: pet2Id,
      name: 'Luna',
      species: 'cat',
      breed: 'Persian',
      location: 'Delhi',
      birthDate: '2022-07-20',
      age: '2 years',
      sex: 'female',
      weight: '4.2',
      activityLevel: 'low',
      dietaryPreferences: 'Wet food preferred',
      allergies: 'None known',
      notes: 'Shy but affectionate'
    }
  ];
  
  data.currentPetId = pet1Id;
  
  // Add sample vaccinations
  data.vaccinations = [
    {
      id: generateId(),
      petId: pet1Id,
      vaccineName: 'Rabies',
      administrationDate: '2024-01-15',
      nextDueDate: '2025-01-15',
      status: 'completed',
      notes: 'Annual booster'
    },
    {
      id: generateId(),
      petId: pet2Id,
      vaccineName: 'FVRCP',
      administrationDate: '2024-06-10',
      nextDueDate: '2025-06-10',
      status: 'upcoming'
    }
  ];
  
  // Add sample care tasks
  const today = new Date().toISOString().split('T')[0];
  data.careTasks = [
    { id: generateId(), petId: pet1Id, date: today, title: 'Morning walk', type: 'exercise', completed: false, time: '07:00' },
    { id: generateId(), petId: pet1Id, date: today, title: 'Breakfast', type: 'feeding', completed: true, time: '08:00' },
    { id: generateId(), petId: pet2Id, date: today, title: 'Feed Luna', type: 'feeding', completed: false, time: '09:00' }
  ];
  
  // Add sample expenses
  data.expenses = [
    { id: generateId(), petId: pet1Id, category: 'food', amount: 2500, date: '2024-10-01', description: 'Premium dog food' },
    { id: generateId(), petId: pet2Id, category: 'veterinary', amount: 1500, date: '2024-09-15', description: 'Annual checkup' }
  ];

  data.documentFolders = [
    { id: 'general', name: 'General' },
    { id: 'vaccines', name: 'Vaccines' },
    { id: 'bills', name: 'Bills' },
    { id: 'grooming', name: 'Grooming' }
  ];

  data.digitalRecords = [
    {
      id: generateId(),
      petId: pet1Id,
      folderId: 'vaccines',
      title: 'Annual Vaccination Card',
      category: 'vaccination',
      date: '2024-10-20',
      notes: 'Rabies and booster records',
      fileName: 'vaccination-card.pdf',
      fileType: 'application/pdf'
    },
    {
      id: generateId(),
      petId: pet1Id,
      folderId: 'general',
      title: 'X-Ray Summary',
      category: 'scan',
      date: '2024-10-18',
      notes: 'Chest scan summary from last checkup',
      fileName: 'xray-summary.png',
      fileType: 'image/png',
      dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAFlJcUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJ0UkGAAAAAElFTkSuQmCC'
    }
  ];
  
  saveData(data);
  return data;
}
