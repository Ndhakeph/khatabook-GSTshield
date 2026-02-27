# GST Shield

A proactive GST compliance checker that validates vendor tax status before payment, built for Indian freelancers and small businesses.

**[Live Demo](https://khatabook-ai-hackathon-7j33.vercel.app/)**

## Why I Built This

I built this for a hackathon after learning about a frustrating problem in Indian tax compliance: if you pay a vendor and claim Input Tax Credit (ITC), but that vendor never files their GST return, your ITC claim gets rejected during audit. You effectively pay the tax twice—a 36% loss on the expense.

Existing accounting software only tracks expenses *after* payment. By then, the damage is done. I wanted to build something that checks vendor compliance *before* you commit to paying, so you can make informed decisions upfront.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│           Next.js 15 / React 19 / Tailwind CSS              │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Serverless)                   │
│        /api/scan  •  /api/compliance  •  /api/chat          │
└──────────┬────────────────────────────┬─────────────────────┘
           │                            │
           ▼                            ▼
┌────────────────────┐      ┌────────────────────────────────┐
│   Claude 3.5       │      │         Supabase               │
│   Sonnet           │      │   • expenses table             │
│   • Vision OCR     │      │   • compliance_checks          │
│   • Chat queries   │      │   • Row Level Security         │
└────────────────────┘      └────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│              GSTIN Validation (Mock DB for MVP)             │
└─────────────────────────────────────────────────────────────┘
```

**The flow:**
1. User uploads a receipt image (can be crumpled, handwritten, Hindi-English mixed)
2. Claude's vision API extracts merchant name, GSTIN, amount, and line items
3. System checks the GSTIN against compliance database
4. Dashboard shows status: SAFE (pay), FAILED (block), or PENDING (hold tax portion)

There's also a chat interface where you can ask natural language questions about your expenses ("Which vendor has the highest pending ITC?").

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (serverless on Vercel)
- **Database**: Supabase (PostgreSQL with RLS)
- **AI**: Claude 3.5 Sonnet via FastRouter for receipt OCR and chat
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- FastRouter API key

### Setup

```bash
git clone https://github.com/tacitusblindsbig/khatabook-ai-hackathon.git
cd khatabook-ai-hackathon
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FASTROUTER_API_KEY=your_fastrouter_api_key
```

Run the Supabase schema:

```bash
# Run supabase/schema.sql in Supabase SQL Editor
# This creates the compliance_records table and seeds demo data
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the receipts in `public/test-receipts/` to test scanning.

## Project Structure

```
app/
├── api/
│   ├── scan/route.ts        # Receipt OCR endpoint
│   ├── compliance/route.ts  # GSTIN validation
│   ├── chat/route.ts        # AI chat queries
│   └── gstr3b/route.ts      # GSTR-3B report generation
├── chat/page.tsx
├── compliance/page.tsx
└── layout.tsx
lib/
├── services/
│   ├── ai-service.ts        # Claude API wrapper
│   └── compliance-service.ts
└── db/
    └── supabase.ts
```

## What I Learned

The hardest part wasn't the AI integration—Claude's vision API handled receipt parsing better than I expected, even on low-quality images. The real challenge was understanding the GST compliance domain itself: learning what GSTIN formats look like, how ITC claims work, and why the timing of compliance checks matters. I also underestimated how much UI work goes into making a dashboard feel useful rather than just showing data. If I rebuilt this, I'd spend more time on the compliance service architecture—right now it uses a mock database, and integrating with the actual GST Network API would require handling rate limits, authentication flows, and stale data differently than I structured it.

## License

MIT
