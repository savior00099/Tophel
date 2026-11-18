# Tophel — 1-Year 12-Sector Transformation & Execution Engine

Tophel is a full-featured, responsive progress and deadline tracking web application engineered for high-discipline execution.

Built with **React 18 + Vite + Tailwind CSS + Firebase Auth & Firestore**, featuring a luxury dark-mode aesthetic with Fluorescent Lime (`#84cc16`), Crisp White, and Obsidian Black accents.

---

## ⚡ Key Architecture & Features

### 1. Smart Day-Aware Daily Quotas
- **Sleep & Recovery (7 Days/Wk):** Bed 2:00 AM – 3:00 AM | Wake 10:00 AM – 10:30 AM (7.0–8.5 hrs).
- **Cardio & Weight Loss (Sun – Thu | Rest: Fri & Sat):** ~2 hours conditioning (11:00 AM – 1:00 PM). Automatically shows **"Scheduled Recovery Day"** on Fridays and Saturdays.
- **Hard Diet — 2-Meal Structure (7 Days/Wk):** Portion-controlled "diet dinner" at lunch (protein & veggies first, cut excess rice/carbs, zero sugar/fried) + light dinner.
- **AI Engineering + March 2027 SAT (7 Days/Wk):** Post-lunch study block. Splits between AI syllabus & SAT drills through Sector 4; auto-switches to **100% AI Engineering** from Sector 5 onward!
- **4-Hour Night Block (Mon – Thu vs. Fri – Sun):**
  - **Mon – Thu:** Locked 4+ hours live night trading & backtesting (16 nights/month target).
  - **Fri – Sun:** Protected 4-hour off-duty recharge block (movies, small games, mental reset).

### 2. Game Enforcement Rules
- **85% Sector Clearance Rule:** Live completion percentage. Unlock the next sector on the 18th checkpoint date with ≥85%.
- **"Never Miss Twice" Streak Alert:** Red emergency banner triggered if any active pillar is missed two consecutive days in a row.
- **Protected Fri–Sun Recharge:** Keeps weekend nights free from market charts to preserve Monday–Thursday sharpness.

### 3. Master 12-Sector Roadmap (Nov 18, 2026 – Nov 18, 2027)
- Pre-populated specifically for `as3625525@gmail.com` with the exact 12 monthly sectors from the PDF roadmap:
  - **Sector 01 (Dec 18, 2026)** — EASY (Bootcamp): Lock the Base Loop
  - **Sector 02 (Jan 18, 2027)** — EASY (Momentum): Eliminate Friction
  - **Sector 03 (Feb 18, 2027)** — EASY+ (Pre-Boss): SAT Simulation & Stamina
  - **Sector 04 (Mar 18, 2027)** — INTERMEDIATE (Boss 1: SAT): Conquer March SAT
  - **Sector 05 (Apr 18, 2027)** — INTERMEDIATE (Acceleration): 100% AI Focus Unlocked
  - **Sector 06 (May 18, 2027)** — INTERMEDIATE (Halftime Boss): 6-Month Transformation Audit
  - **Sector 07 (Jun 18, 2027)** — HARD (Deep Build): Build Real AI Systems
  - **Sector 08 (Jul 18, 2027)** — HARD (Proof of Work): Portfolio & Edge
  - **Sector 09 (Aug 18, 2027)** — HARD (Endurance): Zero-Excuse Grind
  - **Sector 10 (Sep 18, 2027)** — BOSS LEVEL (Launchpad): Career Positioning
  - **Sector 11 (Oct 18, 2027)** — BOSS LEVEL (Execution): Market & Career Push
  - **Sector 12 (Nov 18, 2027)** — FINAL BOSS (New Life): 1-Year Completion Lock

### 4. Separate Workspace for Other Users & Strict Privacy
- Other users receive a personalized workspace with an Electric Cyan theme and customizable blueprints (AI Engineering, Body Recomposition, Exam Prep, Solo Founder).
- **Zero Data Leaks:** Users can never see each other's private notes or proof vaults.
- **Admin Command Deck (`/admin`):** Only accessible by `as3625525@gmail.com` to review platform user statistics.

---

## 🚀 Running Locally & Preview

```bash
cd hitmark-app
npm install
npm run dev
```

Visit `http://localhost:5173`. You can immediately click:
- 👑 **Launch as Master Admin (`as3625525@gmail.com`)** to explore the complete PDF 12-sector roadmap, trading journal, and admin deck.
- ⚡ **Launch as New User** to explore the custom goal builder and template picker.

---

## 🌐 Deploying to Vercel

Tophel is ready for 1-click deployment on Vercel:

1. Push your repository to GitHub.
2. In Vercel, import the repository and set the root directory to `hitmark-app`.
3. Framework Preset: **Vite** (Build command: `npm run build`, Output directory: `dist`).
4. Click **Deploy**. SPA rewrites are already configured in `vercel.json`!

---

## 🔑 Connecting Your Live Firebase Account

When you're ready to switch from local preview to live Google login and cloud sync:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Under **Authentication**, enable the **Google** sign-in provider.
3. Under **Firestore Database**, create a database and deploy `firestore.rules`.
4. Copy your project web credentials and paste them in `.env` (or add them in Vercel Environment Variables):

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
