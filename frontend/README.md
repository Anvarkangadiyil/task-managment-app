# Task Manager Frontend

The client-side interface for Task Manager, built with React 19, Vite, TypeScript, and Tailwind CSS.

---

## Component Architecture

The frontend follows a modular component structure using reusable Shadcn-style UI primitives:

- **`src/components/ui/`**: Base UI primitives (`Badge`, `Modal`, `Button`, `Input`, `Select`, `Card`, `Alert`).
- **`src/components/navbar/`**: Header navigation components (`NavBrand`, `UserProfileMenu`).
- **`src/components/dashboard/`**: Dashboard view sections (`TaskFilterToolbar`, `TaskList`, `WorkspaceBanner`).
- **`src/pages/`**: Main pages (`LoginPage`, `RegisterPage`, `DashboardPage`).
- **`src/context/`**: Global state providers (`AuthContext`).
- **`src/services/`**: API interaction services (`authService.ts`, `taskService.ts`).

---

## Environment Setup

Create a `.env` file in the `frontend` root directory:

```env
VITE_API_URL=http://localhost:5500/api/v1
```

Refer to `.env.example` for reference settings.

---

## Available Scripts

In the `frontend` directory, you can run:

### `npm run dev`
Starts the Vite development server on `http://localhost:5173`.

### `npm run build`
Compiles TypeScript and builds the production-ready application inside the `dist` directory.

### `npx tsc --noEmit`
Runs the TypeScript type checker to verify code correctness without producing build output.

---

## Features

- **Authentication & Protected Routing**: Handled via `AuthContext`, `ProtectedRoute`, and `PublicOnlyRoute`.
- **Role-Based Views**: Dynamic UI controls adapted to `user` or `admin` roles.
- **Server-Side Pagination & Filtering**: Real-time search, status filter, and page navigation controls.
