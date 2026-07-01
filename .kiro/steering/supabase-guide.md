---
inclusion: fileMatch
fileMatchPattern: "**/lib/supabase*,**/hooks/use*,**/context/Auth*"
---

# Supabase Integration Guide

## Database Schema

### Tables
```sql
-- Users are managed by Supabase Auth (auth.users)
-- Profile data stored in public.profiles
profiles (id uuid PK references auth.users, name text, role text CHECK (role IN ('pet_owner', 'veterinarian')), avatar_url text, phone text, created_at timestamptz)

pets (id uuid PK, owner_id uuid FK profiles, name text NOT NULL, species text NOT NULL, breed text NOT NULL, age text, gender text, weight text, color text, country text, card_number text, sterilization_date date, image_url text, created_at timestamptz)

vets (id uuid PK, user_id uuid FK profiles, name text, specialty text, bio text, rating numeric(2,1), image_url text, created_at timestamptz)

appointments (id uuid PK, pet_id uuid FK pets, vet_id uuid FK vets, owner_id uuid FK profiles, date date NOT NULL, time time NOT NULL, status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')), notes text, created_at timestamptz)

messages (id uuid PK, sender_id uuid FK profiles, receiver_id uuid FK profiles, appointment_id uuid FK appointments NULL, content text NOT NULL, created_at timestamptz)

ratings (id uuid PK, appointment_id uuid FK appointments, owner_id uuid FK profiles, vet_id uuid FK vets, score integer CHECK (score >= 1 AND score <= 5), created_at timestamptz)

reminders (id uuid PK, vet_id uuid FK vets, type text CHECK (type IN ('vaccination', 'vaccine_expiry', 'temperature')), title text, description text, due_date date, is_read boolean DEFAULT false, created_at timestamptz)
```

### Row Level Security
- profiles: Users can read all profiles, update only their own
- pets: Owners can CRUD their own pets; vets can read pets of their patients
- appointments: Owners see their own; vets see appointments assigned to them
- messages: Users can read/write messages where they are sender or receiver
- ratings: Owners can create; vets can read their own ratings

## Client Setup
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## Auth Pattern
- Use `supabase.auth.signUp()` for email registration
- Use `supabase.auth.signInWithPassword()` for email login
- Use `supabase.auth.signInWithOAuth()` for Google (dev build only)
- Listen to auth state with `supabase.auth.onAuthStateChange()`
- After signup, create a corresponding row in `profiles` table

## Realtime Pattern (Chat)
```typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `receiver_id=eq.${userId}`,
  }, (payload) => {
    // Handle new message
  })
  .subscribe();
```
