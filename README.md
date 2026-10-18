# WaFlow — Open-Source WhatsApp CRM & Automation Platform

<p align="center">
  <img src="./public/avatars/avatar-1.webp" alt="WaFlow CRM" width="96" height="96" style="border-radius: 50%;" />
</p>

<p align="center">
  <strong>The self-hostable, multi-tenant CRM for the official WhatsApp Business Cloud API.</strong><br>
  Shared inbox, contact management, sales pipelines, broadcast campaigns, no-code visual flows, and RAG-powered AI auto-replies.
</p>

<p align="center">
  <!-- Tech Stack Badges / Buttons -->
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js%2016-Turbopack-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React%2019-UI-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Auth_%2B_Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://developers.facebook.com/docs/whatsapp/cloud-api"><img src="https://img.shields.io/badge/Meta-WhatsApp_Cloud_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Meta WhatsApp Cloud API" /></a>
  <a href="https://vitest.dev"><img src="https://img.shields.io/badge/Vitest-1500%2B_Tests_Passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest Tests" /></a>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square" alt="License: MIT" /></a>
  <a href="https://github.com/dev7070-logs/WhatsappCrm"><img src="https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github" alt="GitHub Repo" /></a>
  <img src="https://img.shields.io/badge/i18n-EN_%7C_ES_%7C_PT_%7C_KO-orange?style=flat-square" alt="Multilingual" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</p>

---

## 🎯 What is WaFlow?

**WaFlow** is a modern, enterprise-grade WhatsApp CRM and customer communication engine designed for businesses, agencies, and dev teams. Rather than paying thousands of dollars per month for locked-in SaaS seats, WaFlow gives you **100% ownership of your code, database, and customer interactions**.

Powered by **Next.js 16 (App Router & Turbopack)**, **React 19**, and **Supabase (PostgreSQL with RLS)**, WaFlow connects directly to the **official Meta WhatsApp Cloud API** to offer a blazing-fast, secure, and delightful experience across desktop, tablet, and mobile.

---

## 🧰 Tech Stack Breakdown

| Technology | Purpose | Key Details |
| :--- | :--- | :--- |
| **Next.js 16** | Frontend & Backend Framework | App Router, Turbopack, Server Actions, Server Components, Route Handlers |
| **React 19** | UI Library | React 19 concurrent features, client/server hooks, fast suspense boundaries |
| **TypeScript** | Type Safety | Strict typing throughout full codebase with zero build errors |
| **Tailwind CSS v4** | Modern Styling | CSS variable-driven themes (light/dark mode, multiple color schemes) |
| **Supabase** | Backend as a Service | PostgreSQL DB with Row Level Security (RLS), Realtime subscriptions, Auth & Storage |
| **Meta Cloud API** | WhatsApp Provider | Official WhatsApp Business Cloud API with HMAC-SHA256 signature verification |
| **@xyflow/react** | Flow Canvas | Node-based interactive chatbot builder with visual branching |
| **OpenAI / Anthropic** | AI & RAG Engine | Bring-Your-Own-Key model for AI reply suggestions and semantic auto-responses |
| **Vitest** | Automated Testing | 138 test suites with 1,500+ unit, integration, and security tests |

---

## 🚀 What's Inside WaFlow?

### 💬 1. Shared Team Inbox
- **Multi-Agent Collaboration**: Multiple team members work on a single official WhatsApp Business number.
- **Conversation Assignment**: Assign chats to specific teammates or leave them unassigned for the queue.
- **Rich Media & Interactive Support**: Send and receive text, voice notes (Opus/OGG audio), photos, videos, PDF documents, stickers, and interactive button/list replies.
- **Status & Internal Notes**: Categorize conversations as *Open*, *Pending*, or *Closed*, and write internal team notes hidden from the customer.
- **Message Reactions**: Customer and agent reaction emojis synchronized in real-time.

### 👥 2. Contact Management & Segmentation
- **Smart Contact Directory**: Search by name, phone number, or email with instant autocomplete.
- **Tagging & Custom Fields**: Assign colored labels and custom attributes (e.g. *VIP*, *Lead*, *Support Priority*).
- **Automated Deduplication**: High-performance phone number normalization (`E.164`) prevents duplicate contacts across CSV imports and incoming chats.
- **CSV Bulk Import & Export**: Import thousands of contacts with tag assignment in seconds.

### 📊 3. Visual Sales Pipelines (Kanban)
- **Drag-and-Drop Stages**: Move deals through custom pipeline stages (*Lead*, *Contacted*, *Demo*, *Won*, *Lost*).
- **Direct Chat Linkage**: Open the contact's live WhatsApp conversation directly from their deal card.
- **Multi-Currency Support**: Format deals in any currency (USD, EUR, GBP, INR, BRL, etc.) with real-time pipeline valuation.

### 📢 4. Broadcast Campaigns & Analytics
- **Official Meta Templates**: Sync and manage Meta-approved HSM message templates directly in the UI.
- **Personalized Variables**: Automatically map contact attributes (e.g. `{{1}}` = First Name) into broadcast templates.
- **Detailed Funnel Metrics**: Real-time counters for *Sent*, *Delivered*, *Read*, *Replied*, and *Failed* messages.

### ⚡ 5. No-Code Automations
- **Event-Driven Triggers**: Trigger actions on inbound messages, keyword matches, new contact creation, or scheduled cron jobs.
- **Conditional Actions**: Execute logic branches (e.g. *If tag = "VIP" then assign to Senior Agent else send auto-reply*).
- **Delayed Steps**: Add wait intervals (e.g. *Wait 2 hours, then check reply status*).

### 🤖 6. Visual Flow Chatbot Builder
- **Visual Node Canvas**: Drag-and-drop interactive chatbot creator built with `@xyflow/react`.
- **Interactive WhatsApp Elements**: Build interactive WhatsApp button menus (up to 3 buttons) and list pickers (up to 10 options).
- **Human Agent Handoff**: Seamlessly pause or exit automated flows when human assistance is requested.

### 🧠 7. Bring-Your-Own-Key AI Assistant & Knowledge Base (RAG)
- **Zero Markup / No Seat Fees**: Paste your own OpenAI or Anthropic API key; stored encrypted using AES-256-GCM.
- **1-Click AI Drafts**: Generate context-aware replies directly inside the inbox composer.
- **Autonomous Auto-Reply Bot**: Optional 24/7 auto-responder with strict anti-loop safeguards and conversation reply caps.
- **Document Grounding (RAG)**: Upload business FAQs, pricing tables, and documentation. Uses hybrid retrieval (Postgres full-text search + optional `pgvector` semantic embeddings).

### 🛡️ 8. Security & Multi-Tenant Architecture
- **Enterprise Multi-Tenancy**: Organization workspaces with role-based access control (*Owner*, *Admin*, *Agent*, *Viewer*).
- **Database Row Level Security (RLS)**: Enforced across all 25+ database tables—tenants and unauthorized users physically cannot query other users' data.
- **Cryptographic Encryption**: Access tokens and webhook signing secrets encrypted with AES-256-GCM.
- **Strict Webhook Security**: Validates HMAC-SHA256 signatures (`X-Hub-Signature-256`) on every inbound Meta webhook.
- **Production Hardening**: Rate limiting, strict Content-Security-Policy (CSP), SSRF protection on outgoing webhooks, and brute-force protections.

### 🔌 9. Public REST API & MCP Server
- **REST API (`/api/v1`)**: Programmatically send messages, manage contacts, and read conversations with revocable, scoped API keys.
- **Model Context Protocol (MCP)**: Native MCP server in `mcp-server/` allowing AI coding assistants (Claude Desktop, Cursor, Antigravity) to query your CRM via tool calling.

---

## 📁 Repository Structure

```
WaFlow/
├── src/
│   ├── app/                      # Next.js 16 App Router (Marketing, Auth, Dashboard, API)
│   │   ├── (auth)/               # Login, Signup, Password Reset, Google OAuth
│   │   ├── (dashboard)/          # Inbox, Contacts, Pipelines, Broadcasts, Automations, Flows, Settings
│   │   ├── (marketing)/          # Responsive landing page, features, pricing
│   │   └── api/                  # WhatsApp Webhook, Meta API, REST API v1, Cron, AI routes
│   ├── components/               # UI components (Radix/Base-UI, Tailwind v4, Lucide icons)
│   ├── hooks/                    # Auth, Theme, Realtime, Keyboard navigation hooks
│   ├── lib/                      # Core business logic (WhatsApp Cloud API, Encryption, Rate-limits, AI)
│   └── messages/                 # Multilingual translation dictionaries (en, es, pt, ko)
├── supabase/
│   ├── migrations/               # 55 SQL migration files (001 → 060)
│   └── WaFlow-RUN-ALL-MIGRATIONS.sql # All migrations consolidated in single runnable file
├── mcp-server/                   # Model Context Protocol (MCP) server integration
├── docs/                         # Architecture, Security, API, and Deployment documentation
└── package.json                  # Dependencies & scripts
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** >= 22.12.0
- **npm** >= 10.9.0
- A free [Supabase](https://supabase.com) account (Database & Auth)
- A [Meta for Developers](https://developers.facebook.com) account with WhatsApp Cloud API configured

### 2. Clone the Repository
```bash
git clone https://github.com/dev7070-logs/WhatsappCrm.git
cd WhatsappCrm
npm install
```

### 3. Environment Setup
Copy the template environment file:
```bash
cp .env.local.example .env.local
```
Fill in your credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ENCRYPTION_KEY=your-64-character-hex-encryption-key
META_APP_SECRET=your-meta-app-secret
META_APP_ID=your-meta-app-id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
*(Tip: Generate an `ENCRYPTION_KEY` via `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)*

### 4. Database Setup
1. Open your Supabase Project → **SQL Editor** → **New Query**.
2. Open [`WaFlow-RUN-ALL-MIGRATIONS.sql`](./WaFlow-RUN-ALL-MIGRATIONS.sql), paste the content, and click **Run**. All 55 tables, triggers, and RLS policies will be created automatically.

### 5. Launch the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Webhook Configuration (Local Testing)

Meta requires an **HTTPS** callback URL to deliver incoming customer messages:
1. Start a Cloudflare quick tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
2. In the WaFlow App (**Settings → WhatsApp**), save your Phone Number ID, WABA ID, Permanent Access Token, and a chosen Webhook Verify Token.
3. In [Meta for Developers](https://developers.facebook.com) → Your App → **WhatsApp** → **Configuration**:
   - **Callback URL:** `https://<your-tunnel-subdomain>/api/whatsapp/webhook`
   - **Verify Token:** The exact verify token saved in Step 2.
   - Subscribe to the **`messages`** webhook field.

---

## 🧪 Testing & Code Quality

WaFlow maintains rigorous test coverage with over 1,500 automated tests:
```bash
npm run typecheck     # TypeScript compiler check
npm run test          # Run Vitest test suite
npm run lint          # Run ESLint rules
npm run build         # Production Turbopack build
```

---

## 🚢 Production Deployment

WaFlow is a standard Next.js 16 application and can be deployed on:
- **Hostinger Managed Node.js** (One-click Git deploy, free SSL, global CDN)
- **Vercel** (`vercel deploy`)
- **Docker / VPS** (Dockerfile and `docker-compose.yml` included in root)
- **Railway / Render**

See [docs/deployment.md](./docs/deployment.md) for complete production deployment guides.

---

## 📄 License

This project is open-source and released under the [MIT License](./LICENSE). Feel free to fork it, customize it, and deploy it for your organization or clients!
