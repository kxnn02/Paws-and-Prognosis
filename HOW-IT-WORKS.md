# 🐾 How Paws & Prognosis Works

## What Is Paws & Prognosis?

Paws & Prognosis is a **veterinary clinic mobile app** that connects pet owners with veterinarians. It allows pet owners to find vets, book appointments, manage their pet profiles, and communicate in real-time through chat. Veterinarians use the same app to manage their schedules, update appointment statuses, and respond to pet owners.

The app is built for the **Philippines market** and targets both Android and iOS through a single React Native codebase running on Expo.

---

## Two User Roles, One App

When a user signs up, they choose one of two roles. Each role sees a completely different interface:

### 🐕 Pet Owner Experience

| Screen | What It Does |
|--------|-------------|
| **Home** | Displays a grid of available veterinarians with their photo, name, specialty, and star rating. Includes a search bar to filter vets by name or specialty. |
| **Vet Details** | Shows a vet's full profile — bio, specialty, rating, and a "Book Appointment" button. |
| **Booking** | A multi-step form: select a date (14-day range calendar), pick an available time slot, add notes, then confirm. |
| **Calendar** | Shows all the pet owner's appointments on a calendar with colored dot markers. Tapping a date reveals that day's appointments with status indicators. |
| **My Pets** | Lists all registered pets with photo, name, species, and breed. Tap to view full profile or edit. |
| **Add/Edit Pet** | Form to register a new pet or update existing info — name, species, breed, age, weight, gender, color, and photo (camera or gallery via expo-image-picker). |
| **Pet Profile** | Detailed view of a single pet's information and photo. |
| **Chat List** | Lists all active chat conversations with vets, showing the last message and timestamp. |
| **Chat Conversation** | Real-time messaging with a veterinarian. Messages appear instantly for both parties using Supabase Realtime. Includes typing indicators. |
| **Rating** | After a completed appointment, the pet owner can rate their experience with 1–5 stars. |
| **Reschedule** | Change the date/time of an existing upcoming appointment. |
| **Tips** | Pet care tips and educational content for pet owners. |
| **Profile** | View/edit personal info, upload avatar photo, and log out. |

### 🩺 Veterinarian Experience

| Screen | What It Does |
|--------|-------------|
| **Dashboard** | Overview of the vet's day — total appointments, today's cases listed with pet/owner info, and reminders (vaccinations due, follow-ups). |
| **Appointments** | Full list of all appointments across all dates, filterable by status (upcoming, in-progress, completed, cancelled). Vets can update status and add clinical notes. |
| **Appointment Detail** | Deep view of a single appointment — pet info, owner info, date/time, status controls, and a notes modal for writing medical observations. |
| **Chat List** | All conversations with pet owners. |
| **Chat Conversation** | Same real-time messaging as the owner side. |
| **Account** | Profile management, avatar upload, and logout. |

---

## How the App Flows (User Journey)

### Pet Owner: Booking an Appointment

```
1. Opens app → Login Screen → enters email + password
2. Lands on Home → sees grid of vets with photos and ratings
3. Taps a vet → Vet Details screen → reads bio and specialty
4. Taps "Book Appointment" → Booking Screen
5. Selects a date on the calendar (next 14 days only)
6. Picks a time slot from available options
7. Adds optional notes (e.g. "my dog has been limping")
8. Taps "Confirm Booking" → appointment created in database
9. Receives confirmation → appointment appears in Calendar
10. Can chat with the vet before the appointment date
```

### Veterinarian: Managing Their Day

```
1. Opens app → Login Screen → enters credentials
2. Lands on Dashboard → sees today's appointment count and case list
3. Reviews reminders (vaccine due dates, follow-ups)
4. Taps an appointment → Detail Screen
5. Updates status: upcoming → in_progress → completed
6. Adds clinical notes (diagnosis, treatment given)
7. Can chat with pet owner for follow-up questions
8. Owner rates the visit after completion
```

### Real-Time Chat Flow

```
Owner sends message → Supabase inserts row in messages table
                    → Realtime pushes new message to vet's device instantly
Vet sees message appear without refreshing
Vet types reply → typing indicator shows on owner's screen
Vet sends reply → appears on owner's screen instantly
```

---

## Technical Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    MOBILE APP                            │
│            (React Native + Expo SDK 54)                  │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Screens │  │  Hooks   │  │Components│             │
│  │  (UI)    │──│ (Logic)  │──│(Reusable)│             │
│  └──────────┘  └──────────┘  └──────────┘             │
│        │              │                                  │
│        └──────────────┘                                  │
│                │                                         │
└────────────────┼─────────────────────────────────────────┘
                 │ HTTPS / WebSocket
                 ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE (Cloud Backend)              │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │   Auth   │  │ Database │  │ Realtime │  │Storage ││
│  │(Login/   │  │(Postgres)│  │(WebSocket│  │(Images)││
│  │ Signup)  │  │          │  │  Push)   │  │        ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                         │
│  Row Level Security ensures users only see their data   │
└─────────────────────────────────────────────────────────┘
```

### What Each Supabase Service Does

| Service | Purpose in Our App |
|---------|-------------------|
| **Auth** | Email/password signup and login. Manages sessions. Identifies who is making each request. |
| **Database (PostgreSQL)** | Stores all structured data — profiles, pets, vets, appointments, messages, ratings, reminders. |
| **Realtime** | Powers live chat. When a message is inserted into the database, all subscribed clients receive it instantly via WebSocket. |
| **Storage** | Stores uploaded images — pet photos and user avatars. Files are organized in folders by user ID. |
| **Row Level Security (RLS)** | Database-level access control. Even if someone intercepts API calls, they cannot read other users' data. |

### Database Tables and Their Relationships

```
profiles ──────┐
  (all users)  │
               ├── pets (a pet owner has many pets)
               │
               ├── appointments (an owner books appointments)
               │      │
               │      ├── linked to a pet
               │      ├── linked to a vet
               │      └── can have a rating
               │
               ├── messages (users send/receive messages)
               │
               └── vets (a vet profile extends the base profile)
                     │
                     ├── appointments (vets are assigned appointments)
                     ├── ratings (vets receive ratings)
                     └── reminders (vets have clinical reminders)
```

---

## Key Technical Concepts Used

### Custom Hooks — Separating Logic from UI

Every data operation is wrapped in a reusable hook so screens stay clean:

| Hook | What It Manages |
|------|----------------|
| `useAuth()` | Login state, user profile, sign in/out |
| `usePets()` | Fetching, adding, deleting pets + image upload |
| `useVets()` | Fetching vet list with pagination |
| `useAppointments()` | Booking, cancelling, rescheduling appointments |
| `useChat()` | Messages, sending, real-time subscription, typing indicators |
| `useRatings()` | Submitting and fetching star ratings |
| `useReminders()` | Vet-side clinical reminders |
| `useFavoriteVets()` | Saving/removing favorite vets |
| `useNetworkStatus()` | Detecting offline state |

**How it works in practice:**
```tsx
// A screen just "uses" the hook — all database logic is hidden inside
function MyPetsScreen() {
  const { pets, loading, fetchPets, deletePet } = usePets();

  // pets = array of pet data from Supabase
  // loading = true while fetching
  // fetchPets = call to refresh data
  // deletePet = call to remove a pet
}
```

### Navigation — Screen Flow

The app uses **React Navigation** with this structure:

```
AppNavigator (decides which stack to show based on login state)
│
├── AuthNavigator (shown when NOT logged in)
│   ├── Splash Screen
│   ├── Login Screen
│   ├── Sign Up Screen
│   └── Forgot Password Screen
│
├── OwnerNavigator (shown when logged in as pet_owner)
│   ├── Bottom Tab Bar
│   │   ├── Home Tab → HomeScreen
│   │   ├── Calendar Tab → CalendarScreen
│   │   ├── Chat Tab → ChatListScreen
│   │   └── Profile Tab → ProfileScreen
│   │
│   └── Stack Screens (pushed on top of tabs)
│       ├── VetDetails, Booking, Reschedule
│       ├── MyPets, AddPet, EditPet, PetProfile
│       ├── ChatConversation, Rating
│       └── EditProfile, TipsScreen
│
└── VetNavigator (shown when logged in as veterinarian)
    ├── Bottom Tab Bar
    │   ├── Dashboard Tab → DashboardScreen
    │   ├── Appointments Tab → VetAppointmentsScreen
    │   ├── Chat Tab → VetChatListScreen
    │   └── Account Tab → VetAccountScreen
    │
    └── Stack Screens
        ├── VetAppointmentDetail
        ├── VetChatConversation
        └── EditProfile
```

### Real-Time Chat — How Messages Work Instantly

```
1. Owner types a message and taps Send
2. App inserts a row into the `messages` table in Supabase
3. Supabase Realtime detects the INSERT
4. Supabase pushes the new message via WebSocket to ALL subscribers on that channel
5. Vet's app receives the push and adds the message to the chat screen
6. No polling, no manual refresh — it just appears
```

The typing indicator works similarly — when a user is typing, a lightweight signal is broadcast on the channel so the other party sees "is typing..." in real-time.

### Image Upload — How Pet Photos Get Saved

```
1. User taps the camera icon on a pet or profile screen
2. expo-image-picker opens the device gallery (or camera)
3. User selects a photo → picker returns the image as base64 data
4. App decodes base64 → ArrayBuffer (using base64-arraybuffer library)
5. App uploads ArrayBuffer to Supabase Storage bucket "pet-images"
6. Supabase returns a public URL for the stored file
7. App saves that URL in the database (pets.image_url or profiles.avatar_url)
8. Image component loads the URL and displays the photo
```

### Styling — NativeWind (Tailwind CSS for React Native)

Instead of writing verbose style objects, we use utility classes:

```tsx
// Every screen uses className for styling — clean and consistent
<View className="flex-1 bg-beige px-5 pt-14">
  <Text className="text-xl font-bold text-heading">My Pets</Text>
  <TouchableOpacity className="bg-primary rounded-btn h-12 items-center justify-center">
    <Text className="text-white font-semibold">Add Pet</Text>
  </TouchableOpacity>
</View>
```

Design tokens (colors, border radii, etc.) are defined in `tailwind.config.js` so the entire app uses consistent values from the Figma design.

### Security — How User Data Is Protected

1. **Authentication** — Users must log in with email/password. Supabase Auth issues a JWT token that identifies who they are.
2. **Row Level Security (RLS)** — Every database table has policies like:
   - "Users can only SELECT their own pets" (`owner_id = auth.uid()`)
   - "Users can only UPDATE their own profile" (`id = auth.uid()`)
   - "Messages can only be read by sender or receiver"
3. **Storage Policies** — Users can only upload files to their own folder (`user_id/filename`)
4. **Input Validation** — All forms use Zod schemas to validate data before sending to the database
5. **No Secrets in Code** — Supabase URL and key are in `.env` (gitignored), never hardcoded

---

## Form Validation with Zod + React Hook Form

Every form in the app validates user input before submission:

```
User fills form → react-hook-form tracks all field values
User taps Submit → zod schema validates (name required, species required, etc.)
                 → If invalid: shows red error text below the field
                 → If valid: sends data to Supabase
```

This prevents empty pet names, invalid emails, and other bad data from reaching the database.

---

## Offline Awareness

The app uses `useNetworkStatus()` to detect when the device loses internet connection. When offline:
- An `OfflineBanner` component shows at the top of the screen
- Operations that require network (booking, chat) show appropriate messages
- Cached data (from previous fetches) remains visible

---

## Summary

| Concept | What It Does in Our App |
|---------|------------------------|
| React Native + Expo | Single codebase runs on both Android and iOS phones via Expo Go |
| TypeScript | Catches bugs before runtime by enforcing data types |
| NativeWind | Consistent, Figma-matched styling with utility classes |
| React Navigation | Manages screen flow — tabs for main sections, stack for drill-down |
| Supabase Auth | Handles user registration, login, password reset, and session management |
| Supabase Database | Stores all app data (pets, appointments, messages, ratings) with RLS |
| Supabase Realtime | Powers instant chat messaging and typing indicators via WebSocket |
| Supabase Storage | Stores pet photos and user avatars, served via public URLs |
| Custom Hooks | Encapsulate all data-fetching logic so screens stay simple and focused |
| Context (AuthContext) | Shares login state and user profile across all screens without prop drilling |
| expo-image-picker | Opens camera/gallery for photo upload — a required grading integration |
| react-native-calendars | Renders the appointment calendar with date markers |
| Zod + react-hook-form | Validates form input before submission, shows inline error messages |
| Row Level Security | Database-level access control — users cannot access each other's data |
