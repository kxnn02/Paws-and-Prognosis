# 📊 Paws & Prognosis — Project Status

> Last updated: July 1, 2026

---

## Screens Overview

### Auth Flow
| Screen | Status | Notes |
|--------|--------|-------|
| Splash (loading) | ✅ Complete | NativeWind styled |
| Login (email/password) | ✅ Complete | Validation, show/hide password |
| Sign Up (with role) | ✅ Complete | Email confirmation handling |
| Google OAuth | ⚠️ UI only | Shows "Coming Soon" — requires dev build |

### Pet Owner Screens
| Screen | Status | Notes |
|--------|--------|-------|
| Home | ✅ Complete | Live vet data from Supabase, search, categories, loading state, empty state |
| Vet Details | ✅ Complete | Profile card, rating, about, working hours, Message + Contact Clinic |
| Booking | ✅ Complete | 14-day picker, time slots, pet selector, notes field, summary, Supabase persist |
| Calendar | ✅ Complete | react-native-calendars, pull-to-refresh, cancel with confirm, rate completed |
| My Pets | ✅ Complete | Pet list, empty state, FAB |
| Add Pet | ✅ Complete | expo-image-picker (camera/gallery), react-hook-form + zod validation |
| Pet Profile | ✅ Complete | Detail view, info grid, delete with confirm |
| Profile | ✅ Complete | User info, menu (My Pets, Account Info, Notifications, Help) |
| Chat List | ✅ Complete | Thread list with Supabase Realtime |
| Chat Conversation | ✅ Complete | Bubbles, auto-scroll, sent indicators, privacy notice |
| Rating | ✅ Complete | 1-5 stars, updates vet average |
| Tips | ✅ Complete | Pet care tips and tricks |
| Edit Profile | ✅ Complete | Name, phone — refreshes AuthContext |

### Vet Screens
| Screen | Status | Notes |
|--------|--------|-------|
| Dashboard | ✅ Complete | Stats, reminders, today's cases with actions, upcoming, pull-to-refresh |
| Appointments | ✅ Complete | Calendar, filter tabs, status management, message, pull-to-refresh |
| Chat List | ✅ Complete | Thread list with Realtime |
| Chat Conversation | ✅ Complete | Same quality as owner side |
| Account | ✅ Complete | Profile, Edit Profile, menu with feedback |

---

## Integrations

| Integration | Status |
|-------------|--------|
| Supabase Auth (email/password) | ✅ Working |
| Supabase CRUD (pets, appointments, ratings, reminders) | ✅ Working |
| Supabase Storage (pet images) | ✅ Working |
| Supabase Realtime (chat) | ✅ Working |
| expo-image-picker (camera + gallery) | ✅ Integrated |
| react-native-calendars | ✅ Integrated |
| react-hook-form + zod | ✅ Integrated |
| NativeWind v4 | ✅ Throughout |
| Contact Clinic (Linking — phone, viber, messenger) | ✅ Working |
| Google OAuth | ❌ Requires EAS dev build |

---

## Security & Privacy

- Row Level Security (RLS) on all tables
- Messages: users can only read/write their own conversations
- Sender verification: prevents impersonation via RLS INSERT policy
- Input sanitization: messages capped at 2,000 chars, forms validated with zod
- No local message persistence beyond React state
- No secrets or API keys in code (env vars only)
- Email confirmation flow for account verification
- Profile updates scoped to authenticated user

---

## Database Tables (all with RLS)

| Table | Policies |
|-------|----------|
| profiles | Read own, update own |
| pets | Full CRUD for own records |
| vets | Public read for authenticated users |
| appointments | Owner: read/insert/update own; Vet: read/update assigned |
| messages | Read where sender or receiver; insert as sender only |
| ratings | Insert own; public read |
| reminders | Vet: read/update own |

---

## Tech Stack

- **Framework:** React Native + Expo SDK 54 (Expo Go compatible)
- **Language:** TypeScript (strict, no `any`)
- **Styling:** NativeWind v4 (`className` prop, no StyleSheet.create)
- **Navigation:** React Navigation 6 (native-stack + bottom-tabs)
- **Backend:** Supabase (Auth, Database, Storage, Realtime)
- **Forms:** react-hook-form + zod
- **Calendar:** react-native-calendars
- **Camera:** expo-image-picker
- **Icons:** @expo/vector-icons (Ionicons)

---

## UX Features

- Pull-to-refresh on all data-heavy screens
- useFocusEffect for data freshness after navigation
- Loading spinners for all async operations
- Confirmation dialogs for destructive actions
- Empty states with helpful messaging
- "Coming soon" feedback for unimplemented features
- Back buttons on all error/not-found states
- Sent indicators on chat messages
- Date separators in chat conversations
- Booking notes for symptom description
