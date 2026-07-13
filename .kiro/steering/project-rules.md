---
inclusion: always
---

# Paws & Prognosis — Project Rules

## Tech Stack (DO NOT DEVIATE)
- React Native + Expo SDK 54 (Expo Go compatible)
- TypeScript (strict, no `any`)
- NativeWind v4 (`className` prop — NO StyleSheet.create)
- React Navigation 6 (native-stack + bottom-tabs)
- Supabase (Auth, Database, Storage, Realtime)
- react-hook-form + zod for forms
- expo-image-picker (grading requirement)
- react-native-calendars, expo-blur, react-native-reanimated

## Key Constraints
- Expo Go SDK 54 compatible — no native modules that break Expo Go
- Target: Philippines locale (phone +63)
- All data in Supabase; AsyncStorage for session only
- Two roles: pet_owner, veterinarian

## Coding Rules
- Use `className` for all styling — design tokens in `tailwind.config.js`
- Functional components with TypeScript interfaces
- Custom hooks for Supabase queries (src/hooks/)
- Types exported from `src/types/index.ts`
- Error handling: try/catch + user-friendly Alert messages
- Typed navigation params

## Git Workflow
- Branch from main: `feature/`, `fix/`, `chore/`, `refactor/`
- Commits: `type(scope): description` (imperative, <72 chars)
- Push to feature branch → PR → review → squash merge → delete branch
- Never push directly to main

## Quality
- `npx tsc --noEmit` must pass (zero errors)
- No unused imports, no hardcoded secrets
- Confirmation dialogs for destructive actions
- Pull-to-refresh on data-heavy screens
- useFocusEffect for data freshness after navigation

## Efficiency
- Be concise. Use `str_replace` for edits.
- Don't re-read files already in context.
- Batch related changes into one commit.
- Write working code on first attempt.
