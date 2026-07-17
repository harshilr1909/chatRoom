# chatRoom — Improvement Roadmap

A practical plan to turn this project from a **solid learning app** into a **strong internship / portfolio project**.

| Item | Detail |
|------|--------|
| **Current level** | ~6/10 — real full-stack + realtime, but unfinished for portfolio |
| **Target after Tier A + B** | ~8–9/10 — secure, deployed, polished, interview-ready |
| **Total focused time** | ~4–6 weeks of steady work (not starting from scratch) |

---

## Current stack (present this accurately)

This is **not classic MERN** (no MongoDB today). The stack is:

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind |
| Backend | Express 5, TypeScript |
| Database | MySQL (`mysql2`) |
| Auth | bcrypt + `cookie-session` |
| Realtime | WebSockets (`ws`) |

**What already works**

- Sign up / log in with hashed passwords
- Cookie session + session restore on reload
- User list + search
- 1:1 messaging (WebSocket realtime + MySQL history)
- Basic chat UI (sidebar, bubbles, timestamps, auto-scroll)
- TypeScript on both sides

---

## Timetable overview

```
Week 1–2     ████████████  Tier A — Portfolio-honest (must do)
Week 3–6     ████████████████████  Tier B — Make it strong
Later        ░░░░░░░░░░  Tier C — Pick 1 standout extra (optional)
```

| Phase | Duration | Goal | Outcome |
|-------|----------|------|---------|
| **Tier A** | **Weeks 1–2** | Fix security, auth, packaging, deploy | Honest, demoable portfolio project |
| **Tier B** | **Weeks 3–6** | Depth features + polish | Strong primary project for internships |
| **Tier C** | **Optional later** | One standout feature | Differentiates you from other students |

> Do **not** rewrite the app. Level up this codebase in order: **A → B → (optional) C**.

---

## Problems to fix first (why Tier A exists)

These gaps would hurt in a code review or interview deep-dive:

| Issue | Where it lives |
|-------|----------------|
| Hardcoded session secret | `backend/server.ts` |
| DB credentials in source | `backend/middlewares/connectToDB.ts` |
| WebSocket identity is self-asserted (anyone can claim any username) | `backend/wsServer.ts` |
| Message POST trusts `userName` from the client body | `backend/routes/MessageRoute.ts` |
| Routes don’t consistently require `req.session.user` | message / user routes |
| Logout calls `DELETE /new/login/session` but that handler is missing | `Navbar.tsx` vs `logInRoute.ts` |
| Session cookies may not be sent (`credentials: 'include'` missing) | several frontend `fetch` calls |
| No root project README / no deploy / WS hardcodes `localhost` | repo root, `clientWS.ts` |
| WebRTC file is a stub (don’t claim video calls yet) | `frontend/WebRTC.ts` |

---

## Tier A — Weeks 1–2  
### Goal: Portfolio-honest (must complete)

**Theme:** Make the app secure enough to demo, easy for others to understand, and runnable live.

### Week 1 — Security & correctness

- [ ] Move secrets and DB config to **environment variables** (`.env` + `.env.example`; never commit real passwords)
- [ ] Replace hardcoded session secret in `backend/server.ts`
- [ ] Replace hardcoded DB credentials in `backend/middlewares/connectToDB.ts`
- [ ] **Auth-guard** all sensitive routes (`/new/messages`, `/new/users`, etc.) using `req.session.user`
- [ ] On message create: set `sender` from **session**, not from client body
- [ ] **Bind WebSocket identity** to the authenticated session (or a signed token) — reject spoofed usernames
- [ ] Implement **logout**: `DELETE` (or `POST`) session destroy on the backend
- [ ] Wire logout correctly from `Navbar.tsx`
- [ ] Use `credentials: 'include'` on all authenticated `fetch` calls
- [ ] Fix **sign-up → logged-in** flow so new users land in chat with correct state (`userName`, `signedIn` / `loggedIn`)

### Week 2 — Packaging & deploy

- [ ] Write a root **`README.md`** with:
  - [ ] What the project is / problem it solves
  - [ ] Feature list (only what works)
  - [ ] Architecture overview (diagram or short section)
  - [ ] Local setup steps
  - [ ] MySQL schema (or link to `schema.sql`)
  - [ ] Screenshots or GIF of the chat UI
  - [ ] Tech stack
- [ ] Document env vars in `.env.example`
- [ ] Configure **CORS** for the real frontend origin (not only `localhost:5173` if deployed)
- [ ] Make WebSocket URL configurable (dev vs production `wss://`)
- [ ] **Deploy**:
  - [ ] Frontend (e.g. Vercel / Netlify / Cloudflare Pages)
  - [ ] Backend (e.g. Render / Railway / Fly.io)
  - [ ] MySQL (managed DB or same host)
  - [ ] WebSocket works over **WSS** in production
- [ ] Smoke-test the full flow on the live URL with two browsers / two accounts

### Tier A done when

- [ ] Two users can chat live on the **deployed** app
- [ ] Refresh keeps session; logout clears it
- [ ] Unauthenticated API access is rejected
- [ ] You cannot impersonate another user over WebSocket
- [ ] README alone lets a stranger run or understand the project
- [ ] No secrets in git

**Resume line after Tier A:**

> Realtime 1:1 chat with session auth, MySQL persistence, and WebSockets — deployed at \<url\>.

---

## Tier B — Weeks 3–6  
### Goal: Make it strong

**Theme:** Depth, reliability, and polish that show intermediate engineering judgment.

### Weeks 3–4 — Backend & realtime depth

- [ ] **Online / offline presence** (broadcast who is connected; show in sidebar)
- [ ] **Message pagination** (load older messages; don’t dump entire history forever)
- [ ] **Input validation** on API bodies (e.g. zod or express-validator)
- [ ] Switch MySQL to a **connection pool**; prefer promise API over nested callbacks where practical
- [ ] Add a single source of truth for schema:
  - [ ] `schema.sql` and/or simple migrations
  - [ ] Keep it aligned with actual `INSERT` columns (`text`, `timeStamp`, `sender`, `receiver`)
- [ ] Cleaner error responses (don’t leak raw SQL errors to the client)

### Weeks 5–6 — UX polish & WebRTC decision

- [ ] Loading states (users list, conversation load, send in flight)
- [ ] Empty states (no users, no messages, search no results)
- [ ] Error states (network fail, session expired)
- [ ] Optional but high value:
  - [ ] Typing indicators
  - [ ] Unread message counts
- [ ] **WebRTC decision (pick one):**
  - [ ] **Option 1:** Finish a real 1:1 audio/video call (signalling + media) and document it, **or**
  - [ ] **Option 2:** Remove / quarantine the stub (`frontend/WebRTC.ts`) and **do not** claim video on the resume
- [ ] Light UI polish (consistent naming: Sign up vs Log in; remove fake “Forgot password” unless you build it)
- [ ] (Optional) Add a few automated tests (auth + one message route is enough to show intent)

### Tier B done when

- [ ] Presence works and is visible in the UI
- [ ] Long conversations don’t load painfully
- [ ] Invalid inputs fail with clear 400s
- [ ] App feels intentional, not half-finished
- [ ] WebRTC is either real or gone from claims

**Resume line after Tier B:**

> Full-stack realtime chat (React, Express, MySQL, WebSockets) with session auth, online presence, message history, and production deploy.

---

## Tier C — Optional (after Week 6)  
### Goal: Stand out — pick **one**

Do not try all of these. One deep feature beats four shallow ones.

| Option | What you’d build | Why it impresses |
|--------|------------------|------------------|
| **Group chats / rooms** | Multi-user rooms, membership, room messages | Real product complexity |
| **File / image messages** | Upload, store, display media | Full-stack + storage skills |
| **E2E encryption** | Client-side encrypt/decrypt of message bodies | Only if you can explain the threat model |
| **AI feature** | Summarize thread, smart reply, or search | Shows you use AI as a product feature |

### Tier C checklist (only for the option you pick)

- [ ] Design the data model / API first (short note in README)
- [ ] Implement backend + frontend end-to-end
- [ ] Secure it (auth, validation, size limits for uploads, etc.)
- [ ] Demo it live + document how it works
- [ ] Be ready to explain tradeoffs in an interview

---

## Suggested weekly schedule (detailed)

Use this if you want day-level structure for the first month.

### Week 1

| Days | Focus |
|------|--------|
| Mon–Tue | Env vars, remove secrets from code, `.env.example` |
| Wed–Thu | Auth middleware; fix message/user routes; session-based sender |
| Fri–Sun | WebSocket auth binding; logout endpoint + Navbar; fetch credentials |

### Week 2

| Days | Focus |
|------|--------|
| Mon–Tue | Sign-up flow fixes; CORS; configurable WS URL |
| Wed–Thu | Root README + schema docs + screenshots |
| Fri–Sun | Deploy frontend, backend, DB; fix prod bugs; live two-user test |

### Week 3–4

| Days | Focus |
|------|--------|
| Week 3 | Presence system + UI indicators |
| Week 4 | Pagination + validation + DB pool + schema file |

### Week 5–6

| Days | Focus |
|------|--------|
| Week 5 | Loading / empty / error UX; typing or unread (optional) |
| Week 6 | WebRTC finish **or** remove stub; final polish; update README |

---

## Critical files map

Use this when implementing so you don’t wander.

| Area | Files |
|------|--------|
| Server / session / CORS | `backend/server.ts` |
| WebSocket | `backend/wsServer.ts`, `frontend/src/WebSockets/clientWS.ts` |
| Auth (sign up / log in / session) | `backend/routes/signInRoute.ts`, `backend/routes/logInRoute.ts` |
| Messages | `backend/routes/MessageRoute.ts` |
| Users | `backend/routes/UsersRoute.ts` |
| DB connection | `backend/middlewares/connectToDB.ts` |
| App shell / auth state | `frontend/src/App.tsx` |
| Chat UI | `frontend/src/components/ChatBox.tsx` |
| Forms | `frontend/src/components/LoginForm.tsx`, `SigninForm.tsx` |
| Logout | `frontend/src/components/Navbar.tsx` |
| Dead / future WebRTC | `frontend/WebRTC.ts` |
| Dev API proxy | `frontend/vite.config.ts` |

---

## Verification checklist (end-to-end)

Run this before you call any tier “done”.

### Functional

- [ ] Register two users in two browsers (or normal + incognito)
- [ ] Both log in; both appear in user list / search
- [ ] Messages deliver in realtime both directions
- [ ] Refresh page: history still loads; session still valid
- [ ] Logout: session gone; protected routes return 401

### Security

- [ ] Cannot call message/user APIs without a session
- [ ] Cannot WebSocket-identify as another user and inject messages
- [ ] No passwords or session secrets in the repo
- [ ] Client cannot force a fake `sender` on stored messages

### Portfolio

- [ ] Live demo URL works
- [ ] README is accurate (no fake features)
- [ ] You can explain auth, WS flow, and message persistence in 3–5 minutes

---

## What not to do

- Don’t abandon this project for a brand-new stack unless you have a strong reason
- Don’t add every framework (Next, Redis, GraphQL, microservices) at once
- Don’t list WebRTC / AI / E2E crypto on your resume until they actually work
- Don’t use AI to generate the whole app and then be unable to explain it

---

## Progress tracker

Copy this into notes or check off as you go.

| Milestone | Target date | Status |
|-----------|-------------|--------|
| Tier A — Week 1 security | End of week 1 | ⬜ Not started |
| Tier A — Week 2 deploy + README | End of week 2 | ⬜ Not started |
| Tier B — Presence + pagination + validation | End of week 4 | ⬜ Not started |
| Tier B — UX + WebRTC decision | End of week 6 | ⬜ Not started |
| Tier C — One standout feature | Later | ⬜ Optional |

---

## Bottom line

1. **Keep chatRoom** — realtime full-stack is the right kind of project.  
2. **Finish Tier A first** — security, auth, README, deploy.  
3. **Then Tier B** — presence, pagination, validation, polish.  
4. **Optionally Tier C** — one feature that makes interviews memorable.

After Tier A + B, you can honestly market this as a **strong primary portfolio project** for internships.
