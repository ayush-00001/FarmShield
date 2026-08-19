## 🛡️ Vajra-Farm — Biosecurity Intelligence for Modern Livestock Farms

> Protecting pig and poultry farms through intelligent risk assessment, real-time disease alerts, and digital compliance tracking.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)](https://www.prisma.io/)

---

## What is Vajra-Farm?

Vajra-Farm is a full-stack biosecurity management platform built for pig and poultry farm operators and agricultural authorities. It replaces paper-based compliance logs and reactive disease response with a centralized, data-driven system — giving farms the tools to proactively monitor risk, track daily activities, and respond to outbreaks before they escalate.

---

## Features

### Risk Assessment
- 8-category biosecurity quiz covering hygiene, access control, vaccination, feed management, waste disposal, and more
- Automatic Low / Medium / High risk scoring with personalized recommendations
- Historical trend tracking so farms can measure improvement over time

### Disease Alerts
- Severity-tiered outbreak notifications (Low → Critical)
- Filter by species, location, and read status
- Source attribution and affected-species identification on every alert

### Farm Activity Logs
- Digital records for cleaning & disinfection, vaccinations, health checks, equipment maintenance, visitor logs, and more
- Status tracking per record: Completed / In Progress / Pending
- Responsible person and location fields for full accountability

### Dashboard & Analytics
- Live risk level indicator, weekly activity count, compliance score, and active alert counter
- Interactive charts: risk trend (line), risk distribution (pie), monthly activity breakdown (stacked bar)
- Built with Recharts — responsive, animated, accessible

### Authentication
- Email/password and Google OAuth sign-in
- Supabase Auth with Row Level Security (RLS) so every farm only sees its own data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Radix UI |
| Animations | Framer Motion |
| Charts | Recharts |
| ORM | Prisma |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Google OAuth |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### 1. Clone the repo

```bash
git clone https://github.com/paulpriyanshu/Vajra-Farm.git
cd Vajra-Farm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_connection_string
```

### 4. Set up the database

Apply the Supabase schema:

```bash
# Run the provided SQL against your Supabase project
# via the SQL editor or psql
psql -f supabase-schema.sql
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database & Security Notes

Vajra-Farm uses Supabase with **Row Level Security (RLS)** enabled on all tables — farms can only read and write their own records. If you run into RLS-related permission errors during setup, apply the fix script:

```bash
psql -f fix-rls-policies.sql
```

See [`RLS-FIX-GUIDE.md`](./RLS-FIX-GUIDE.md) and [`PRISMA_INTEGRATION.md`](./PRISMA_INTEGRATION.md) for detailed setup notes.

---

## Project Structure

```
├── app/
│   ├── auth/              # Login & signup pages
│   ├── components/
│   │   ├── ui/            # Reusable primitives (buttons, cards, inputs)
│   │   ├── charts/        # Recharts wrappers
│   │   ├── forms/         # Form components with validation
│   │   └── alerts/        # Disease alert components
│   ├── hooks/             # Custom React hooks (toast, auth)
│   ├── lib/               # Supabase client, utilities
│   └── globals.css        # Design tokens & global styles
├── prisma/
│   └── schema.prisma      # Database schema
├── supabase-schema.sql    # Initial DB setup
├── fix-rls-policies.sql   # RLS policy fixes
└── DISEASE_PREDICTION_GUIDE.md
```

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Deployment

**Vercel (recommended)** — connect the repo and Vercel auto-deploys on every push. Add your environment variables in the Vercel project settings.

Other options: Netlify, AWS Amplify, Railway.

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

*Vajra-Farm — because biosecurity shouldn't be an afterthought.* 🌱🛡️
