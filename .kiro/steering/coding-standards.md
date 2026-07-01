---
inclusion: always
---

# Coding Standards

## Styling — NativeWind (Tailwind CSS for React Native)
- Use `className` prop for all styling — NO StyleSheet.create()
- Design tokens are defined in `tailwind.config.js` under `theme.extend`
- Custom colors: `primary`, `heading`, `dark`, `grey`, `cream`, `beige`, `input-bg`, `placeholder`
- Custom radii: `rounded-card` (16px), `rounded-btn` (12px), `rounded-glass` (29px), `rounded-nav` (32px)
- Use Tailwind utilities: `flex-1`, `items-center`, `justify-center`, `px-4`, `mt-2`, etc.
- For dynamic styles, use template literals: `className={\`bg-primary \${loading ? 'opacity-60' : ''}\`}`

## File Naming
- Components: PascalCase (e.g., `VetCard.tsx`, `BookingModal.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`, `usePets.ts`)
- Screens: PascalCase with `Screen` suffix (e.g., `HomeScreen.tsx`, `VetDetailsScreen.tsx`)
- Types: PascalCase in `types/` directory (e.g., `index.ts`)
- Utils/helpers: camelCase (e.g., `formatDate.ts`, `supabase.ts`)

## Component Patterns
- Use functional components with TypeScript interfaces for props
- Keep screens thin — extract logic into custom hooks
- Extract reusable UI into `components/` with clear prop interfaces
- Use `className` for styling — no inline style objects unless absolutely necessary
- Prefer composition over inheritance

## TypeScript
- Always type function parameters and return values
- Use interfaces for object shapes, types for unions/primitives
- No `any` — use `unknown` if type is truly unknown
- Export types from `src/types/index.ts`

## State Management
- Use React Context for global state (auth, theme)
- Use local state (useState) for component-specific state
- Use custom hooks to encapsulate Supabase queries and subscriptions
- AsyncStorage for offline cache and session persistence only

## Supabase Patterns
- Client initialized once in `src/lib/supabase.ts`
- Row Level Security (RLS) enabled on all tables
- Use Supabase Auth for session management
- Realtime subscriptions for chat messages and appointment updates
- Storage bucket for pet profile images

## Error Handling
- Wrap async operations in try/catch
- Display user-friendly error messages via Alert
- Log errors to console in development
- Never expose raw database errors to users

## Navigation
- Type all navigation params using RootStackParamList
- Use useNavigation() and useRoute() hooks
- Keep navigation logic in screen components, not child components
