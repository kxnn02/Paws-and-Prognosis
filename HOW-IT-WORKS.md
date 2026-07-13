# 📖 How Our App Works — Explained Like You're 5 (Almost)

This guide explains every concept in our app using **real-world analogies** and **plain language**. No prior React Native knowledge needed.

---

## 🏠 Think of the App Like a Building

```
🏢 Our App = A building with rooms
├── 🚪 Front Door = Login Screen (you need a key/password to get in)
├── 🏬 Lobby = Home Screen (see what's available)
├── 📋 Reception = Booking Screen (schedule an appointment)
├── 🐕 Pet Room = My Pets Screen (your pet's info)
├── 💬 Phone Booth = Chat Screen (talk to the vet)
└── 📅 Calendar = Calendar Screen (see your schedule)
```

Different people see different rooms:
- **Pet Owners** see: Home, Calendar, Chat, Profile
- **Vets** see: Dashboard, Appointments, Chat, Account

---

## 🧱 Building Blocks (React Native Components)

React Native gives us **LEGO pieces** to build screens. Here's each piece in plain English:

### `View` = An invisible box
Think of it like a **cardboard box** that holds other things inside it.
```tsx
<View>
  {/* stuff goes inside here */}
</View>
```

### `Text` = Words on screen
You CANNOT just type words. You MUST put them inside `<Text>`:
```tsx
// ❌ WRONG - this crashes
Hello world

// ✅ RIGHT
<Text>Hello world</Text>
```

### `TextInput` = A text field you can type into
Like the blank line on a form where you write your name:
```tsx
<TextInput placeholder="Type your name..." />
```

### `TouchableOpacity` = A button
Anything you can TAP. It fades a little when pressed so the user knows they tapped it:
```tsx
<TouchableOpacity onPress={() => doSomething()}>
  <Text>Tap Me!</Text>
</TouchableOpacity>
```

### `ScrollView` = A scrollable page
When your content is too long to fit on one screen (like scrolling on Instagram):
```tsx
<ScrollView>
  {/* lots of content that scrolls */}
</ScrollView>
```

### `Image` = A picture
```tsx
<Image source={{ uri: 'https://example.com/dog.jpg' }} />
```

### `ActivityIndicator` = Loading spinner
The spinning circle you see when something is loading:
```tsx
<ActivityIndicator />  {/* Shows a spinner */}
```

### `Alert` = A popup message
Like those "Are you sure?" popups:
```tsx
Alert.alert('Delete Pet?', 'This cannot be undone', [
  { text: 'Cancel' },
  { text: 'Delete', onPress: () => deletePet() }
]);
```

---

## 📦 State = Data That Can Change

### The Restaurant Analogy

Imagine a restaurant order board:

```
ORDER BOARD (State)
┌──────────────────────┐
│ Table 1: Burger      │  ← This can CHANGE (they might order more)
│ Table 2: Pizza       │  ← This can CHANGE
│ Table 3: (waiting)   │  ← This can CHANGE
└──────────────────────┘
```

When the board CHANGES, the kitchen (screen) REACTS and updates what it shows.

### `useState` = Creating a slot on the board

```tsx
const [name, setName] = useState('');
//     ↑       ↑              ↑
//  current  function to    starting
//  value    change it      value
```

**Real example — a search bar:**
```tsx
const [search, setSearch] = useState('');  // Start with empty text

<TextInput
  value={search}                    // Show whatever is in `search`
  onChangeText={setSearch}          // When user types, update `search`
/>
// User types "D" → search becomes "D" → screen re-renders → shows "D"
// User types "o" → search becomes "Do" → screen re-renders → shows "Do"
// User types "g" → search becomes "Dog" → screen re-renders → shows "Dog"
```

### `useEffect` = "When X happens, do Y"

```tsx
// "When the screen first opens, load my pets from the database"
useEffect(() => {
  loadPets();
}, []);
//  ↑ empty [] means "only run once when screen opens"

// "Whenever selectedDate changes, load appointments for that date"
useEffect(() => {
  loadAppointments(selectedDate);
}, [selectedDate]);
//  ↑ [selectedDate] means "run again whenever selectedDate changes"
```

**Analogy:** It's like setting an alarm:
- `[]` = alarm that rings once (when you wake up)
- `[selectedDate]` = alarm that rings every time you flip the calendar page

### `useMemo` = A smart calculator that remembers answers

```tsx
// WITHOUT useMemo: filters ALL vets every time ANYTHING on screen changes (wasteful)
const filtered = vets.filter(v => v.name.includes(search));

// WITH useMemo: only re-filters when vets or search actually change (smart)
const filtered = useMemo(() => {
  return vets.filter(v => v.name.includes(search));
}, [vets, search]);
```

**Analogy:** Imagine you asked "What's 847 × 293?" and someone calculated it. If you ask the exact same question again 5 seconds later, they just give you the saved answer instead of recalculating. That's `useMemo`.

---

## 🪝 Custom Hooks = Pre-made Tool Kits

### The Toolbox Analogy

Imagine you're building furniture. Instead of finding a hammer, screws, and drill separately every time, you put them in a labeled **toolbox**:

```
🧰 "Pet Toolbox" (usePets hook)
├── 🐕 pets         → list of all your pets
├── ⏳ loading      → are we still loading?
├── 📥 fetchPets    → reload the list
├── ➕ addPet       → add a new pet
└── 🗑️ deletePet   → remove a pet
```

### In code:

```tsx
// The toolbox (src/hooks/usePets.ts)
export function usePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPets() {
    setLoading(true);
    const { data } = await supabase.from('pets').select('*');
    setPets(data);
    setLoading(false);
  }

  async function addPet(petData) {
    await supabase.from('pets').insert(petData);
    fetchPets(); // refresh the list
  }

  return { pets, loading, fetchPets, addPet };
}
```

```tsx
// Using the toolbox in a screen (ONE LINE to get everything!)
export default function MyPetsScreen() {
  const { pets, loading, fetchPets, addPet } = usePets();
  //       ↑      ↑        ↑          ↑
  //    the data  is it   refresh    add new
  //             loading?  button    function
}
```

### Our toolboxes:

| Toolbox | Tools inside |
|---------|-------------|
| `usePets()` | pets list, add/delete/upload photo |
| `useAppointments()` | appointments, book/cancel/reschedule |
| `useVets()` | vet list, load more, search |
| `useChat()` | messages, send message, typing indicator |
| `useRatings()` | star ratings, submit rating |
| `useAuth()` | login, logout, who am I? |

---

## 🌍 Context = Shared Bulletin Board

### The Problem

Imagine 10 classrooms in a school. They ALL need to know: "Is it a holiday today?"

**Bad approach:** Walk to each classroom and tell them individually.
**Good approach:** Put it on a **bulletin board in the hallway** — everyone can read it.

### In our app:

```
📌 BULLETIN BOARD (AuthContext)
┌──────────────────────────────────┐
│ Logged in: YES                   │
│ User: Juan (juan@email.com)      │
│ Role: pet_owner                  │
│ Avatar: https://...photo.jpg     │
└──────────────────────────────────┘
```

**Every screen** can read this board:

```tsx
// ANY screen can do this:
const { profile, signOut } = useAuth();

// Now you know:
// profile.name → "Juan"
// profile.role → "pet_owner"
// profile.email → "juan@email.com"
```

### How it wraps the app:

```tsx
// App.tsx
<AuthProvider>          {/* ← The bulletin board is set up HERE */}
  <AppNavigator />      {/* ← Everything inside can read it */}
</AuthProvider>
```

---

## 🗺️ Navigation = Moving Between Rooms

### Think of it like a stack of papers

When you go to a new screen, it's placed ON TOP:

```
Screen Stack:
┌─────────────┐
│  Booking    │  ← You're here now (on top)
├─────────────┤
│  VetDetails │  ← Behind it
├─────────────┤
│  Home       │  ← Bottom (root)
└─────────────┘
```

`goBack()` = remove the top paper (go back to previous screen)

### Code:

```tsx
// GO FORWARD (add a screen on top)
navigation.navigate('VetDetails', { vetId: '123' });

// GO BACK (remove current screen, show previous)
navigation.goBack();
```

### Tab Bar = Multiple stacks side by side

```
[🏠 Home]  [📅 Calendar]  [💬 Chat]  [👤 Profile]
    ↑           ↑              ↑          ↑
 Each tab    Each tab      Each tab   Each tab
 is its      is its        is its     is its
 own stack   own stack     own stack  own stack
```

Tapping a tab switches which stack is visible. They don't destroy each other.

### Passing data between screens:

```tsx
// SENDING data (from Home → VetDetails)
navigation.navigate('VetDetails', { vetId: '123' });

// RECEIVING data (in VetDetails screen)
const route = useRoute();
const { vetId } = route.params;  // vetId = '123'
```

---

## ☁️ Supabase = Our Database in the Cloud

### Think of it like Google Sheets (but secure)

```
📊 Table: "pets"
┌────────┬──────────┬─────────┬─────────┬────────┐
│ id     │ name     │ species │ breed   │ owner  │
├────────┼──────────┼─────────┼─────────┼────────┤
│ abc123 │ Bantay   │ Dog     │ Aspin   │ juan01 │
│ def456 │ Mingming │ Cat     │ Persian │ juan01 │
│ ghi789 │ Rocky    │ Dog     │ Poodle  │ maria1 │
└────────┴──────────┴─────────┴─────────┴────────┘
```

### The 4 operations (CRUD):

```tsx
// 📖 READ — "Show me all my pets"
const { data } = await supabase
  .from('pets')           // from the "pets" table
  .select('*')            // get all columns
  .eq('owner_id', myId);  // where owner is me

// ✏️ CREATE — "Add a new pet"
await supabase
  .from('pets')
  .insert({ name: 'Bantay', species: 'Dog', owner_id: myId });

// 🔄 UPDATE — "Change appointment to cancelled"
await supabase
  .from('appointments')
  .update({ status: 'cancelled' })
  .eq('id', appointmentId);

// 🗑️ DELETE — "Remove my pet"
await supabase
  .from('pets')
  .delete()
  .eq('id', petId);
```

### Real-time Chat (messages appear instantly):

```tsx
// "Hey Supabase, tell me whenever someone sends me a message"
supabase
  .channel('my-messages')
  .on('postgres_changes', {
    event: 'INSERT',           // when a new row appears
    table: 'messages',         // in the messages table
    filter: `receiver_id=eq.${myId}`,  // addressed to me
  }, (payload) => {
    // This runs INSTANTLY when a new message arrives!
    addMessageToScreen(payload.new);
  })
  .subscribe();
```

**Analogy:** It's like subscribing to notifications. Instead of refreshing the page every second, Supabase TELLS you when something new arrives.

### Security (Row Level Security):

Even if a hacker knows the database URL, they can't see other people's data:

```
Juan logs in → Can only see Juan's pets
Maria logs in → Can only see Maria's pets
                (even though they're in the same table!)
```

This is enforced at the DATABASE level, not in our app code. So even if our app had a bug, the data is still protected.

---

## 🎨 NativeWind = Easy Styling

### The old way (ugly and long):

```tsx
<View style={{ flex: 1, backgroundColor: '#FEF9F4', paddingHorizontal: 20, marginTop: 16 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#544864' }}>Hello</Text>
</View>
```

### Our way (short and readable):

```tsx
<View className="flex-1 bg-beige px-5 mt-4">
  <Text className="text-2xl font-bold text-heading">Hello</Text>
</View>
```

### Cheat sheet of classes we use:

| What you want | Class to use | What it does |
|---------------|-------------|--------------|
| Full width/height | `flex-1` | Fills all available space |
| Horizontal layout | `flex-row` | Items side by side |
| Center stuff | `items-center justify-center` | Centers both ways |
| Spacing (outside) | `mt-4` `mb-2` `mx-5` | Margin (top/bottom/horizontal) |
| Spacing (inside) | `pt-4` `pb-2` `px-5` | Padding (top/bottom/horizontal) |
| Round corners | `rounded-card` `rounded-btn` `rounded-full` | Cards / buttons / circles |
| Background color | `bg-beige` `bg-primary` `bg-white` | Fill color |
| Text color | `text-heading` `text-primary` `text-grey` | Font color |
| Text size | `text-xs` `text-sm` `text-lg` `text-2xl` | Small → big |
| Bold text | `font-bold` `font-semibold` `font-medium` | Weight |

### Making it dynamic (change style based on condition):

```tsx
// If button is active → green background + white text
// If button is inactive → white background + dark text
<TouchableOpacity className={`px-4 py-2 rounded-btn ${
  isActive ? 'bg-primary' : 'bg-white'
}`}>
  <Text className={isActive ? 'text-white' : 'text-dark'}>
    {label}
  </Text>
</TouchableOpacity>
```

---

## 🏷️ TypeScript = Spell-checker for Code

### The Problem

JavaScript doesn't catch typos until the app CRASHES:
```js
const pet = { name: 'Bantay', species: 'Dog' };
console.log(pet.naem);  // undefined — no error, just silent bug 😱
```

### TypeScript catches it BEFORE you run the app:

```tsx
interface Pet {
  name: string;
  species: string;
}

const pet: Pet = { name: 'Bantay', species: 'Dog' };
console.log(pet.naem);  // ❌ RED UNDERLINE: "Did you mean 'name'?"
```

### Our types = a "recipe" for data shapes:

```tsx
// "A pet MUST have these fields"
interface Pet {
  id: string;          // every pet has a unique ID
  name: string;        // name is required text
  species: string;     // species is required text
  age: string | null;  // age might be empty (null)
  image_url: string | null;  // photo might not exist
}

// "User role can ONLY be one of these two values"
type UserRole = 'pet_owner' | 'veterinarian';
// trying to set role = 'admin' → ❌ ERROR
```

---

## 🧩 Full Example — How a Screen Works

Here's a complete screen broken down line by line:

```tsx
// ═══════════════════════════════════════════════
// STEP 1: IMPORTS (what tools do we need?)
// ═══════════════════════════════════════════════
import React, { useState } from 'react';           // React + state
import { View, Text, TouchableOpacity } from 'react-native';  // UI pieces
import { useNavigation } from '@react-navigation/native';      // Navigate between screens
import { usePets } from '../../hooks/usePets';     // Our pet toolbox
import { useAuth } from '../../context/AuthContext'; // Bulletin board (who am I?)

// ═══════════════════════════════════════════════
// STEP 2: THE SCREEN COMPONENT
// ═══════════════════════════════════════════════
export default function MyPetsScreen() {

  // ─────────────────────────────────────────────
  // STEP 3: GET TOOLS & DATA
  // ─────────────────────────────────────────────
  const navigation = useNavigation();         // Tool to move between screens
  const { profile } = useAuth();              // Read the bulletin board
  const { pets, loading } = usePets();        // Open the pets toolbox

  // ─────────────────────────────────────────────
  // STEP 4: WHAT HAPPENS WHEN USER TAPS THINGS
  // ─────────────────────────────────────────────
  function handlePetPress(petId: string) {
    navigation.navigate('PetProfile', { petId });  // Go to pet detail
  }

  // ─────────────────────────────────────────────
  // STEP 5: WHAT THE USER SEES (the return)
  // ─────────────────────────────────────────────
  if (loading) {
    return <ActivityIndicator />;  // Show spinner while loading
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <Text className="text-xl font-bold text-heading px-5 mt-14">
        {profile?.name}'s Pets
      </Text>

      {/* Pet List */}
      {pets.map((pet) => (
        <TouchableOpacity
          key={pet.id}
          onPress={() => handlePetPress(pet.id)}
          className="bg-white mx-5 mt-3 p-4 rounded-card"
        >
          <Text className="text-dark font-semibold">{pet.name}</Text>
          <Text className="text-grey text-sm">{pet.species} • {pet.breed}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

---

## 🔄 The Data Flow (Most Important Concept!)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ☁️ SUPABASE (database in the cloud)                       │
│     │                                                      │
│     │ data flows DOWN                                      │
│     ▼                                                      │
│  🪝 HOOK (usePets, useAppointments, etc.)                  │
│     │  - fetches data                                      │
│     │  - stores in useState                                │
│     │  - provides functions (add, delete, etc.)            │
│     ▼                                                      │
│  📱 SCREEN (MyPetsScreen, BookingScreen, etc.)             │
│     │  - reads data from hook                              │
│     │  - renders it with View/Text/Image                   │
│     │  - shows buttons for user actions                    │
│     ▼                                                      │
│  👤 USER sees it and taps something                        │
│     │                                                      │
│     │ action flows UP                                      │
│     ▼                                                      │
│  📱 SCREEN calls a function (e.g. addPet())               │
│     │                                                      │
│     ▼                                                      │
│  🪝 HOOK sends the change to Supabase                     │
│     │                                                      │
│     ▼                                                      │
│  ☁️ SUPABASE saves it → hook re-fetches → screen updates  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**In one sentence:** Data comes DOWN from the database through hooks to the screen. User actions go UP from the screen through hooks back to the database.

---

## ❓ Quick Answers to Professor Questions

| Question | Answer |
|----------|--------|
| "What is useState?" | A way to store data that can change. When it changes, the screen automatically re-renders. |
| "What is useEffect?" | A way to run code at specific moments — like "when the screen loads" or "when a value changes." |
| "What is a custom hook?" | A reusable function that bundles related logic (state + effects + functions) so screens stay clean. |
| "What is Context?" | A shared data store that any screen can access without passing data through every component. |
| "What is Supabase?" | Our backend — it stores data in PostgreSQL, handles login, enables real-time chat, and stores images. |
| "What is NativeWind?" | Tailwind CSS for React Native — lets us style with className instead of StyleSheet. |
| "What is TypeScript?" | JavaScript with type checking — catches typos and wrong data shapes before the app runs. |
| "How does navigation work?" | Screens stack on top of each other. Navigate forward adds a screen. Go back removes the top one. |
| "How does real-time chat work?" | We subscribe to database changes. When a new message row is inserted, Supabase pushes it to us instantly. |
| "How is data secured?" | Row Level Security (RLS) in Supabase — users can only read/write their own data, enforced at database level. |
| "What's the Expo feature?" | expo-image-picker — opens camera or photo gallery, handles permissions, returns the selected image. |
| "Does data persist after restart?" | Yes — all data is in Supabase (cloud). Session is in AsyncStorage (local). Nothing is lost on restart. |
