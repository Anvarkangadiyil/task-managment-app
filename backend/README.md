# Task Manager Backend API

The RESTful API backend for Task Manager, built with Node.js, Express.js, Prisma ORM, and Supabase PostgreSQL.

---

## Directory Structure

- **`controllers/`**: Request handlers (`auth.controller.js`, `tasks.controller.js`).
- **`middleware/`**: Middleware handlers (`auth.middleware.js` for JWT/RBAC, `validate.middleware.js` for Zod schema validation, `error.middleware.js` for error handling).
- **`routes/`**: Route definitions (`auth.routes.js`, `tasks.routes.js`).
- **`validators/`**: Input validation schemas powered by Zod (`auth.validator.js`, `task.validator.js`).
- **`prisma/`**: Prisma database schema and migration configurations (`schema.prisma`).

---

## Environment Setup

Create a `.env.development.local` (or `.env`) file in the `backend` root directory:

```env
PORT=5500
NODE_ENV=development

# Supabase Transaction Pooler (Port 6543)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Direct Migration Connection (Port 5432)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Authentication Secrets
JWT_SECRET=your_secret_jwt_key
JWT_EXPIRES_IN=1d

# Allowed Frontend CORS Origin
CLIENT_URL=http://localhost:5173
```

Refer to `.env.example` for reference settings.

---

## Database Management Commands

Inside the `backend` directory, run:

### `npx prisma db push`
Synchronizes the Prisma schema directly with your Supabase PostgreSQL database.

### `npx prisma generate`
Generates the Prisma Client TypeScript/JavaScript definitions based on `schema.prisma`.

### `npx prisma db seed` (or `npm run db:seed`)
Populates the database with initial sample users (admin and standard users) and sample tasks.

---

## Available Scripts

### `npm run dev`
Launches the API server in development mode with automatic restarts (`nodemon`).

### `npm start`
Launches the API server in production mode.

---

## API Base Endpoints

- **Auth**: `/api/v1/auth` (`register`, `login`, `logout`, `me`)
- **Tasks**: `/api/v1/tasks` (`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`)
