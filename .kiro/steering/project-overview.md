---
inclusion: always
---

# Paws & Prognosis — Project Overview

## What This Is
A veterinary clinic appointment & care mobile app built with React Native (Expo) and Supabase. Two user roles: Pet Owner and Veterinarian.

## Tech Stack (STRICT — do not deviate)
- **Framework:** React Native with Expo SDK 54 (Expo Go compatible)
- **Language:** TypeScript
- **Styling:** NativeWind v4 (Tailwind CSS for React Native) — use `className` prop
- **Navigation:** @react-navigation/native, @react-navigation/native-stack, @react-navigation/bottom-tabs
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Local Storage:** @react-native-async-storage/async-storage
- **Camera/Gallery:** expo-image-picker
- **Calendar UI:** react-native-calendars
- **Icons:** @expo/vector-icons (Ionicons, MaterialCommunityIcons, FontAwesome)
- **Blur/Glass effects:** expo-blur (BlurView)
- **Animations:** react-native-reanimated
- **Forms:** react-hook-form + zod for validation
- **Deployment:** Expo Go (development), EAS Build (production)

## Project Structure
```
src/
├── navigation/        # Navigator configs (AuthStack, OwnerTabs, VetTabs)
├── screens/
│   ├── auth/          # Login, SignUp, ForgotPassword, Splash
│   ├── owner/         # Home, VetDetails, Booking, Calendar, MyPets, AddPet, EditPet,
│   │                  # PetProfile, ChatList, Profile, Rating, Tips, Reschedule
│   ├── vet/           # Dashboard, Appointments, ChatList, Account
│   └── shared/        # SharedChatConversation, EditProfile
├── components/        # Reusable UI: cards, buttons, modals, inputs
├── hooks/             # Custom hooks (usePets, useAppointments, useChat, useVets, etc.)
├── lib/               # Supabase client, helpers, constants, schemas, formatters
├── context/           # AuthContext
├── types/             # TypeScript interfaces and types
└── __tests__/         # Unit tests (formatters, notesHelper)
```

## Config Files
- `tailwind.config.js` — Design tokens (colors, radii, fonts)
- `babel.config.js` — NativeWind babel preset
- `metro.config.js` — NativeWind metro plugin
- `global.css` — Tailwind directives
- `nativewind-env.d.ts` — TypeScript types for className

## Design System (from Figma)
- **Background:** cream `rgba(248, 224, 196, 0.3)`, beige `#FEF9F4`
- **Primary accent:** Green `#71924F` (CTAs, active states)
- **Primary border:** `#7BBD38` (bright green accents)
- **Text heading:** `#544864` (purple-dark)
- **Text body:** `#343434`
- **Text grey:** `#808080`
- **Input background:** `#F5F5F5`
- **Placeholder text:** `#AA865D` (warm brown, italic)
- **Cards:** Glassmorphism via expo-blur + white/40 overlay
- **Navigation:** Bottom tab bar with 4 tabs, rounded-nav top corners

## Key Constraints
- Expo Go SDK 54 compatible — no native modules that break Expo Go
- Google OAuth requires development build (NOT compatible with Expo Go)
- Video/voice calling is UI mockup only — no real WebRTC
- Target: Philippines locale (phone +63)
- All data persisted to Supabase; AsyncStorage for session/cache only
- expo-image-picker is a REQUIRED integration (grading criteria)
- DO NOT use StyleSheet.create() — use NativeWind className instead
