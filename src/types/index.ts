// User & Auth Types
export type UserRole = 'pet_owner' | 'veterinarian';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  email: string;
  created_at: string;
}

// Pet Types
export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string;
  age: string | null;
  gender: string | null;
  weight: string | null;
  color: string | null;
  country: string | null;
  card_number: string | null;
  sterilization_date: string | null;
  image_url: string | null;
  created_at: string;
}

// Vet Types
export interface Vet {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  bio: string | null;
  rating: number;
  image_url: string | null;
  created_at: string;
}

// Appointment Types
export type AppointmentStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  pet_id: string;
  vet_id: string;
  owner_id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  // Joined data (optional)
  pet?: Pet;
  vet?: Vet;
  owner?: Profile;
}

// Message Types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  appointment_id: string | null;
  content: string;
  created_at: string;
}

// Chat Thread (UI representation)
export interface ChatThread {
  id: string;
  participant: Profile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Rating Types
export interface Rating {
  id: string;
  appointment_id: string;
  owner_id: string;
  vet_id: string;
  score: number;
  created_at: string;
}

// Reminder Types
export type ReminderType = 'vaccination' | 'vaccine_expiry' | 'temperature';

export interface Reminder {
  id: string;
  vet_id: string;
  type: ReminderType;
  title: string;
  description: string | null;
  due_date: string;
  is_read: boolean;
  created_at: string;
}

// Navigation Types
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type OwnerTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type OwnerStackParamList = {
  OwnerTabs: undefined;
  VetDetails: { vetId: string };
  BookingConfirmation: { appointmentId: string };
  MyPets: undefined;
  AddPet: undefined;
  PetProfile: { petId: string };
  ChatConversation: { threadId: string; participantName: string };
  CallScreen: { vetId: string; vetName: string };
  CallEnd: { vetId: string; appointmentId: string };
  AccountInfo: undefined;
  TipsScreen: undefined;
};

export type VetTabParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  VetChat: undefined;
  VetAccount: undefined;
};

export type VetStackParamList = {
  VetTabs: undefined;
  TodayCases: undefined;
  PatientProfile: { petId: string };
  VetChatConversation: { threadId: string; participantName: string };
};

// Category type for home screen
export interface Category {
  id: string;
  name: string;
  icon: string;
}
