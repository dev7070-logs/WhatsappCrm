# WaFlow — Security Review (October 2026)

A review of the whole app against the "Secure Vibe Coding" checklist:
server-side validation, login rate limiting, password storage, error
leakage, authentication, authorization, API security, secrets and
production config. Three independent code reviews were run (data
isolation between accounts, input validation & error leaks, public
endpoints & rate limits), every finding was fixed or documented, and
the fixes were verified with automated tests and live abuse requests
against a production build.

**Result: no critical or high-severity issues found.**

---

## ✅ What was fixed in this pass

| # | Area | Problem | Fix |
|---|------|---------|-----|
| 1 | Dependencies | 7 "high" advisories, all from the `shadcn` CLI package (only used for one CSS file) | Vendored the CSS, removed the package. **Production dependencies: 0 vulnerabilities.** |
| 2 | Errors (#04) | Login / sign-up / reset showed Supabase's raw message — "User already registered", "Email not confirmed" reveal which emails have accounts | Fixed, translated messages per category (`src/lib/auth/auth-errors.ts`). Sign-up for an existing email shows the same "check your inbox" screen; forgot-password always says "*if* an account exists…" |
| 3 | Errors (#04) | ~25 API responses returned raw database error text (table / column / constraint names), one of them through the public API | `serverError()` logs the detail server-side and returns a fixed message |
| 4 | Passwords (#03) | Minimum length 6 | Raised to 8 in the forms (set the same in Supabase — see below) |
| 5 | Rate limiting (#02) | Optional bot protection missing | Cloudflare Turnstile CAPTCHA on login, sign-up and password reset — verified **server-side by Supabase**. Off until you add a key |
| 6 | Rate limiting (#02) | Client IP came from spoofable headers → per-IP limits bypassable | New `TRUSTED_CLIENT_IP_HEADER` setting pins the one header your host guarantees |
| 7 | Rate limiting (#02) | Invite redemption limited per IP only | Added a per-user limit |
| 8 | Rate limiting (#02) | Public webhook verification and wrong API keys had no limit | 10/min and 20/min per IP |
| 9 | Validation (#01) | Dashboard broadcast had no recipient cap (one request → unlimited paid WhatsApp sends) | Max 1 000 recipients, each phone/parameter type- and length-checked |
| 10 | Validation (#01) | AI playground messages and knowledge documents had no size cap (unbounded AI bill) | 4 000 chars per message, 200 000 per document |
| 11 | Validation (#01) | Public API accepted unlimited tags and unchecked field lengths / emails | Max 50 tags × 50 chars, 200-char fields, email format check |
| 12 | Validation (#01) | No request-size limit on API routes | 2 MB cap (413) in middleware |
| 13 | API security | Media proxy accepted any media id and sent the WhatsApp token to any download URL | Numeric ids only; token only ever sent to Meta's media hosts over HTTPS; 100 MB cap |
| 14 | Authorization | An agent could assign a conversation to a user in **another** account, injecting a notification into their bell | Database trigger (migration **060**) rejects assignees outside the account |
| 15 | Authorization | Flow update/delete used the admin client filtered by id only (safe today, fragile) | Also filtered by `account_id` |
| 16 | Prod config | Content-Security-Policy was report-only | **Enforced**, built from your env (your Supabase domain, CAPTCHA only if enabled); no `unsafe-eval` in production |
| 17 | Prod config | Framework advertised in headers; tech names in page source | `X-Powered-By` off; public pages no longer ship internal text |
| 18 | Prod config | — | Added `Cross-Origin-Opener-Policy: same-origin` |

All 1 523 automated tests pass, including new ones for every fix above.

## ✅ Already secure (verified, unchanged)

- **Passwords (#03)** are never stored by this app — Supabase Auth stores them hashed with bcrypt.
- **Authentication (#05)** uses Supabase Auth (an established provider), PKCE, a safe callback with no open redirect.
- **Authorization:** every table has row-level security; every admin-client query is scoped to the caller's account; owner/admin actions are enforced on the server, not just hidden in the UI. Changing an id in a URL (`/api/…/123 → /124`) to reach another account's record returns not-found — verified by code review of every route (it needs a live database to test end-to-end).
- **Public API:** keys are random 256-bit, stored only as hashes, revocable, scoped, rate-limited per key.
- **Webhooks:** HMAC-SHA256 signatures checked in constant time; fails closed when the secret is missing.
- **Secrets:** none hard-coded; WhatsApp and AI keys encrypted at rest (AES-256-GCM); nothing secret in browser code.
- **SSRF:** every server-side fetch of a user-supplied URL goes through the SSRF guard.
- **XSS:** no user data rendered as HTML.
- **Demo preview mode** cannot run in a production build or once real keys exist (verified: returns 404).

---

## ⚠️ What YOU must switch on (not in the code)

Some protections live in your Supabase dashboard and hosting settings.

**Supabase → Authentication**
1. **Providers → Email → Confirm email: ON.** Stops fake sign-ups.
2. **Minimum password length: 8** (matches the app).
3. **Password requirements / Leaked password protection: ON** (blocks passwords known from breaches).
4. **Rate Limits:** keep the defaults or lower them (sign-in attempts per IP etc.). This is the real brute-force protection for login.
5. **Attack Protection → CAPTCHA:** enable with Cloudflare Turnstile, paste the *secret* key there, and put the *site* key in `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
6. **URL Configuration:** only your real domains in Redirect URLs.
7. *(Recommended)* **Multi-factor authentication** for owners/admins — Supabase supports TOTP MFA; the app does not have an MFA screen yet.

**Database**
8. Run the new migration: `npx supabase db push` (applies `060_conversation_assignee_same_account.sql`).

**Environment variables (production)**
9. `NEXT_PUBLIC_SITE_URL` — **required** in production, so invite links can't be pointed at another domain.
10. `TRUSTED_CLIENT_IP_HEADER` — set to the header your host sets (`cf-connecting-ip` behind Cloudflare; `x-real-ip` behind nginx/Hostinger proxy).
11. `AUTOMATION_CRON_SECRET` — a long random value if you use automation Wait steps.
12. Never put `NEXT_PUBLIC_DEMO_PREVIEW` in production (it is ignored there anyway).

**Hosting**
13. HTTPS only (Hostinger/Vercel do this automatically).
14. Never commit `.env.local` to GitHub (already in `.gitignore`).

---

## Known limitations (accepted / future work)

| Item | Why it's acceptable now / what to do later |
|---|---|
| Rate limits are in memory (per server process) | Fine on one server. If you scale to several, move them to Redis/Upstash. |
| Login cookies readable by JavaScript | How Supabase's browser login works. Mitigated by the enforced CSP; the remaining risk is XSS, and none was found. |
| CSP still allows inline scripts (`'unsafe-inline'`) | Needed by Next.js without nonces. A nonce-based CSP is a future upgrade. |
| Storage buckets (chat media, avatars) are public-by-URL | URLs are hard to guess; for stricter privacy switch to private buckets + signed URLs. |
| Any team member can read teammates' emails via the database | Only within the same account. |
| Invite links work for whoever holds them, up to 365 days | Keep invite expiry short (7–30 days) when you create them. |
| A few routes validate by hand rather than with a schema library | Tenancy fields are always set by the server; adding zod schemas is a good next step. |
| Dev-only lint tool has a `braces` advisory with no patched version | Not part of the deployed site. |

Before launch, for an app holding customer data, consider a review by a
qualified security professional as well.
