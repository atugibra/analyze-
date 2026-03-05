# ⚡ FootballIQ — Full-Stack Football Analytics Platform

## What's included

| Layer | Tech | Purpose |
|---|---|---|
| Database | PostgreSQL (Supabase) | Production cloud DB |
| API | Python FastAPI | REST backend on Render.com |
| Importer | Python + openpyxl | Loads Excel → database |
| Frontend | React + Vite | 10-screen dashboard on Vercel |
| Extension | Chrome Extension | Scrapes FBref, syncs to API |

---

## Quick Setup

### 1. Database (Supabase)
1. Go to [supabase.com](https://supabase.com) → New Project
2. Open SQL Editor → run files in order:
   - `db/01_schema.sql`
   - `db/02_triggers.sql`
   - `db/03_seed_leagues.sql`
3. Copy your connection string from Settings → Database

### 2. API (Local or Render.com)
```bash
cd api
pip install -r requirements.txt
cp .env.example .env
# Fill in DATABASE_URL from Supabase
python main.py
# API runs at http://localhost:4000
# Swagger docs at http://localhost:4000/docs
```

### 3. Import Excel Data
```bash
cd importer
python import_excel.py --file "C:/Users/LATIB PRO/Downloads/download (1).xlsx"
```

### 4. React Dashboard (Local)
```bash
cd frontend
npm install
npm run dev
# Dashboard at http://localhost:5173
```

### 5. Update Chrome Extension
In `backend_sync.js` line 9:
```js
// Change from:
this.backendUrl = 'http://localhost:4000';
// To (after Render.com deployment):
this.backendUrl = 'https://YOUR-APP.onrender.com';
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/leagues` | All leagues |
| GET | `/api/teams` | All teams |
| GET | `/api/matches` | Fixtures with filters |
| PUT | `/api/matches/:id` | Update result |
| DELETE | `/api/matches/:id` | Delete match |
| GET | `/api/standings` | League tables |
| GET | `/api/squad-stats` | Team stats |
| GET | `/api/players` | Player stats |
| GET | `/api/players/top-scorers` | Top scorers |
| GET | `/api/teams/:id/head-to-head/:oppId` | H2H history |
| POST | `/api/sync/all` | Bulk sync (from extension) |
| POST | `/api/sync/fixtures` | Sync fixtures only |
| POST | `/api/sync/stats` | Sync squad stats |
| POST | `/api/sync/player-stats` | Sync player stats |

Full interactive docs: `http://localhost:4000/docs`
