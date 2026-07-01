---
inclusion: always
---

# Git Workflow & Collaboration

## Branch Strategy (GitHub Flow)

```
main (protected — always deployable)
  └── feature/auth-login
  └── feature/home-screen
  └── feature/vet-dashboard
  └── fix/calendar-crash
  └── chore/setup-navigation
```

### Branch Naming Convention
- `feature/<short-description>` — new screens or functionality
- `fix/<short-description>` — bug fixes
- `chore/<short-description>` — config, dependencies, cleanup
- `refactor/<short-description>` — code restructuring without behavior change

### Rules
- NEVER push directly to `main`
- Always create a feature branch from latest `main`
- One feature/screen per branch (keep PRs small and focused)
- Pull Request required to merge into `main`
- At least 1 team member must review before merging
- Delete branch after merge

## Commit Message Convention (Conventional Commits)

Format: `<type>(<scope>): <short description>`

### Types
- `feat` — new feature or screen
- `fix` — bug fix
- `chore` — maintenance (deps, config, scripts)
- `refactor` — code change that doesn't add feature or fix bug
- `style` — formatting, missing semicolons (no logic change)
- `docs` — documentation only
- `test` — adding or fixing tests

### Scope (optional, use screen/module name)
- `auth`, `home`, `booking`, `pets`, `calendar`, `chat`, `call`, `account`
- `vet-dashboard`, `vet-cases`, `vet-calendar`, `navigation`, `supabase`

### Examples
```
feat(auth): implement email login with Supabase
feat(home): add vet card grid with search
fix(calendar): correct date marker alignment
chore(deps): add react-native-calendars
refactor(pets): extract PetCard into reusable component
docs: update README with setup instructions
```

### Rules
- Keep subject line under 72 characters
- Use imperative mood ("add" not "added", "fix" not "fixed")
- No period at the end
- Body is optional — use for explaining WHY, not WHAT

## Pull Request Process

1. Push your feature branch to origin
2. Open PR on GitHub targeting `main`
3. Title follows commit convention: `feat(scope): description`
4. Description should include:
   - What was done (brief summary)
   - Screenshots (for UI changes)
   - Any blockers or known issues
5. Request review from at least 1 teammate
6. Address review comments
7. Squash merge into `main`
8. Delete the feature branch

## Conflict Resolution
- Pull latest `main` into your feature branch before opening PR
- Resolve conflicts locally, not in GitHub UI
- If conflict is complex, communicate with the teammate whose code conflicts

## Daily Workflow
```bash
# Start of work session
git checkout main
git pull origin main
git checkout -b feature/my-new-screen

# During work (commit often)
git add -A
git commit -m "feat(screen): add layout skeleton"

# Before opening PR
git checkout main
git pull origin main
git checkout feature/my-new-screen
git merge main
# resolve any conflicts
git push -u origin feature/my-new-screen
# open PR on GitHub
```
