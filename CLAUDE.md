# CLAUDE.md — TiKit Zero

## Project Overview

**TiKit Zero** is a personal rehabilitation (개인회생) consultation landing page for "더엘 법률사무소" (The L Law Office). Users complete an 8-step debt assessment survey, verify their phone via SMS, and receive a calculated monthly payment reduction estimate based on 2026 Korean living expense standards.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + inline React styles with a custom color palette (`P` object in `page.tsx`)
- **External APIs**: Google Sheets (verification data), Notion (CRM/survey storage), Aligo (SMS), Kakao Open Chat

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── sms/
│   │   │   ├── send/route.ts      # SMS verification code generation & sending
│   │   │   └── verify/route.ts    # SMS code validation against Google Sheets
│   │   └── submit/route.ts        # Survey & consultation data submission
│   ├── layout.tsx                  # Root layout with metadata & fonts
│   ├── page.tsx                    # Main single-page application (all UI + logic)
│   └── globals.css                 # Global styles, fonts, CSS animations
└── lib/
    ├── notion.ts                   # Notion API client (survey & consultation DB writes)
    └── sheets.ts                   # Google Sheets API client (service account auth)
```

Root config files: `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run Next.js linter
```

No test framework is configured.

## Architecture & Key Patterns

### Application Flow (Phase-Based)

The app uses React `useState` to manage a multi-phase flow in `src/app/page.tsx`:
1. **Landing** — Lawyer introduction and CTA
2. **Questionnaire** — 8-step survey (debt range, debt type, housing, job, income, family, overdue period, lawsuit status)
3. **Phone Verification** — SMS code via Aligo API, stored in Google Sheets
4. **Results** — Calculated monthly payment and reduction percentage

### Data Storage (Dual-Write)

- **Google Sheets**: Verification tracking (인증), survey answers (설문), consultation records (상담) — 3 sheets in one spreadsheet
- **Notion**: Parallel storage for CRM — separate databases for verification, survey, and consultation

### Calculation Logic

Monthly payment is calculated as: `max(income - livingCost[familySize], 0)` over 36 months. Reduction rate is `min(max(round((1 - total36/debt) * 100), 0), 90)` — capped at 90%.

Living cost standards are hardcoded for 2026 in `page.tsx` (`LIVING_COST_2026` map).

### Styling Conventions

- Most component styling uses inline `style` objects with the `P` color palette constant
- Tailwind classes are used primarily for animations (`.slide-up`, `.scale-in`)
- CSS animations defined in `globals.css` (slideUp, scaleIn, spin, pulse)

## Environment Variables

All required for production:

| Variable | Purpose |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | GCP service account email |
| `GOOGLE_PRIVATE_KEY` | GCP service account private key |
| `GOOGLE_SHEET_ID` | Target Google Spreadsheet ID |
| `NOTION_API_KEY` | Notion integration token |
| `NOTION_VERIFY_DB_ID` | Notion verification database ID |
| `NOTION_SURVEY_DB_ID` | Notion survey database ID |
| `NOTION_CONSULT_DB_ID` | Notion consultation database ID |
| `ALIGO_API_KEY` | Aligo SMS API key (optional — test mode without it) |
| `ALIGO_USER_ID` | Aligo account ID |
| `ALIGO_SENDER` | SMS sender phone number |

## Development Notes

- The entire UI lives in a single `page.tsx` file (~685 lines). All phases, survey steps, and result rendering are co-located there.
- No component extraction or global state management — keep changes scoped within the existing pattern.
- Korean language throughout the UI. All user-facing text is in Korean.
- Images (`d.jpg`, `2026-03-09 17 03 54.jpg`) are stored in the project root and referenced directly.
- API routes use Next.js Route Handlers (App Router `route.ts` pattern).
- Google Sheets auth uses service account JWT via `googleapis`.
