# Cook and Chill

Cook and Chill is a multi-page full-stack web application that blends recipe sharing with entertainment discovery. The app is built with Node.js, Express, PostgreSQL, Prisma, EJS, and vanilla HTML/CSS/JS, and it keeps the original brand and page flow while delivering a cleaner production-ready architecture.

## Demo

- Live deployment: add your production URL here
- Demo screenshots checklist: [docs/screenshots/README.md](docs/screenshots/README.md)

Recommended capture set:

- Homepage desktop
- Homepage mobile
- Cook discovery page
- Recipe upload studio
- Saved favorites dashboard
- Login and signup flow

## Feature Highlights

- JWT-based authentication with secure password hashing
- PostgreSQL + Prisma data layer for users, recipes, favorites, ratings, and reviews
- Protected profile, saved items, and recipe management routes
- Favorites synced to authenticated user accounts instead of localStorage
- Search, sort, and filter flows for recipe and entertainment discovery
- Responsive EJS-rendered pages with reusable partials
- Helmet, rate limiting, request logging, validation, and centralized error handling

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- EJS
- Vanilla HTML, CSS, and JavaScript
- JWT Authentication

## Architecture

```text
Cook-Chill/
|-- docs/
|   `-- screenshots/
|-- prisma/
|   |-- migrations/
|   `-- schema.prisma
|-- public/
|   |-- CSS/
|   |-- IMAGES/
|   |-- JS/
|   `-- JSON/
|-- src/
|   |-- app.js
|   |-- config/
|   |-- controllers/
|   |-- lib/
|   |-- middleware/
|   |-- routes/
|   |-- utils/
|   `-- validation/
|-- views/
|   |-- pages/
|   `-- partials/
|-- .env.example
|-- index.js
|-- package.json
`-- render.yaml
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
PORT=4000
NODE_ENV=development
APP_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cook_chill?schema=public
JWT_SECRET=replace-with-a-strong-secret
```

Notes:

- `APP_URL` is used for environment-aware redirects and server logs.
- `CORS_ORIGIN` accepts a comma-separated list for multi-origin setups.
- For Neon or Supabase, paste the provided PostgreSQL connection string into `DATABASE_URL`.

## Local Development

1. Install dependencies.

```bash
npm install
```

2. Generate the Prisma client.

```bash
npm run prisma:generate
```

3. Apply local migrations.

```bash
npm run prisma:migrate -- --name init
```

4. Start the development server.

```bash
npm run dev
```

5. Open `http://localhost:4000`.

## Prisma Commands

- `npm run prisma:generate`
- `npm run prisma:migrate -- --name init`
- `npm run prisma:deploy`
- `npm run prisma:studio`

## API Overview

Public endpoints:

- `POST /signup`
- `POST /login`
- `POST /logout`
- `GET /api/homepage`
- `GET /api/cook1`
- `GET /api/chill1`
- `GET /api/recipes`
- `GET /api/reviews`
- `GET /api/ratings`

Protected endpoints:

- `POST /api/recipes`
- `PUT /api/recipes/:id`
- `DELETE /api/recipes/:id`
- `GET /api/profile`
- `PUT /api/profile`
- `PATCH /api/profile/password`
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:id`
- `POST /api/reviews`
- `POST /api/ratings`

## Authentication Flow

- Users sign up with `USERNAME`, `EMAIL`, and `PASSWORD`.
- Login issues a JWT and stores it in an `httpOnly` cookie.
- Protected pages redirect unauthenticated visitors to `/login`.
- Protected APIs return `401` JSON responses that frontend scripts handle gracefully.

## Deployment

### Render

This repository includes [render.yaml](render.yaml) for a straightforward Render deploy.

Set these environment variables in Render:

- `NODE_ENV=production`
- `APP_URL=https://your-render-domain.onrender.com`
- `CORS_ORIGIN=https://your-render-domain.onrender.com`
- `DATABASE_URL=your-neon-or-supabase-postgres-url`
- `JWT_SECRET=your-long-random-secret`

Build/start commands:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm start
```

### Railway

- Provision a PostgreSQL database or connect Neon.
- Set the same environment variables listed above.
- Use `npm start` as the start command.
- Add `npm run prisma:deploy` to the deployment pipeline before the app starts.

### Vercel

- Prefer Render or Railway for the Express server.
- If using Vercel for frontend assets only, point API traffic to the hosted Express backend and keep `CORS_ORIGIN` in sync.

## Portfolio Notes

- Add polished screenshots to `docs/screenshots/`.
- Seed a few realistic recipes and entertainment picks before recording a demo.
- Add a live deployment link near the top of this README once the app is hosted.
- Mention the PostgreSQL + Prisma migration and favorites sync in your project description for interviews.

## Production-Ready Recommendations

- Add integration tests for auth, favorites, and recipe CRUD.
- Add pagination for larger recipe and review datasets.
- Add image upload/storage if you want richer recipe cards later.
- Add a small seed script so reviewers can bootstrap realistic demo content quickly.
