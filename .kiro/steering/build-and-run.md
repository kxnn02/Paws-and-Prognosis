---
inclusion: always
---

# Build & Run Instructions

## Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli` (or use npx)
- Android Studio (for dev build) or Expo Go (limited features)
- Supabase project created at https://supabase.com

## Environment Setup
Create `.env` in project root:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Commands
```bash
# Install dependencies
npm install

# Start development (Expo Go - limited, no Google Auth)
npx expo start

# Development build (full features)
npx expo run:android

# Type checking
npx tsc --noEmit

# Lint
npx eslint src/
```

## Testing on Device
- For Expo Go: Scan QR code from `npx expo start`
- For Dev Build: Install APK on device or use Android emulator
- Google Auth only works in development build, NOT Expo Go

## Key npm Scripts (add to package.json)
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "lint": "eslint src/ --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  }
}
```
