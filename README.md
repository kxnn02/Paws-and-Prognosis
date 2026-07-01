# 🐾 Paws & Prognosis

A veterinary clinic appointment and care management mobile app built with React Native (Expo) and Supabase.

---

## About

Paws & Prognosis connects pet owners with veterinarians for appointment scheduling, pet health management, and real-time communication. The app supports two user roles:

- **Pet Owner** — browse vets, book appointments, manage pets, view calendar, chat with vets
- **Veterinarian** — manage appointments, view patient cases, communicate with pet owners

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 54 |
| Language | TypeScript |
| Styling | NativeWind v4 (Tailwind CSS for RN) |
| Navigation | React Navigation 6 |
| Backend | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Forms | react-hook-form + zod |
| Calendar | react-native-calendars |
| Camera | expo-image-picker |
| Icons | @expo/vector-icons (Ionicons) |
| Blur Effects | expo-blur |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your phone (SDK 54)
- Supabase project ([supabase.com](https://supabase.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/kxnn02/Paws-and-Prognosis.git
cd Paws-and-Prognosis

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key
```

### Running the App

```bash
# Start development server
npx expo start

# Start with cleared cache (after config changes)
npx expo start --clear

# Type check
npx tsc --noEmit
```

Scan the QR code with Expo Go on your phone. Your phone and laptop must be on the same network.

---

## Project Structure

```
src/
├── navigation/        # Stack and tab navigators
├── screens/
│   ├── auth/          # Login, SignUp, Splash
│   ├── owner/         # Home, VetDetails, Calendar, MyPets, AddPet, PetProfile, Chat, Profile
│   └── vet/           # Dashboard, Appointments, Chat, Account
├── components/        # Reusable UI (Button, Card, VetCard, SearchBar, etc.)
├── hooks/             # Custom hooks (usePets, useAppointments)
├── lib/               # Supabase client, constants, helpers
├── context/           # AuthContext
├── types/             # TypeScript interfaces
└── data/              # Mock data (temporary)
```

---

## Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Never commit `.env` — it's in `.gitignore`.

---

## Database Schema

The app uses Supabase with the following tables:

- `profiles` — User profiles (linked to auth.users)
- `pets` — Pet records (owner_id → profiles)
- `vets` — Veterinarian details (user_id → profiles)
- `appointments` — Booking records (owner, vet, pet, date, time, status)
- `messages` — Chat messages between users
- `ratings` — Post-appointment vet ratings
- `reminders` — Vet-side notifications

All tables use Row Level Security (RLS) to ensure users can only access their own data.

---

## Git Workflow

We use **GitHub Flow** with protected `main` branch:

```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit with conventional format
git commit -m "feat(scope): description"

# Push and open PR
git push -u origin feature/my-feature
```

See [TEAM-SETUP-GUIDE.md](./TEAM-SETUP-GUIDE.md) for full workflow details.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm run lint` | Run ESLint on src/ |

---

## Design System

Colors and tokens are defined in `tailwind.config.js`:

- **Primary:** `#71924F` (green)
- **Accent:** `#7BBD38` (bright green)
- **Background:** `#FEF9F4` (warm beige)
- **Headings:** `#544864` (dark purple)
- **Body text:** `#343434`

---

## Team

See [TEAM-SETUP-GUIDE.md](./TEAM-SETUP-GUIDE.md) for setup instructions and team assignments.

---

## License

See [LICENSE](./LICENSE) for details.
