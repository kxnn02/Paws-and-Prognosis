# 📊 Paws & Prognosis — Project Status

> Last updated: July 1, 2026

---

## Screens Overview

### Auth Flow
| Screen | Status | Owner |
|--------|--------|-------|
| Splash (loading) | ✅ Complete | — |
| Login (email/password) | ✅ Complete | — |
| Sign Up (with role) | ✅ Complete | — |
| Google OAuth | ❌ Requires dev build | — |

### Pet Owner Screens
| Screen | Status | Notes |
|--------|--------|-------|
| Home | ✅ Complete | Banner, categories, search, vet grid |
| Vet Details | ✅ Complete | Profile card, date/time picker, pet selector, Supabase booking |
| Calendar | ✅ Complete | react-native-calendars, marked dates, appointment list, cancel |
| My Pets | ✅ Complete | Pet list cards, empty state, FAB |
| Add Pet | ✅ Complete | Form + expo-image-picker (camera/gallery), zod validation |
| Pet Profile | ✅ Complete | Detail view, info grid, delete |
| Profile | ✅ Complete | User info, menu navigation, logout |
| Chat List | 🟡 Placeholder | UI only — no realtime yet |
| Chat Conversation | ❌ Not started | — |
| Call Screen | ❌ Not started | UI mockup only (no WebRTC) |

### Vet Screens
| Screen | Status | Notes |
|--------|--------|-------|
| Dashboard | 🟡 Placeholder | Title text only |
| Appointments | 🟡 Placeholder | Title text only |
| Chat List | 🟡 Placeholder | Title text only |
| Account | 🟡 Placeholder | Title text only |
| Today's Cases | ❌ Not started | — |
| Patient Profile | ❌ Not started | — |

---

## Integrations

| Integration | Status | Notes |
|-------------|--------|-------|
| Supabase Auth (email/password) | ✅ Working | Login + Sign Up |
| Supabase CRUD (pets table) | ✅ Working | Insert, read, delete |
| Supabase CRUD (appointments) | ✅ Working | Book, fetch, cancel |
| Supabase Storage (pet images) | ✅ Working | Upload via expo-image-picker |
| Supabase Realtime (chat) | ❌ Not started | — |
| expo-image-picker | ✅ Integrated | Camera + gallery |
| react-native-calendars | ✅ Integrated | Calendar screen |
| react-hook-form + zod | ✅ Integrated | Add Pet form |
| NativeWind v4 | ✅ Throughout | All screens use className |
| Google OAuth | ❌ Blocked | Requires EAS dev build |

---

## Database Tables

| Table | RLS | Used By |
|-------|-----|---------|
| profiles | ✅ | Auth, Profile screen |
| pets | ⚠️ Needs policies | My Pets, Add Pet, Pet Profile |
| appointments | ⚠️ Needs policies | Booking, Calendar |
| vets | ✅ | Home, Vet Details |
| messages | ⚠️ Needs policies | Chat (not built yet) |
| ratings | ⚠️ Needs policies | Rating (not built yet) |
| reminders | ⚠️ Needs policies | Vet reminders (not built yet) |

---

## Remaining Work (Priority Order)

1. **Chat flow** — Realtime messaging (owner ↔ vet) via Supabase Realtime
2. **Vet Dashboard** — Today's cases, stats, quick actions
3. **Vet Appointments** — View/manage bookings assigned to them
4. **Call screen** — UI mockup (video/voice placeholder)
5. **Rating system** — Post-appointment vet rating
6. **Notifications/Reminders** — Vet-side reminders display
7. **Account/Settings** — Edit profile, change password

---

## Branch Status

| Branch | Status | Description |
|--------|--------|-------------|
| `main` | Protected | Auth + Home screens |
| `feature/owner-core-screens` | Pushed, awaiting PR | Vet Details, Pets, Calendar, Booking |

---

## Tech Stack Quick Reference

- **Framework:** React Native + Expo SDK 54 (Expo Go compatible)
- **Language:** TypeScript (strict, no `any`)
- **Styling:** NativeWind v4 (`className` prop, no StyleSheet.create)
- **Navigation:** React Navigation 6 (native-stack + bottom-tabs)
- **Backend:** Supabase (Auth, Database, Storage, Realtime)
- **Forms:** react-hook-form + zod
- **Calendar:** react-native-calendars
- **Camera:** expo-image-picker
