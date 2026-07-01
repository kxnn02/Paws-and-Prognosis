---
inclusion: always
---

# Paws & Prognosis — Project Overview

## What This Is
A veterinary clinic appointment & care mobile app built with React Native (Expo) and Supabase. Two user roles: Pet Owner and Veterinarian.

## Tech Stack (STRICT — do not deviate)
- **Framework:** React Native with Expo (Development Build, NOT Expo Go for final)
- **Language:** TypeScript
- **Navigation:** @react-navigation/native, @react-navigation/native-stack, @react-navigation/bottom-tabs
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Local Storage:** @react-native-async-storage/async-storage
- **Camera/Gallery:** expo-image-picker
- **Calendar UI:** react-native-calendars
- **Icons:** @expo/vector-icons (Ionicons, MaterialCommunityIcons, FontAwesome)
- **Forms:** react-hook-form + zod for validation
- **Deployment:** Expo development build (npx expo run:android)

## Project Structure
```
src/
├── navigation/        # Navigator configs (AuthStack, OwnerTabs, VetTabs)
├── screens/
│   ├── auth/          # Login, SignUp, Splash
│   ├── owner/         # Home, VetDetails, Booking, Calendar, Chat, MyPets, PetProfile, Account
│   └── vet/           # Dashboard, TodayCases, Appointments, PatientProfile, Chat, Account
├── components/        # Reusable UI: cards, buttons, modals, inputs
├── hooks/             # Custom hooks (useAuth, usePets, useAppointments, useChat)
├── lib/               # Supabase client, helpers, constants
├── context/           # AuthContext, ThemeContext
├── types/             # TypeScript interfaces and types
└── assets/            # Images, fonts, illustrations
```

## Design System
- **Background:** Cream/beige (#FFF8F0 or similar warm tone)
- **Primary accent:** Green (for CTAs, active states)
- **Cards:** Rounded corners (border-radius: 16), subtle shadow
- **Typography:** Sans-serif, consistent heading/body hierarchy
- **Navigation:** Bottom tab bar with 4 tabs, stack navigation within each tab
- **Decorative:** Paw-shaped ellipses, cat/dog vector illustrations

## Key Constraints
- Google OAuth requires development build (NOT compatible with Expo Go)
- Video/voice calling is UI mockup only — no real WebRTC
- Target: Philippines locale (phone +63, but no currency needed for MVP)
- All data persisted to Supabase; AsyncStorage for session/cache only
- expo-image-picker is a REQUIRED integration (grading criteria)
