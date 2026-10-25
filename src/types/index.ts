export interface Pet {
  id: string;
  name: string;
  photo?: string;
  emoji?: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  location?: string;
  birthDate?: string;
  age?: string;
  sex: 'male' | 'female' | 'unknown';
  weight?: string;
  activityLevel?: 'low' | 'medium' | 'high';
  dietaryPreferences?: string;
  allergies?: string;
  medicalConditions?: string;
  specialCareInstructions?: string;
  vetName?: string;
  vetPhone?: string;
  vetEmail?: string;
  notes?: string;
  createdAt: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  administrationDate: string;
  nextDueDate?: string;
  status: 'completed' | 'upcoming' | 'overdue';
  notes?: string;
}

export interface Medication {
  id: string;
  petId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  timeOfDay?: string;
  status: 'active' | 'completed' | 'missed';
  notes?: string;
}

export interface VetVisit {
  id: string;
  petId: string;
  visitDate: string;
  reason: string;
  vetName?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

export interface WeightRecord {
  id: string;
  petId: string;
  date: string;
  weight: string;
  notes?: string;
}

export interface MealLog {
  id: string;
  petId: string;
  date: string;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  quantity: string;
  unit: string;
  notes?: string;
}

export interface WaterLog {
  id: string;
  petId: string;
  date: string;
  time: string;
  quantity: string;
  unit: string;
  notes?: string;
}

export interface ExerciseLog {
  id: string;
  petId: string;
  date: string;
  time: string;
  activityType: string;
  duration: string;
  distance?: string;
  notes?: string;
}

export interface CareTask {
  id: string;
  petId: string;
  date: string;
  title: string;
  type: 'feeding' | 'medication' | 'exercise' | 'grooming' | 'other';
  completed: boolean;
  time?: string;
}

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  date: string;
  type: 'vaccination' | 'medication' | 'appointment' | 'other';
  completed: boolean;
  notes?: string;
}

export interface Appointment {
  id: string;
  petId: string;
  serviceId?: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  contactName?: string;
  contactPhone?: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'veterinary' | 'grooming' | 'daycare' | 'boarding' | 'walking' | 'at-home';
  image?: string;
  description: string;
  location?: string;
  phone?: string;
  email?: string;
  priceRange?: string;
  availability?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'food' | 'toys' | 'grooming' | 'accessories' | 'health';
  petType: 'dog' | 'cat' | 'bird' | 'all';
  image?: string;
  description: string;
  price: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  status: 'confirmed';
  createdAt: string;
}

export interface AdoptionPet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  age: string;
  gender: 'male' | 'female';
  location: string;
  image?: string;
  description: string;
  contactInfo?: string;
}

export interface AdoptionInterest {
  id: string;
  adoptionPetId: string;
  name: string;
  email: string;
  phone: string;
  livingSituation: string;
  message: string;
  createdAt: string;
}

export interface PetPlace {
  id: string;
  name: string;
  category: 'park' | 'cafe' | 'restaurant' | 'hotel' | 'store' | 'other';
  location: string;
  image?: string;
  description: string;
  petFriendlyNotes: string;
}

export interface LostFoundReport {
  id: string;
  type: 'lost' | 'found';
  petName?: string;
  species: string;
  breed?: string;
  color?: string;
  lastSeenLocation: string;
  date: string;
  photo?: string;
  contactMethod: string;
  additionalNotes?: string;
  createdAt: string;
  ownerId?: string;
}

export interface GuideArticle {
  id: string;
  title: string;
  category: 'nutrition' | 'grooming' | 'training' | 'preventive' | 'new-pet';
  summary: string;
  content: string;
  image?: string;
}

export interface Expense {
  id: string;
  petId?: string;
  category: 'food' | 'veterinary' | 'grooming' | 'medication' | 'toys' | 'other';
  amount: number;
  date: string;
  description: string;
  notes?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
}

export interface DigitalRecord {
  id: string;
  petId: string;
  folderId: string;
  title: string;
  category: 'vaccination' | 'prescription' | 'lab' | 'scan' | 'invoice' | 'other';
  date: string;
  notes: string;
  fileName: string;
  fileType: string;
  dataUrl?: string;
}

export interface AppData {
  pets: Pet[];
  vaccinations: Vaccination[];
  medications: Medication[];
  vetVisits: VetVisit[];
  weightRecords: WeightRecord[];
  mealLogs: MealLog[];
  waterLogs: WaterLog[];
  exerciseLogs: ExerciseLog[];
  careTasks: CareTask[];
  reminders: Reminder[];
  appointments: Appointment[];
  cart: CartItem[];
  orders: Order[];
  favorites: { adoption: string[]; places: string[]; guides: string[] };
  adoptionInterests: AdoptionInterest[];
  lostFoundReports: LostFoundReport[];
  expenses: Expense[];
  digitalRecords: DigitalRecord[];
  documentFolders: DocumentFolder[];
  currentPetId: string | null;
  settings: {
    theme: 'light';
    currency: 'INR';
    location: string;
  };
}
