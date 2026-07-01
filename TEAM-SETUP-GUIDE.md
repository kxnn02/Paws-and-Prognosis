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

Optional (for emulator):
| **Android Studio** | https://developer.android.com/studio | Android emulator |

---

## Step 1: Clone the Repository

Open your terminal (Git Bash, PowerShell, or CMD):

```bash
git clone https://github.com/kxnn02/Paws-and-Prognosis.git
cd Paws-and-Prognosis
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This takes 1-2 minutes. Wait for it to finish completely.

---

## Step 3: Set Up Environment Variables

Copy the example env file:

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

### ⚠️ Important: Your phone and laptop MUST be on the same network

If they're on different networks, use one of these fixes:

| Method | How |
|--------|-----|
| **Phone Hotspot** (recommended) | Turn on your phone's hotspot → connect your laptop to it → run `npx expo start` → scan QR |
| **USB Tethering** | Plug phone into laptop via USB → enable USB tethering on phone → run `npx expo start` → scan QR |
| **Android Emulator** | Open Android Studio → start a virtual device → run `npx expo start` then press `a` |

---

## Project Structure (Where to Put Your Code)

```
src/
├── navigation/        # Don't touch unless discussed
├── screens/
│   ├── auth/          # Login, SignUp, Splash
│   ├── owner/         # Pet Owner screens (Home, VetDetails, Calendar, MyPets, AddPet, PetProfile, Chat, Profile)
│   └── vet/           # Veterinarian screens (Dashboard, Appointments, Chat, Account)
├── components/        # Reusable UI components (cards, buttons, modals)
├── hooks/             # Custom hooks (usePets, useAppointments)
├── lib/               # Supabase client, constants, helpers
├── context/           # Global state (AuthContext)
├── types/             # TypeScript interfaces
├── data/              # Mock data (to be replaced with Supabase queries)
└── assets/            # Images, fonts
```

---

## Git Workflow (FOLLOW THIS)

### Starting new work:

```bash
# 1. Make sure you're on main and up to date
git checkout main
git pull origin main

# 2. Create your feature branch
git checkout -b feature/my-screen-name
```

### While working (commit often):

```bash
git add -A
git commit -m "feat(screen-name): what you did"
```

### When done — push and open a PR:

```bash
# Get latest main first
git checkout main
git pull origin main
git checkout feature/my-screen-name
git merge main
# Fix any conflicts if they appear

# Push your branch
git push -u origin feature/my-screen-name
```

Then go to GitHub → your branch → click **"Create Pull Request"** → assign a teammate to review.

### Commit message format:

```
feat(home): add vet card grid
fix(calendar): correct date display
chore(deps): install new library
```

---

## Branch Naming

- `feature/home-screen` — new screen or feature
- `fix/login-crash` — bug fix
- `chore/add-library` — config or dependency change

---

## Common Commands

| Command | What it does |
|---------|-------------|
| `npx expo start` | Start the dev server |
| `npx expo start --clear` | Start with cleared cache (after config changes) |
| `npx tsc --noEmit` | Check for TypeScript errors |
| `git status` | See what files changed |
| `git pull origin main` | Get latest code from main |
| `npm install` | Install dependencies (run after pulling if package.json changed) |

---

## Troubleshooting

### "Module not found" error after pulling
```bash
npm install
```

### App won't load on phone
- Make sure phone and laptop are on the SAME network
- Try restarting: press `r` in the terminal to reload
- Try clearing cache: `npx expo start --clear`

### TypeScript errors
```bash
npx tsc --noEmit
```
This shows all type errors. Fix them before pushing.

### Merge conflicts
- Open the conflicting file in VS Code
- Look for `<<<<<<<` markers
- Choose which code to keep
- Save, then `git add` and `git commit`

---

## Team Assignments

| Member | Screens | Branch prefix |
|--------|---------|---------------|
| Member 1 (Lead) | Auth, Home, VetDetails, Booking, Pets, Calendar | `feature/auth-*`, `feature/home-*`, `feature/booking-*`, `feature/pets-*`, `feature/calendar-*` |
| Member 2 | Chat (owner + vet), Call screens, Rating | `feature/chat-*`, `feature/call-*`, `feature/rating-*` |
| Member 3 | Vet Dashboard, Today's Cases, Vet Appointments, Vet Account, Reminders | `feature/vet-*` |

### What's Already Done (don't rebuild these)
- ✅ Auth flow (Login, SignUp, Splash)
- ✅ Home screen with vet grid + search
- ✅ Vet Details with booking (persists to Supabase)
- ✅ Calendar with appointment list
- ✅ My Pets, Add Pet (with image picker), Pet Profile
- ✅ Profile screen with menu

### What Needs Building
- Chat (realtime messaging owner ↔ vet)
- Call screen (UI mockup only)
- Vet Dashboard (stats, today's cases)
- Vet Appointments (manage bookings)
- Vet Account screen
- Rating system (post-appointment)
- Reminders/Notifications (vet-side)

See [STATUS.md](./STATUS.md) for detailed progress tracking.

---

## Questions?

Ask in the group chat before spending too long stuck on something. Happy coding! 🐕🐈
