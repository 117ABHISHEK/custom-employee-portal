# BrainWave Employee Portal — Zoho One Integration

A custom employee portal with JWT-based authentication and Role-Based Access Control (RBAC), integrating with Zoho One APIs via a single backend service account. Employees log in with portal credentials and see only the Zoho applications their role permits — no individual Zoho credentials required.

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Zoho Integration:** OAuth 2.0 refresh-token flow (service account)

## Role → Zoho App Mapping
| Role    | Zoho App     |
|---------|--------------|
| Admin   | All apps + user/role management + audit logs |
| HR      | Zoho People  |
| Sales   | Zoho CRM     |
| Support | Zoho Desk    |
| Finance | Zoho Books   |

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Zoho One account with API Console access

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd custom-employee-portal
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see `.env.example` for the template):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_ACCOUNTS_DOMAIN=accounts.zoho.in
ZOHO_API_DOMAIN=www.zohoapis.in
ZOHO_BOOKS_ORG_ID=your_zoho_books_org_id
```

**Getting Zoho credentials:**
1. Sign up for a Zoho One free trial and enable People, CRM, Desk, and Books.
2. Register a Server-based Application at [api-console.zoho.com](https://api-console.zoho.com) to get your Client ID/Secret.
3. Generate a refresh token via the OAuth authorization-code flow (see `/docs` or code comments in `src/services/zohoService.js` for the exact URL format).

### 3. Seed the database
Populates Roles, Permissions, and RolePermissions:
```bash
npm run seed
```

### 4. Create the first Admin user
```bash
npm run bootstrap
```
This creates `admin@brainwave.com` / `Admin@123` with the Admin role. **Change this password after first login.**

### 5. Start the backend
```bash
npm run dev
```
Server runs at `http://localhost:5000`. Health check: `GET /api/health`.

### 6. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
App runs at `http://localhost:3000`.

## Usage
**Live site:** https://custom-employee-portal-inky.vercel.app

1. Go to the live site (or `http://localhost:3000/login` if running locally) and log in with the bootstrap Admin credentials.
2. From the Admin Panel, create additional users and assign them roles (HR, Sales, Support, Finance).
3. Log in as each role to see the dashboard render only their authorized Zoho app.

## Project Structure
```
custom-employee-portal/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, seed script, bootstrap script
│   │   ├── controllers/     # Route handler logic
│   │   ├── middlewares/     # JWT auth + RBAC permission checks
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express API routes
│   │   └── services/        # Zoho OAuth + API client
│   ├── .env.example
│   └── server.js
└── frontend/
    └── src/
        ├── app/              # Next.js App Router pages (login, dashboard, admin)
        ├── components/       # ProtectedRoute, Navbar
        ├── services/         # Axios API client
        └── utils/            # Auth/token helpers
```

## Known Limitations
- Zoho Desk integration is implemented at the code level (`/api/zoho/desk` route, service function) but could not be live-demoed due to a Desk provisioning issue on the Zoho trial account used for development.
- This is a demo/assignment build; production deployment would require HTTPS enforcement, refresh-token rotation, and rate limiting on the Zoho proxy endpoints.

## Security Notes
- Passwords are hashed with bcrypt before storage.
- JWTs expire after 1 hour.
- The Zoho service account's refresh token is never exposed to the frontend or to employees — all Zoho API calls are proxied through the authenticated backend.
- `.env` files are excluded from version control via `.gitignore`.

## Live Demo
- Frontend: https://custom-employee-portal-inky.vercel.app
- Backend health check: https://custom-employee-portal-jdl6.onrender.com/api/health