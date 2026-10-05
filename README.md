# CampusFix (free-hosting version)

One server = website + API. Data is stored in **Turso** (free cloud SQLite), photos too, so nothing is lost when a free host restarts.

## Run on your PC
1. `npm install`
2. Copy `.env.example` to `.env` and fill it (leave TURSO_URL/TURSO_TOKEN empty to use a local file `campusfix.db`).
3. `npm start` and open http://localhost:3000

## Go live for free (Turso + Render free + UptimeRobot)
1. turso.tech: create a free account (no card), create a database, copy its URL (`libsql://...`) and create a token.
2. Put the code on GitHub (package.json must be at the repo root; never upload `.env`).
3. render.com: New > Web Service > your repo. Build `npm install`, Start `npm start`, plan **Free**.
4. Render environment variables: NODE_VERSION=22, JWT_SECRET, ADMIN_INVITE_CODE, ADMIN_USER, ADMIN_PASS, TURSO_URL, TURSO_TOKEN.
5. uptimerobot.com (free): add an HTTP monitor for `https://YOUR-APP.onrender.com/api/health` every 5 minutes, so the free server stays awake.

## Accounts