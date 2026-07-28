# Task Manager

Task Manager is a full-stack web application designed for task tracking and management. It features Role-Based Access Control (RBAC), HttpOnly JWT cookie authentication, server-side pagination, title search, and status filtering.

The system is powered by a React 19 and TypeScript frontend, an Express.js REST API backend, and a Supabase PostgreSQL database managed using Prisma ORM.

---

## Key Capabilities

- **Secure Authentication**: Authentication relies on JSON Web Tokens (JWT) issued via secure HttpOnly cookies to mitigate cross-site scripting (XSS) risks.
- **Role-Based Access Control (RBAC)**:
  - **Standard User**: Can create tasks, view only their own tasks, and update or delete tasks they created.
  - **Administrator**: Can view all tasks across the platform, update or delete any task, and filter tasks by specific user accounts.
- **Server-Side Data Operations**: Pagination (`page` and `limit`), case-insensitive title search, and status filtering (`Pending`, `In_Progress`, and `Completed`) are processed directly at the database layer through Prisma.
- **Responsive Dark User Interface**: Built with Tailwind CSS and modular component primitives (`Badge`, `Modal`, `Button`, `Input`, `Select`, `Card`).

---

## Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide React, Axios, React Hook Form, Zod
- **Backend**: Node.js, Express.js, Prisma ORM, bcryptjs, jsonwebtoken, Zod
- **Database**: Supabase PostgreSQL (Transaction Pooler and Direct Migration Connections)

---

## Getting Started

### Prerequisites

Ensure the following tools are installed on your environment:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Access to a PostgreSQL instance (such as Supabase)

---

## Environment Configuration

### 1. Backend Environment Setup

Create a `.env.development.local` file inside the `backend` directory (or duplicate `.env.example`):

```env
PORT=5500
NODE_ENV=development

# Supabase PostgreSQL Transaction Pooler (Port 6543 for runtime query execution)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Direct Connection (Port 5432 for schema migrations and DDL operations)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Authentication Configuration
JWT_SECRET=your_secret_jwt_key_here
JWT_EXPIRES_IN=1d

# Allowed Client Origin for CORS
CLIENT_URL=http://localhost:5173
```

> **Connection Details**:
> `DATABASE_URL` utilizes port `6543` with `?pgbouncer=true` for pooled transaction queries.
> `DIRECT_URL` connects via port `5432` for direct DDL migrations and schema synchronization.

### 2. Frontend Environment Setup

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5500/api/v1
```

---

## Database Initialization

After configuring your database credentials in the backend environment file, execute the following commands inside the `backend` directory:

1. **Synchronize Database Schema**:
   ```bash
   npx prisma db push
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Seed Initial Database Records**:
   ```bash
   npx prisma db seed
   ```

---

## Running the Application

### 1. Start the Backend API Server

From the `backend` directory:
```bash
npm run dev
```
The server will start listening on `http://localhost:5500`.

### 2. Start the Frontend Development Server

From the `frontend` directory:
```bash
npm run dev
```
Open `http://localhost:5173` in your web browser.

---

## API Reference

### Authentication Endpoints (`/api/v1/auth`)

- `POST /api/v1/auth/register` — Register a new account with a `user` or `admin` role.
- `POST /api/v1/auth/login` — Authenticate credentials and set an HttpOnly authentication cookie.
- `POST /api/v1/auth/logout` — Clear the authentication cookie and sign out.
- `GET /api/v1/auth/me` — Retrieve current authenticated user details.

### Task Endpoints (`/api/v1/tasks`)

- `GET /api/v1/tasks` — Retrieve paginated tasks. Supports `page`, `limit`, `search`, `status`, and `userId` query parameters.
- `GET /api/v1/tasks/:id` — Retrieve a specific task by ID.
- `POST /api/v1/tasks` — Create a new task.
- `PUT /api/v1/tasks/:id` — Update an existing task (Admin or Task Owner).
- `DELETE /api/v1/tasks/:id` — Delete a task (Admin or Task Owner).

---

## License

Distributed under the MIT License.
