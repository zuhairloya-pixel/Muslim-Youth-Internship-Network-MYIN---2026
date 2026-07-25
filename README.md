# MYIN — Muslim Youth Internship Network

A polished, interactive hackathon MVP for an opportunity network that connects
Muslim students with internships, volunteer roles, mentorships, and meaningful
community projects.

The core demo runs locally without external services. The opportunity extraction
flow uses Gemini when a private API key is configured.

## What is included

- Mission-led landing page
- Student dashboard with personalized opportunity matches
- Transparent 100-point match breakdown
- Save, dismiss, search, filter, and express-interest interactions
- Editable student profile
- Daily opportunity email preview
- Organization dashboard
- AI-style opportunity extraction and review flow
- Privacy-safe student recommendations
- Impact and trust dashboard
- Responsive layouts for desktop, tablet, and mobile
- Browser persistence for student actions using local storage

## Run it in VS Code

### Easiest Windows option

Open the project folder and double-click `START-MYIN.cmd`, or run this from the
VS Code terminal:

```powershell
.\START-MYIN.cmd
```

The launcher uses a normal Node/npm installation when available. When npm is not
on the computer's PATH, it can use the Node runtime bundled with Codex.

### Requirements

- Node.js 22.13 or newer
- npm, which is included with a standard Node.js installation

### Start the project

Open the unzipped folder in VS Code, open **Terminal → New Terminal**, and run:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your private Google AI Studio key to `.env.local` before using the
opportunity extraction flow:

```text
GEMINI_API_KEY=your-private-key
```

Never commit `.env.local` or expose the key in browser code.

Then open:

```text
http://localhost:3000
```

Stop the server with `Ctrl+C`.

## Recommended demo flow

1. Start on the landing page and select **See Amina's matches**.
2. Open the 93% digital-media match and show the scoring breakdown.
3. Save the opportunity or express interest.
4. Preview Amina's daily email.
5. Switch to **Organization demo**.
6. Select **Submit opportunity** and extract the sample food-drive request.
7. Review and edit the structured fields, then submit it for safety review.
8. Open **Student matches** to show privacy-safe candidate recommendations.
9. Finish on the **Impact** dashboard.

## How the local demo works

This version is intentionally self-contained:

- Opportunity data is seeded in `app/page.tsx`.
- Save, dismiss, and interest actions are stored in the browser.
- The opportunity extraction flow sends the organization-provided description
  to Gemini from a server-only route and returns structured fields for review.
- The Gemini key remains server-side and missing information is left blank
  instead of being invented.
- No real student data, authentication, email, messaging, or application is
  transmitted.

For production, opportunity and profile data should move to a database, the
extraction endpoint should receive application authentication and durable rate
limiting, and all student-organization introductions should pass through
authenticated consent and moderation workflows.

## Match scoring

The demo uses the MYIN 100-point rubric:

| Factor | Points |
| --- | ---: |
| Interests | 25 |
| Skills | 20 |
| Career goals | 15 |
| Availability | 15 |
| Eligibility | 10 |
| Location and format | 10 |
| Opportunity-type preference | 5 |

Eligibility should be checked before preference ranking in a production version.
An ineligible student should never rank highly because of otherwise strong
preferences.

## Useful commands

```bash
npm run dev
npm run build
npm test
npm run lint
```

## Main files

- `app/page.tsx` — product screens, demo data, and interactions
- `app/globals.css` — complete responsive visual system
- `app/layout.tsx` — title, description, and social metadata
- `public/og.png` — MYIN social preview artwork

## Important safety note

This is a hackathon demonstration, not a production youth-safeguarding system.
Production use requires verified identities, guardian-consent rules, data
minimization, audit logging, moderation operations, reporting procedures, and
legal review appropriate to the regions and ages served.
