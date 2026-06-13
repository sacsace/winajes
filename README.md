# WINAJES Constructions India — Corporate Website

Premium multilingual corporate website for **WINAJES Constructions India Pvt. Ltd.**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, next-intl |
| CMS | Next.js API Routes + **PostgreSQL** (`DATABASE_URL`) or local JSON fallback |
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

CMS 데이터는 **PostgreSQL**에 저장됩니다 (`DATABASE_URL` 설정 시). 로컬에서 DB 없이 개발하려면 `DATABASE_URL`을 비워 두면 JSON 파일(`apps/web/data/cms/`)로 fallback 됩니다.

### PostgreSQL (로컬)

```bash
npm run db:up
```

`apps/web/.env.local` 파일:

```
DATABASE_URL=postgresql://winajes:winajes_dev_password@localhost:5432/winajes
```

연결 확인: `http://localhost:3000/api/health` → `{ "ok": true, "storage": "postgres" }`

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

Deploy the **web app** from `apps/web`.

1. Railway → **Postgres** 서비스 생성 (이미 있으면 생략)
2. **winajes** 웹 서비스 → **Variables** → **Add Variable**
   - Name: `DATABASE_URL`
   - Value: `${{ Postgres.DATABASE_URL }}`  
     (Postgres 서비스 이름이 다르면 Railway Variables UI에서 **Reference**로 연결)
3. **Settings** → **Root Directory**: `apps/web`
4. **Redeploy**

배포 후 `https://your-app.up.railway.app/api/health` 에서 `"storage": "postgres"` 확인.

> `DATABASE_URL` 없으면 JSON fallback으로 동작하지만, **운영 환경에서는 Postgres 연결을 권장**합니다.

## License

Proprietary — WINAJES Constructions India Pvt. Ltd.
