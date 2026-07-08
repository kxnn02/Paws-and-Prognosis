# 🐾 Paws & Prognosis — Team Setup Guide

Welcome to the team! Follow this guide to get the app running on your machine.

---

## Prerequisites (Install These First)

| Tool | Download | Why |
|------|----------|-----|
| **Node.js 18+** | https://nodejs.org (LTS version) | Runs JavaScript/TypeScript |
| **Git** | https://git-scm.com/downloads | Version control |
| **VS Code** | https://code.visualstudio.com | Code editor |
| **Expo Go** (phone app) | Play Store / App Store | Runs the app on your phone |

Optional:
| **Android Studio** | https://developer.android.com/studio | Android emulator |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/kxnn02/Paws-and-Prognosis.git
cd Paws-and-Prognosis
```

---

## Step 2: Install Dependencies

```bash
npm install
```

---

## Step 3: Set Up Environment Variables

```bash
# Windows (CMD)
copy .env.example .env

# Windows (PowerShell / Git Bash)
cp .env.example .env
```

Open `.env` and fill in the Supabase credentials (ask the team lead for these):

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

> ⚠️ NEVER commit the `.env` file. It's already in `.gitignore`.

---

## Step 4: Run the App

```bash
npx expo start
```

You'll see a QR code in your terminal.

---

## Step 5: Open on Your Phone

1. Open **Expo Go** app on your phone
2. Scan the QR code from your terminal
3. The app should load!

### ⚠️ Phone and laptop MUST be on the same network

| Method | How |
|--------|-----|
| **Phone Hotspot** (recommended) | Turn on your phone's hotspot → connect your laptop to it → `npx expo start` → scan QR |
| **USB Tethering** | Plug phone into laptop via USB → enable USB tethering → `npx expo start` → scan QR |
| **Android Emulator** | Open Android Studio → start a virtual device → `npx expo start` → press `a` |

---

## Test Accounts

All test accounts are pre-created in Supabase. See [TEST-ACCOUNTS.md](./TEST-ACCOUNTS.md) for credentials.

Quick reference — password for all: `Paws2026!`

| Role | Email |
|------|-------|
| Vet | dr.santos@pawsvet.com |
| Vet | dr.cruz@pawsvet.com |
| Vet | dr.garcia@pawsvet.com |
| Vet | dr.reyes@pawsvet.com |
| Vet | dr.lim@pawsvet.com |
| Owner | maria.owner@test.com |
| Owner | juan.owner@test.com |

---

## Project Structure

```
src/
├── navigation/        # Stack and tab navigators (Auth, Owner, Vet)
├── screens/
│   ├── auth/          # Login, SignUp, ForgotPassword, Splash
│   ├── owner/         # Home, VetDetails, Booking, Calendar, MyPets, AddPet,
│   │                  # EditPet, PetProfile, ChatList, Profile, Rating, Tips, Reschedule
│   ├── vet/           # Dashboard, Appointments, ChatList, Account
│   └── shared/        # SharedChatConversation, EditProfile
├── components/        # Reusable UI (Button, Card, VetCard, SearchBar, Avatar, etc.)
├── hooks/             # Custom hooks (usePets, useAppointments, useChat, useVets, etc.)
├── lib/               # Supabase client, schemas, constants, helpers, formatters
├── context/           # AuthContext
├── types/             # TypeScript interfaces
└── __tests__/         # Unit tests (formatters, notesHelper)
```

---

## Git Workflow

### Starting new work:

```bash
git checkout main
git pull origin main
git checkout -b feature/my-feature
```

### While working:

```bash
git add -A
git commit -m "feat(scope): what you did"
```

### When done — push and open a PR:

```bash
git checkout main
git pull origin main
git checkout feature/my-feature
git merge main
# Fix any conflicts
git push -u origin feature/my-feature
```

Then go to GitHub → your branch → **Create Pull Request** → assign a reviewer.

### Commit message format:

```
feat(home): add vet card grid
fix(calendar): correct date display
chore(deps): install new library
refactor(chat): extract message bubble component
```

### Branch naming:

- `feature/screen-name` — new screen or feature
- `fix/bug-description` — bug fix
- `chore/task-description` — config, dependency, cleanup

---

## Common Commands

| Command | What it does |
|---------|-------------|
| `npx expo start` | Start the dev server |
| `npx expo start --clear` | Start with cleared cache |
| `npx tsc --noEmit` | Check for TypeScript errors |
| `npm test` | Run unit tests |
| `npm run lint` | Run ESLint |

---

## Troubleshooting

### "Module not found" after pulling
```bash
npm install
```

### App won't load on phone
- Same network? Try phone hotspot.
- Press `r` in terminal to reload.
- Try `npx expo start --clear`

### TypeScript errors
```bash
npx tsc --noEmit
```

### Merge conflicts
- Open file in VS Code → look for `<<<<<<<` markers → choose what to keep → save → `git add` → `git commit`

---

## Current Status

All screens are **complete and functional**. See [STATUS.md](./STATUS.md) for detailed progress.

### Completed Features
- ✅ Auth flow (Login, SignUp, ForgotPassword, Splash)
- ✅ Pet Owner: Home, VetDetails, Booking, Calendar, MyPets, AddPet, EditPet, PetProfile
- ✅ Pet Owner: ChatList, Chat Conversation, Profile, Rating, Tips, Reschedule
- ✅ Veterinarian: Dashboard, Appointments, ChatList, Chat Conversation, Account
- ✅ Shared: EditProfile, SharedChatConversation
- ✅ All Supabase integrations (Auth, CRUD, Storage, Realtime)
- ✅ expo-image-picker (camera + gallery)
- ✅ react-native-calendars
- ✅ Row Level Security on all tables

---

## Questions?

Ask in the group chat before spending too long stuck on something. Happy coding! 🐕🐈
