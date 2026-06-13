# WINAJES Constructions India — Corporate Website

Premium multilingual corporate website for **WINAJES Constructions India Pvt. Ltd.**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, next-intl |
| CMS | Next.js API Routes + local JSON store (`apps/web/data/cms/`) |
| Backend (optional) | NestJS + PostgreSQL (`apps/api/`) |

## Quick Start (Web only — no separate API server)

### Prerequisites

- Node.js 20+

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

- **Website**: http://localhost:3000/ko/
- **Admin CMS**: http://localhost:3000/admin

### Admin Login (default)

- Email: `admin@winajes.com`
- Password: `admin123`

CMS 데이터는 `apps/web/data/cms/*.json`에 저장됩니다. 별도 DB나 `:3001` API 서버 없이 개발할 수 있습니다.

### Optional: NestJS API + PostgreSQL

레거시 NestJS 백엔드를 함께 실행하려면:

```bash
npm run db:up
npm run dev:all
```

NestJS API: http://localhost:3001 — `NEXT_PUBLIC_API_URL=http://localhost:3001` 설정 시 외부 API를 사용합니다.

**Docker Desktop**이 설치·실행되어 있어야 `npm run db:up`이 동작합니다. Docker 없이는 NestJS API를 켜지 마세요.

### PostgreSQL 인증 오류 (`password authentication failed for user "postgres"`)

`npm run dev:all` 또는 `dev:api` 실행 시 나는 오류입니다. **Web/CMS만 쓰면 무시하고 `npm run dev`만 사용**하세요.

NestJS API가 필요할 때:

1. PC에 **Docker Desktop** 설치 후 `npm run db:up` (DB: 사용자 `winajes` / 비밀번호 `winajes_dev_password`)
2. `apps/api/.env`가 `.env.example`과 같은지 확인
3. 로컬 PostgreSQL(5432)을 쓰는 경우 — Windows 기본 `postgres` 계정과 충돌할 수 있음. Docker DB를 쓰거나 `.env`의 `DB_USER`/`DB_PASSWORD`를 로컬 DB에 맞게 수정

## Project Structure

```
winajes/
├── apps/
│   ├── web/          # Next.js frontend + Admin CMS + local API
│   └── api/          # (Optional) NestJS backend
├── packages/
│   └── shared/
└── package.json
```

## Language URLs

| Page | Korean | English |
|------|--------|---------|
| Home | `/ko/` | `/en/` |
| About | `/ko/about` | `/en/about` |
| Services | `/ko/services` | `/en/services` |
| Projects | `/ko/projects` | `/en/projects` |
| Contact | `/ko/contact` | `/en/contact` |

## Deploy (Railway)

This repo is an **npm workspace monorepo**. Deploy from the **repository root**, not `apps/web`.

1. Railway → Service → **Settings**
2. **Root Directory**: leave **empty** (do not set `apps/web`)
3. **Build Command**: `npm ci && npm run build:web` (or use root `railway.toml`)
4. **Start Command**: `npm run start:web`
5. Redeploy

`@winajes/shared` lives in `packages/shared` and is linked only when `npm ci` runs at the monorepo root.

> CMS JSON and uploaded files are stored on the local filesystem. For production, attach a Railway volume or migrate to external storage if you need persistent admin edits.

## License

Proprietary — WINAJES Constructions India Pvt. Ltd.
