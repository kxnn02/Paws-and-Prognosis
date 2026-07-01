---
inclusion: always
---

# Quality Checks — Before Declaring Anything "Done"

## After Every Code Change
1. Run `npx tsc --noEmit` — zero errors required
2. Ensure the app still starts (`npx expo start` should not crash)
3. Verify the screen renders on device (if you changed UI)

## Before Pushing to Main
- All TypeScript errors resolved
- No `any` types introduced
- No unused imports left behind
- No hardcoded secrets or API keys
- Commit message follows convention: `type(scope): description`

## When Building a New Screen
1. Check Figma for exact layout, colors, spacing
2. Use design tokens from `tailwind.config.js` — no magic hex values inline unless truly one-off
3. Verify navigation works (can navigate to and from the screen)
4. Test with both roles if the screen is role-specific
5. Confirm data flows correctly (Supabase read/write)

## When Fixing a Bug
1. Identify the root cause, don't patch symptoms
2. Test that the fix works
3. Verify you didn't break something else nearby

## Common Gotchas to Check
- `expo-blur` BlurView needs `overflow: 'hidden'` on parent
- Images from Figma export may have white backgrounds — ask user to re-export with transparency
- NativeWind `className` won't work on custom components unless they forward the prop
- React Navigation screens must be registered in the navigator before navigating to them
- Supabase RLS policies can silently return empty data — check policies if queries return nothing
