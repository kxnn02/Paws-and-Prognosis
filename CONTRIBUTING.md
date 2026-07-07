# Contributing to Paws & Prognosis

Thank you for contributing! Please follow these guidelines.

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/kxnn02/Paws-and-Prognosis.git
   cd Paws-and-Prognosis
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Fill in your Supabase URL and anon key
   ```

3. Start the dev server:
   ```bash
   npx expo start
   ```

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes following the code standards below.

3. Verify your changes:
   ```bash
   npx tsc --noEmit      # Type check
   npm run lint          # Lint
   npm test              # Run tests
   ```

4. Commit using conventional format:
   ```
   feat(scope): add new feature
   fix(scope): fix a bug
   chore(scope): maintenance task
   ```

5. Push and open a PR targeting `main`.

## Code Standards

- **Styling:** Use NativeWind `className` — no `StyleSheet.create()`
- **Components:** Functional components with TypeScript interfaces
- **Hooks:** Prefix with `use`, keep in `src/hooks/`
- **Validation:** Use zod schemas for all form input
- **Accessibility:** Add `accessibilityRole` and `accessibilityLabel` to interactive elements
- **Error handling:** Use Toast for transient errors, Alert for confirmations only

## Testing

- Write tests for utility functions and hooks in `src/__tests__/`
- Use Jest + React Native Testing Library
- Run with: `npm test`
- Coverage: `npm run test:coverage`

## Pull Request Template

When opening a PR, include:

### Summary
_Brief description of changes_

### What was tested
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Tested on device via Expo Go

### Screenshots
_If UI changes, add before/after screenshots_

## Seeding Test Data

To populate your local Supabase with test data:

1. Go to your Supabase project dashboard → SQL Editor
2. Run the following seed script:

```sql
-- Create test users (run after signing up via the app)
-- Note: Users must exist in auth.users first via app signup

-- Seed veterinarians (after vet users exist in profiles)
INSERT INTO vets (user_id, name, specialty, bio, rating, image_url) VALUES
  ('VET_USER_ID_1', 'Dr. Maria Santos', 'General Practice', 'Experienced general vet with 10 years of practice.', 4.8, NULL),
  ('VET_USER_ID_2', 'Dr. Juan Cruz', 'Surgery', 'Specialist in orthopedic and soft tissue surgery.', 4.9, NULL),
  ('VET_USER_ID_3', 'Dr. Anna Reyes', 'Dermatology', 'Expert in skin conditions and allergies.', 4.7, NULL);

-- Seed sample pets (replace OWNER_USER_ID with actual owner profile id)
INSERT INTO pets (owner_id, name, species, breed, age, gender) VALUES
  ('OWNER_USER_ID', 'Buddy', 'Dog', 'Golden Retriever', '3 years', 'Male'),
  ('OWNER_USER_ID', 'Whiskers', 'Cat', 'Persian', '2 years', 'Female');

-- Seed sample appointment
INSERT INTO appointments (owner_id, vet_id, pet_id, date, time, status) VALUES
  ('OWNER_USER_ID', 'VET_ID', 'PET_ID', CURRENT_DATE + 1, '10:00:00', 'upcoming');
```

3. Replace placeholder IDs with actual UUIDs from your `profiles` and `vets` tables.

## Project Structure

```
src/
├── __tests__/         # Unit tests
├── components/        # Reusable UI components
├── context/           # React Context providers
├── hooks/             # Custom hooks (data fetching, state)
├── lib/               # Utilities, Supabase client, schemas
├── navigation/        # Stack and tab navigators
├── screens/           # Screen components by role
└── types/             # TypeScript type definitions
```
