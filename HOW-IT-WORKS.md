# 📖 How the App Works — Code Explained

A beginner-friendly guide to understanding the Paws & Prognosis codebase.

---

## Table of Contents

1. [App Flow (Big Picture)](#app-flow-big-picture)
2. [React Native Components We Import](#react-native-components-we-import)
3. [State Management (useState, useEffect)](#state-management)
4. [Custom Hooks (Our Reusable Logic)](#custom-hooks)
5. [Context (Global State)](#context-global-state)
6. [Navigation (Moving Between Screens)](#navigation)
7. [Supabase (Our Backend)](#supabase-our-backend)
8. [NativeWind Styling](#nativewind-styling)
9. [TypeScript Types](#typescript-types)
10. [Putting It All Together (Screen Example)](#putting-it-all-together)

---

## App Flow (Big Picture)

```
User opens app
    │
    ▼
SplashScreen (loading...)
    │
    ▼
AuthContext checks: is user logged in?
    │
    ├── NO  → Show AuthNavigator (Login / SignUp)
    │
    └── YES → What role?
              ├── pet_owner     → OwnerNavigator (Home, Calendar, Chat, Profile tabs)
              └── veterinarian  → VetNavigator (Dashboard, Appointments, Chat, Account tabs)
```

The entire app flow is controlled by **one component**: `AppNavigator.tsx`

```tsx
// src/navigation/AppNavigator.tsx — simplified
export default function AppNavigator() {
  const { session, role, loading } = useAuth();  // Get auth state

  if (loading) return <SplashScreen />;           // Still checking? Show splash

  return (
    <NavigationContainer>
      {!session ? (                                // Not logged in?
        <AuthNavigator />                          //   → Show login/signup
      ) : role === 'veterinarian' ? (             // Logged in as vet?
        <VetNavigator />                           //   → Show vet dashboard
      ) : (                                        // Otherwise...
        <OwnerNavigator />                         //   → Show pet owner home
      )}
    </NavigationContainer>
  );
}
```

---

## React Native Components We Import

Every screen imports UI building blocks from React Native. Here's what each one does:

### Layout & Containers

| Component | What It Does | Example |
|-----------|-------------|---------|
| `View` | A box/container (like `<div>` in web) | Wrapping sections of a screen |
| `ScrollView` | A scrollable container | Long pages that don't fit one screen |
| `SafeAreaView` | Avoids phone notch/status bar | Top-level wrapper |

### Text & Input

| Component | What It Does | Example |
|-----------|-------------|---------|
| `Text` | Displays text (REQUIRED — can't just write text raw) | Labels, headings, paragraphs |
| `TextInput` | A text field the user can type in | Email, password, search bar |

### Interaction

| Component | What It Does | Example |
|-----------|-------------|---------|
| `TouchableOpacity` | A button that fades when pressed | Cards, buttons, links |
| `Pressable` | A more flexible touchable | Custom press animations |
| `Alert` | Native popup dialog | "Are you sure?" confirmations |

### Media & Feedback

| Component | What It Does | Example |
|-----------|-------------|---------|
| `Image` | Shows an image | Pet photos, vet avatars |
| `ActivityIndicator` | A loading spinner | While waiting for data |
| `RefreshControl` | Pull-to-refresh on ScrollView | Refreshing pet list |

### Example import at the top of a screen:

```tsx
import {
  View,          // Container
  Text,          // Text display
  ScrollView,    // Scrollable area
  TouchableOpacity,  // Tappable element
  TextInput,     // Input field
  Alert,         // Popup dialog
  ActivityIndicator, // Loading spinner
  Image,         // Image display
  RefreshControl,    // Pull to refresh
} from 'react-native';
```

### Third-Party Components We Also Use

```tsx
import { Ionicons } from '@expo/vector-icons';             // Icons (heart, search, arrow, etc.)
import { BlurView } from 'expo-blur';                      // Glass/blur effects on cards
import { Calendar } from 'react-native-calendars';         // Calendar widget
import * as ImagePicker from 'expo-image-picker';          // Camera & gallery access
```

---

## State Management

### What is State?

State = **data that can change** and triggers a re-render when it does.

### `useState` — Component-Level State

```tsx
const [search, setSearch] = useState('');           // Text input value
const [loading, setLoading] = useState(true);       // Is something loading?
const [pets, setPets] = useState<Pet[]>([]);        // Array of pets
const [selectedDate, setSelectedDate] = useState('2026-07-08');  // A selected value
```

**How it works:**
- `search` → the current value (read it)
- `setSearch` → function to update the value (write it)
- `useState('')` → initial value (empty string)

**Example — Search bar:**
```tsx
<TextInput
  value={search}                          // Display current value
  onChangeText={(text) => setSearch(text)} // Update when user types
  placeholder="Search vets..."
/>
```

### `useEffect` — Run Code When Something Changes

```tsx
// Run ONCE when screen loads (empty dependency array [])
useEffect(() => {
  fetchPets();  // Load pets from database
}, []);

// Run every time `selectedDate` changes
useEffect(() => {
  fetchAppointments(selectedDate);
}, [selectedDate]);
```

**Think of it as:** "When [dependency] changes, do [this thing]."

### `useCallback` — Remember a Function

```tsx
const fetchPets = useCallback(async () => {
  const { data } = await supabase.from('pets').select('*');
  setPets(data);
}, [user]);  // Only recreate this function if `user` changes
```

Prevents unnecessary re-renders. Used in hooks that pass functions to child components.

### `useMemo` — Remember a Computed Value

```tsx
const filteredVets = useMemo(() => {
  return allVets.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );
}, [allVets, search]);  // Only recompute when allVets or search changes
```

**Why?** Without `useMemo`, filtering would run on every single render (60 times/sec). With it, it only runs when the data actually changes.

---

## Custom Hooks

We put reusable logic in **custom hooks** (files in `src/hooks/`). They keep screens thin and clean.

### Pattern: A Custom Hook

```tsx
// src/hooks/usePets.ts — simplified
export function usePets() {
  const { user } = useAuth();                    // Get current user
  const [pets, setPets] = useState<Pet[]>([]);   // State for pets
  const [loading, setLoading] = useState(true);  // Loading state

  // Fetch pets from Supabase
  const fetchPets = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', user.id);         // Only MY pets (RLS also enforces this)
    setPets(data || []);
    setLoading(false);
  }, [user]);

  // Run on mount
  useEffect(() => { fetchPets(); }, [fetchPets]);

  // Return everything the screen needs
  return { pets, loading, fetchPets };
}
```

### Using it in a Screen:

```tsx
export default function MyPetsScreen() {
  const { pets, loading, fetchPets } = usePets();  // One line!

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </ScrollView>
  );
}
```

### All Our Hooks:

| Hook | What It Does |
|------|-------------|
| `usePets()` | CRUD for user's pets |
| `useAppointments()` | Book, cancel, reschedule appointments |
| `useVets()` | Fetch all vets from database |
| `useChat()` | Real-time messaging with Supabase Realtime |
| `useRatings()` | Rate completed appointments |
| `useReminders()` | Vet-side reminders (vaccination, etc.) |
| `useVetAppointments()` | Vet's appointment management |
| `useFavoriteVets()` | Save/load favorite vets locally |
| `useNetworkStatus()` | Detect online/offline |
| `useSessionMonitor()` | Watch for expired sessions |
| `useAvatarUpload()` | Upload profile photos |

---

## Context (Global State)

**Problem:** Many screens need the same data (who is logged in?). Passing it through every component is messy.

**Solution:** React Context = a "global variable" that any component can access.

### AuthContext — Our Only Context

```tsx
// What it provides to the whole app:
interface AuthContextType {
  session: Session | null;      // Supabase session (token, expiry)
  user: User | null;            // Auth user (id, email)
  profile: Profile | null;      // Our profile data (name, role, avatar)
  role: UserRole | null;        // 'pet_owner' or 'veterinarian'
  loading: boolean;             // Still checking auth?
  signUp: (...) => Promise;     // Register function
  signIn: (...) => Promise;     // Login function
  signOut: () => Promise;       // Logout function
  refreshProfile: () => Promise; // Reload profile data
}
```

### How it wraps the app (in App.tsx):

```tsx
<AuthProvider>          {/* Provides auth to everything inside */}
  <AppNavigator />      {/* All screens can now use useAuth() */}
</AuthProvider>
```

### Using it in any screen:

```tsx
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  return (
    <View>
      <Text>Hello, {profile?.name}!</Text>
      <Button onPress={signOut} title="Log Out" />
    </View>
  );
}
```

---

## Navigation

We use **React Navigation** with two patterns:

### Stack Navigator (screens that stack on top of each other)

```
Home → VetDetails → Booking → (back to Home)
```

```tsx
// Navigate forward
navigation.navigate('VetDetails', { vetId: '123' });

// Go back
navigation.goBack();

// Go all the way back to root
navigation.popToTop();
```

### Tab Navigator (bottom tab bar)

```
[Home]  [Calendar]  [Chat]  [Profile]
```

Pet owners get 4 tabs, vets get 4 different tabs.

### Getting Navigation Params:

```tsx
// Screen receives params via route
const route = useRoute<RouteProp<OwnerStackParamList, 'VetDetails'>>();
const { vetId } = route.params;  // Access the vetId passed from previous screen
```

---

## Supabase (Our Backend)

Supabase replaces a traditional server. It gives us:

| Feature | What We Use It For |
|---------|-------------------|
| **Auth** | Login, signup, sessions |
| **Database** | Storing pets, appointments, messages, etc. |
| **Realtime** | Live chat (messages appear instantly) |
| **Storage** | Pet and avatar image uploads |

### Basic CRUD Operations:

```tsx
// READ — Get all my pets
const { data, error } = await supabase
  .from('pets')
  .select('*')
  .eq('owner_id', userId);

// CREATE — Add a new pet
const { data, error } = await supabase
  .from('pets')
  .insert({ name: 'Bantay', species: 'Dog', breed: 'Aspin', owner_id: userId })
  .select()
  .single();

// UPDATE — Change appointment status
const { error } = await supabase
  .from('appointments')
  .update({ status: 'cancelled' })
  .eq('id', appointmentId);

// DELETE — Remove a pet
const { error } = await supabase
  .from('pets')
  .delete()
  .eq('id', petId);
```

### Real-time Chat:

```tsx
// Subscribe to new messages in real-time
const channel = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',                          // When a new row is inserted
    schema: 'public',
    table: 'messages',
    filter: `receiver_id=eq.${myUserId}`,     // Only messages FOR me
  }, (payload) => {
    setMessages((prev) => [...prev, payload.new]);  // Add to screen instantly
  })
  .subscribe();
```

### Row Level Security (RLS):

Even if someone tries to hack the API, Supabase blocks them:
- You can only read YOUR pets
- You can only see messages WHERE you are the sender or receiver
- Vets can only see appointments assigned to them

---

## NativeWind Styling

Instead of `StyleSheet.create()`, we use **Tailwind CSS classes** via the `className` prop:

```tsx
// ❌ Old way (DON'T use this)
<View style={{ flex: 1, backgroundColor: '#FEF9F4', padding: 20 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#544864' }}>Hello</Text>
</View>

// ✅ Our way (NativeWind)
<View className="flex-1 bg-beige px-5">
  <Text className="text-2xl font-bold text-heading">Hello</Text>
</View>
```

### Common Classes We Use:

| Class | What It Does |
|-------|-------------|
| `flex-1` | Take up all available space |
| `flex-row` | Horizontal layout (default is vertical) |
| `items-center` | Center children horizontally |
| `justify-center` | Center children vertically |
| `px-5` | Padding left & right (20px) |
| `mt-4` | Margin top (16px) |
| `rounded-card` | Our custom border radius (16px) |
| `bg-beige` | Our beige background color |
| `text-heading` | Our purple heading color |
| `text-primary` | Our green primary color |

### Dynamic Styling:

```tsx
<TouchableOpacity
  className={`px-4 py-2 rounded-btn ${
    isActive ? 'bg-primary' : 'bg-input-bg'
  }`}
>
  <Text className={isActive ? 'text-white' : 'text-grey'}>
    {label}
  </Text>
</TouchableOpacity>
```

---

## TypeScript Types

We define **shapes** for our data in `src/types/index.ts`:

```tsx
// What a Pet looks like
export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: string;     // "Dog", "Cat", etc.
  breed: string;       // "Aspin", "Shih Tzu", etc.
  age: string | null;  // nullable — might not be filled in
  image_url: string | null;
  created_at: string;
}

// What a Vet looks like
export interface Vet {
  id: string;
  user_id: string;
  name: string;
  specialty: string;   // "General Practice", "Surgery", etc.
  rating: number;      // 1-5
  bio: string | null;
}

// User roles — can only be one of these two
export type UserRole = 'pet_owner' | 'veterinarian';

// Appointment status — can only be one of these four
export type AppointmentStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
```

**Why?** TypeScript catches bugs before you run the app:
```tsx
pet.naem  // ❌ ERROR: Property 'naem' does not exist. Did you mean 'name'?
```

---

## Putting It All Together

Here's how a screen is built, step by step:

```tsx
// 1. IMPORTS — what tools do we need?
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useVets } from '../../hooks/useVets';
import { useAuth } from '../../context/AuthContext';

// 2. COMPONENT — the screen itself
export default function HomeScreen() {

  // 3. HOOKS — get data and functions
  const navigation = useNavigation();
  const { profile } = useAuth();                    // Who am I?
  const { vets, loading, fetchVets } = useVets();   // Get vet list
  const [search, setSearch] = useState('');          // Search input state

  // 4. DERIVED DATA — computed from state
  const filteredVets = useMemo(() =>
    vets.filter((v) => v.name.toLowerCase().includes(search.toLowerCase())),
    [vets, search]
  );

  // 5. EVENT HANDLERS — what happens on user action
  async function onRefresh() {
    await fetchVets();  // Re-fetch from Supabase
  }

  function onVetPress(vet: Vet) {
    navigation.navigate('VetDetails', { vetId: vet.id });  // Go to detail page
  }

  // 6. RENDER — what the user sees
  return (
    <ScrollView
      className="flex-1 bg-beige"
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <Text className="text-xl font-bold text-heading px-5 mt-14">
        Hello, {profile?.name} 👋
      </Text>

      {/* Search */}
      <TextInput
        className="bg-input-bg rounded-btn px-4 py-3 mx-5 mt-4"
        value={search}
        onChangeText={setSearch}
        placeholder="Search vets..."
      />

      {/* Vet List */}
      {filteredVets.map((vet) => (
        <TouchableOpacity key={vet.id} onPress={() => onVetPress(vet)}>
          <Text className="text-dark font-semibold">{vet.name}</Text>
          <Text className="text-grey">{vet.specialty}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
```

---

## Summary — The Mental Model

```
┌─────────────────────────────────────────────────────┐
│  SCREEN (.tsx file)                                  │
│                                                     │
│  1. Import React Native components (View, Text...) │
│  2. Import custom hooks (useVets, usePets...)       │
│  3. Declare state (useState)                        │
│  4. Fetch data on mount (useEffect)                 │
│  5. Compute derived values (useMemo)                │
│  6. Handle user actions (press, type, swipe)        │
│  7. Return JSX with className styling               │
│                                                     │
│  Data flow:                                         │
│  Supabase → Hook → State → Screen → User sees it  │
│  User taps → Handler → Supabase → State updates    │
└─────────────────────────────────────────────────────┘
```

Every screen in this app follows this exact same pattern. Once you understand one, you understand all of them.
