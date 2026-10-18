# WaFlow — Setup Guide (step by step)

This guide takes you from the zip file to a running CRM with Google
sign-in. Follow the steps in order.

---

## Step 0 — Install Node.js (one time)

You need **Node.js 22.12 or newer**.

1. Download the **LTS** installer from <https://nodejs.org> and install it.
2. Check it worked: open Terminal and run `node -v` (should print `v22.x` or higher).

---

## Step 1 — Unzip and install

```bash
cd ~/Desktop            # or wherever you unzipped it
cd WhatsappCrm
npm install
```

---

## Step 2 — Create a Supabase project (database + login)

1. Go to <https://supabase.com> → **New project**. Pick a name, a strong
   database password, and the region closest to you.
2. When it's ready, open **Project Settings → API** and copy:

| Copy this from Supabase          | Paste into `.env.local` as        |
| -------------------------------- | --------------------------------- |
| Project URL                      | `NEXT_PUBLIC_SUPABASE_URL`        |
| `anon` `public` key              | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   |
| `service_role` `secret` key      | `SUPABASE_SERVICE_ROLE_KEY`       |

> ⚠️ The `service_role` key is a master key. Never share it or put it
> in front-end code.

### Create the database tables

Run the migrations in `supabase/migrations/` (54 SQL files) against
your project with the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF   # the "xxxx" in https://xxxx.supabase.co
npx supabase db push
```

---

## Step 3 — Create your `.env.local`

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

| Variable                         | Where to get it                                                                 | Required? |
| -------------------------------- | ------------------------------------------------------------------------------- | --------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase → Project Settings → API                                               | ✅ Yes    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase → Project Settings → API                                               | ✅ Yes    |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase → Project Settings → API                                               | ✅ Yes    |
| `ENCRYPTION_KEY`                 | Generate it yourself (command below)                                            | ✅ Yes    |
| `META_APP_SECRET`                | Meta for Developers → your app → App Settings → Basic → **App Secret**          | ✅ Yes    |
| `NEXT_PUBLIC_SITE_URL`           | Your website address, e.g. `https://crm.yourdomain.com` (`http://localhost:3000` locally) | Recommended |
| `NEXT_PUBLIC_APP_LOCALE`         | `en`, `es`, `pt` or `ko`                                                        | Optional  |
| `META_APP_ID`                    | Meta for Developers → App Settings → Basic → **App ID** (only for image-header templates) | Optional  |
| `AUTOMATION_CRON_SECRET`         | Any long random string (only if you use "Wait" steps in automations)            | Optional  |

Generate `ENCRYPTION_KEY` (64 hex characters):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Google login and the AI keys are **not** env variables — see below.

---

## Step 4 — Turn on "Continue with Google"

Google sign-in goes through Supabase, so the keys are pasted into
Supabase, not into `.env.local`.

**A. Google Cloud (get a Client ID + Secret)**

1. Go to <https://console.cloud.google.com> → create a project (or pick one).
2. **APIs & Services → OAuth consent screen** → External → fill in app
   name + your email → Save.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized JavaScript origins:** `http://localhost:3000` and your
     live domain (e.g. `https://crm.yourdomain.com`)
   - **Authorized redirect URIs:**
     `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret**.

**B. Supabase (switch Google on)**

1. Supabase → **Authentication → Sign In / Providers → Google** → Enable.
2. Paste the **Client ID** and **Client Secret** → Save.
3. Supabase → **Authentication → URL Configuration**:
   - **Site URL:** your live URL (or `http://localhost:3000` while testing)
   - **Redirect URLs:** add both
     - `http://localhost:3000/auth/callback`
     - `https://crm.yourdomain.com/auth/callback`

That's it — the **Continue with Google** button on `/login` and
`/signup` will now work.

---

## Step 4½ — (Optional) Preview the app before you have keys

Want to click through the signed-in screens first? Put just this in
`.env.local` (leave the Supabase keys out) and run `npm run dev`:

```bash
NEXT_PUBLIC_DEMO_PREVIEW=true
```

Then open <http://localhost:3000/dashboard>. You'll be signed in as a
fake "Demo Owner": the dashboard shows sample numbers, every other page
shows its empty state, and nothing is saved. It only works in
`npm run dev`, and it switches itself off as soon as real Supabase keys
are filled in — so it can't be used on your live site.

---

## Step 5 — Run it

```bash
npm run dev
```

Open <http://localhost:3000>:

- `/` — landing page (also `/features`, `/pricing`, `/about`)
- `/signup` — create your account (Google or email)
- `/dashboard` — the CRM (after signing in)

> If port 3000 is busy, run `npm run dev -- -p 3005` and use
> `http://localhost:3005` (add that to Google + Supabase redirect lists too).

---

## Step 6 — Connect WhatsApp (inside the app)

These are entered in the app, under **Settings → WhatsApp**, and
stored encrypted in your database:

| Field                 | Where to get it                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| Phone Number ID       | Meta for Developers → your app → WhatsApp → API Setup                         |
| WhatsApp Business Account ID | Same page (WABA ID)                                                   |
| Access token          | Meta Business Settings → System users → generate a **permanent** token with `whatsapp_business_messaging` + `whatsapp_business_management` |
| Webhook verify token  | Any random string you choose                                                  |

Then in Meta → WhatsApp → **Configuration → Webhook**, paste the
webhook URL shown in the app (`https://your-domain/api/whatsapp/webhook`)
and the same verify token, and subscribe to **messages**.

> Meta needs a public **HTTPS** URL for the webhook. For local testing
> use a tunnel such as ngrok, or deploy first.

---

## Step 7 — (Optional) AI replies

Settings → **AI Assistant** → paste your **OpenAI** or **Anthropic**
API key. It's stored encrypted per account. No env variable needed.

---

## Step 8 — Make it yours

| What                          | File                                              |
| ----------------------------- | ------------------------------------------------- |
| Contact email on About page   | `src/lib/site.ts`                                 |
| Pricing plans / prices        | `src/components/marketing/pricing-plans.tsx` and `src/app/(marketing)/pricing/page.tsx` |
| Landing page text             | `src/app/(marketing)/*/page.tsx`                  |
| Demo customer photos          | `public/avatars/` (AI-generated faces, not real people) |
| Brand colours (light + dark)  | `src/app/globals.css` (the `jade` theme block)     |

---

## Security checklist before going live

Read **`SECURITY-REVIEW.md`** — the section "What YOU must switch on"
lists the Supabase dashboard settings (email confirmation, 8-character
passwords, leaked-password protection, rate limits, CAPTCHA) and the
production env vars (`NEXT_PUBLIC_SITE_URL`, `TRUSTED_CLIENT_IP_HEADER`).

---

## Deploying

Run `npm run build` then `npm start`, or deploy to Hostinger / Vercel /
Railway. Set the same environment variables in your host's panel.
