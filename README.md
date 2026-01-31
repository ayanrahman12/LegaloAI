# LegaloAI

LegaloAI is a full-stack compliance platform for tracking DPDP Act obligations, citations, and evidence.

## Local setup

```bash
cp .env.example .env
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

## API (Postman-ready)

Base URL: `http://localhost:3000/api`

### Obligations
- `GET /obligations`
- `POST /obligations`

```json
{
  "title": "Consent withdrawal SLA",
  "description": "Ensure withdrawal requests are actioned within 7 days",
  "status": "Open",
  "owner": "Privacy Office",
  "dueDate": "2024-12-01"
}
```

### Citations
- `GET /citations`
- `POST /citations`

```json
{
  "title": "DPDP Act Section 6",
  "section": "6(1)",
  "summary": "Consent requirements",
  "obligationId": "<obligation-id>"
}
```

### Evidence
- `GET /evidences`
- `POST /evidences`

```json
{
  "title": "Consent log export",
  "type": "CSV",
  "storageUrl": "s3://bucket/consent-log.csv",
  "obligationId": "<obligation-id>"
}
```

### Companies
- `GET /companies`
- `POST /companies`

```json
{
  "name": "Acme Corp",
  "industry": "Fintech",
  "location": "Bengaluru"
}
```

### Users
- `GET /users`
- `POST /users`

```json
{
  "name": "Asha Rao",
  "email": "asha@acme.com",
  "role": "Compliance Lead",
  "companyId": "<company-id>"
}
```

## Vercel deployment (free tier)

1. Push this repo to GitHub.
2. Create a free Vercel project and import the repo.
3. Add the `DATABASE_URL` environment variable in Vercel. Use a hosted Postgres (recommended) or an external SQLite-compatible service.
4. Run Prisma migrations in your CI or locally against the hosted DB.

> For production, use Postgres or Vercel Postgres for persistence.
