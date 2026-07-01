---
inclusion: always
---

# Efficiency — Save Tokens, Keep Quality

## Response Rules
- Be concise. No filler, no restating what the user said.
- Skip "let me think about this" preambles — just do it.
- Don't repeat code that hasn't changed — only show diffs or new code.
- When fixing a bug, show only the fix, not the entire file rewrite.
- Use `str_replace` for edits instead of rewriting whole files.

## Avoid Redundant Work
- Don't re-read files you already have in context.
- Don't re-run `npx tsc --noEmit` if only non-TS files changed (e.g., assets, .md files).
- Batch related changes into one commit instead of multiple tiny ones.
- Don't search for information you already know from earlier in the conversation.

## Code Generation
- Write complete, working code on the first attempt — avoid back-and-forth revisions.
- Before writing a screen, review the Figma data ONCE, plan the layout mentally, then write it all at once.
- Don't generate placeholder code that will immediately be replaced — build the real thing.

## Git
- One meaningful commit per logical change, not per file.
- Combine related fixes into a single commit.

## Communication
- If asked "what should we do next?" — give the answer in 3-5 lines max, not a full essay.
- Use tables and bullet points over paragraphs.
- Only explain trade-offs when the user asks "why."
