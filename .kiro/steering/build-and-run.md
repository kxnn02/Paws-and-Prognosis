---
inclusion: always
---

# Build & Run Instructions

## Prerequisites
- Node.js 18+
- Expo Go app on phone (SDK 54 from Play Store)
- Supabase project created at https://supabase.com

## Environment Setup
Create `.env` in project root (copy from `.env.example`):
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Commands
```bash
# Install dependencies
npm install

# Start development (Expo Go)
npx expo start

# Start with cleared cache (use after config changes like babel/metro/tailwind)
npx expo start --clear

# Type checking
npx tsc --noEmit
```

## Testing on Device
- Phone and laptop must be on SAME network
- If different networks: use phone hotspot or USB tethering
- Scan QR code with Expo Go app
- Press `r` in terminal to reload after code changes

## When to Use --clear
Run `npx expo start --clear` after:
- Changing `babel.config.js`
- Changing `metro.config.js`
- Changing `tailwind.config.js`
- Installing new native packages
- Seeing stale cache errors
