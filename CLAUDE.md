# CLAUDE.md — 티킷제로 (Personal Insolvency Consultation Landing Page)

## Project Overview

A conversational survey landing page for **더엘 법률사무소** (The L Law Office) that collects financial information from users seeking personal insolvency consultation. It calculates estimated monthly repayment amounts based on 2026 South Korean living expense standards and submits consultation requests.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript (strict mode)
- **Styling:** Tailwind CSS 4.2 + inline style objects with a palette constant (`P`)
- **Database:** Notion API (primary data store) + Google Sheets API (verification)
- **SMS:** Aligo API for phone number verification
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── sms/
│   │   │   ├── send/route.ts      # SMS code delivery via Aligo
│   │   │   └── verify/route.ts    # SMS code verification
│   │   └── submit/route.ts        # Survey data submission to Notion
│   ├── globals.css                # Global styles, animations, fonts
│   ├── layout.tsx                 # Root layout with SEO metadata
│   └── page.tsx                   # Main app (survey flow, calculations, UI)
└── lib/
    ├── sheets.ts                  # Google Sheets integration
    └── notion.ts                  # Notion database integration
```

### Key file: `src/app/page.tsx` (~684 lines)

Contains all client-side logic in a single file:
- Color palette (`P` object) and constants
- Question definitions (`QUESTIONS` array)
- Living cost lookup table (`LIVING_COST`)
- Calculation logic (`calcResult`)
- All UI components: `LandingPage`, `QuestionStep`, `VerifyStep`, `ResultPage`, `CircleProgress`, `OptionButton`, `KakaoBanner`, `OfficeInfo`
- Main `Home` component with state management

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (Next.js built-in)
```

## Code Conventions

- **Components:** PascalCase (`Home`, `QuestionStep`, `ResultPage`)
- **Constants:** UPPER_SNAKE_CASE (`QUESTIONS`, `LIVING_COST`, `KAKAO_LINK`)
- **Functions:** camelCase (`calcResult`)
- **Module system:** ES modules with `@/*` path alias mapping to `./src/*`
- **Styling:** Inline style objects using the `P` palette constant; minimal CSS class usage
- **Client rendering:** Main page uses `"use client"` directive
- **Language:** UI text is in Korean; variable names mix English and Korean context

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | GCP service account email |
| `GOOGLE_PRIVATE_KEY` | GCP private key |
| `GOOGLE_SHEET_ID` | Google Sheets document ID |
| `NOTION_API_KEY` | Notion API access token |
| `NOTION_SURVEY_DB_ID` | Notion survey database ID |
| `NOTION_CONSULT_DB_ID` | Notion consultation database ID |
| `NOTION_VERIFY_DB_ID` | Notion verification database ID |
| `ALIGO_API_KEY` | Aligo SMS API key |
| `ALIGO_USER_ID` | Aligo account user ID |
| `ALIGO_SENDER` | SMS sender phone number |

## User Flow

1. **Landing page** — Introduction with lawyer photos and Kakao consultation link
2. **8-step survey** — Debt amount, debt type, housing, employment, income, family size, overdue months, lawsuit status
3. **SMS verification** — 6-digit code sent via Aligo, 3-minute expiry
4. **Results page** — Estimated monthly repayment and debt reduction rate

## Calculation Logic

Located in `calcResult()` in `page.tsx`:
- Uses `LIVING_COST` lookup table (2026 government living expense standards by family size)
- Monthly payment = max(income − living_expenses, 0)
- Debt reduction rate = (1 − (monthly_payment × 36) / total_debt) × 100%, capped at 90%

## Testing

No test framework is configured. No test files exist.

## CI/CD

No CI/CD pipeline configured. Deployment is manual via Vercel.

## Git

- Primary branch: `master`
- No conventional commit format enforced
- No pre-commit hooks configured
