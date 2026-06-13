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

CMS 데이터는 **PostgreSQL**에 저장합니다.

### 로컬 실행 (3단계)

**1. `.env` 확인** — 프로젝트 루트에 이미 있습니다. `POSTGRES_ADMIN_PASSWORD`에 PostgreSQL **postgres** 비밀번호를 넣으세요.

**2. DB 생성 + 시드 (최초 1회)**

```powershell
npm run db:init
```

`winajes` DB·계정 생성, `cms_items` 테이블 생성, JSON 시드 데이터 import까지 자동 처리합니다.

**3. 개발 서버 실행**

```powershell
npm run dev
```

- 사이트: http://localhost:3000/ko/
- DB 확인: http://localhost:3000/api/health → `"storage": "postgres"`

> PC PostgreSQL 포트: **5432** (PostgreSQL 17). Docker 불필요.

| 환경 | 설정 |
|------|------|
| **로컬** | 루트 `.env` → `DATABASE_URL` |
| **Railway** | `DATABASE_URL=${{ Postgres.DATABASE_URL }}` |

### Optional: NestJS API + PostgreSQL (Docker 사용 시에만)

레거시 NestJS 백엔드는 Docker로 Postgres를 띄울 때만 함께 사용합니다. **Web/CMS만 쓰면 `npm run dev`만 사용**하세요.

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
