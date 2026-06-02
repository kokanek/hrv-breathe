# hrv-breathe

Vite + React + TypeScript PWA for HRV breathing tracking. Express.js backend with MongoDB Atlas.

## Commands

```bash
pnpm install          # install dependencies
pnpm run dev          # frontend only (http://localhost:5173)
pnpm run dev:full     # frontend + backend together
pnpm run build        # production build
pnpm exec tsc --noEmit  # type check
```

Copy `.env.example` → `.env` and set `MONGODB_URI` before running the backend.

## PR Workflow — read before every push

**Before pushing commits or creating a PR, always check whether the current branch already has a merged PR:**

```bash
# check using GitHub MCP tools (mcp__github__pull_request_read or list_pull_requests)
# or: git log origin/main..HEAD — if empty, the branch is already merged
```

**If the branch's PR is already merged:**
1. `git fetch origin main && git checkout main && git pull origin main`
2. `git checkout -b <descriptive-branch-name>` — create a fresh branch
3. Apply the changes, then push and create a new PR

**Never push to a branch whose PR has already been merged into main.** Each piece of work needs its own branch and PR. Don't reuse old branches.

This applies even when the user doesn't mention it — proactively check before every `git push`.

## Stack

- `src/pages/` — HomePage, SessionPage, ActivityPage
- `src/components/` — BreathingCircle, DurationBubbles, TagSelector, ActivityItem
- `src/hooks/` — useBreathingCycle (6s inhale/exhale interval), useCountdownTimer
- `src/utils/audio.ts` — Web Audio API beeps (1 for inhale, 2 for exhale)
- `server/` — Express + Mongoose backend, port 3001
