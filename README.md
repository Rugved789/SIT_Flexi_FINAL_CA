# SIT_FINAL_SUBMISSION — Donation & Campaign Platform

A full-stack donation/campaign management application with a React frontend and a Node/Express + MongoDB backend. This README provides a project overview, developer setup and how to run the app locally.

## Table of Contents

- [Project Overview](#project-overview)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Backend — Setup & Run](#backend---setup--run)
- [Frontend — Setup & Run](#frontend---setup--run)
- [API Endpoints (high level)](#api-endpoints-high-level)
- [Testing / Development Notes](#testing--development-notes)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project implements a platform where NGOs can create and manage campaigns and donors can make donations. It contains:

- `backend/` — Node.js (ES modules) Express API using Mongoose for MongoDB.
- `frontend/` — React app (Create React App) that consumes the API.

## Repository Structure (important folders)

- `backend/` — Express API
  - `api/index.js` — application entry
  - `controllers/`, `routes/`, `models/`, `middleware/`
- `frontend/` — React client
  - `src/` — React source components, pages, utils
  - `public/`, `build/` — compiled assets

## Prerequisites

- Node.js (recommended LTS, e.g. Node 18+ or newer)
- npm (comes with Node) or yarn
- MongoDB (local or MongoDB Atlas)
- (Optional) A tool such as Postman for exercising API endpoints

## Environment Variables

Create a file at `backend/.env` with these values (example):

```
MONGO_URI=mongodb://localhost:27017/flexi_db
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWT tokens (keep private)
- `PORT` — optional; default 5000 if omitted

## Backend — Setup & Run

Open a PowerShell terminal and run:

```powershell
cd backend
npm install
# create .env (see above) then run server in development
npm run server
# or run production start
npm start
```

Notes:
- Backend npm scripts (from `backend/package.json`):
  - `start` — `node api/index.js`
  - `server` — `nodemon api/index.js` (dev with auto-reload)
- The backend expects ES modules (package.json `type: "module"`).

## Frontend — Setup & Run

Open another PowerShell terminal and run:

```powershell
cd frontend
npm install
npm start    # runs the React dev server
# build for production
npm run build
```

Frontend npm scripts (from `frontend/package.json`):
- `start` — `react-scripts start`
- `build` — `react-scripts build`
- `test` — `react-scripts test`

By default the React app will try to connect to the API endpoints under `/api` paths. If you need to change the API base URL, update the API utility in `frontend/src/utils/api.js`.

## Run both locally

Open two terminals (or use your preferred terminal multiplexer):

Terminal A (backend):

```powershell
cd backend
npm run server
```

Terminal B (frontend):

```powershell
cd frontend
npm start
```

Then open the React app in your browser (usually http://localhost:3000) and use the UI.

## API Endpoints (high level)

The backend mounts routes under `/api`.

Auth (`/api/auth`):
- `POST /api/auth/register` — register new user (NGO or donor)
- `POST /api/auth/login` — login to obtain JWT
- `GET /api/auth/profile` — protected, get profile
- `PUT /api/auth/profile` — protected, update profile

Campaigns (`/api/campaigns`):
- `POST /api/campaigns/create` — create campaign (protected, NGO only)
- `GET /api/campaigns/` — list campaigns (public)
- `GET /api/campaigns/my-campaigns` — NGOs get their campaigns (protected)
- `GET /api/campaigns/:id` — get single campaign by id
- `PUT /api/campaigns/:id` — update campaign (protected, NGO only)
- `DELETE /api/campaigns/:id` — delete campaign (protected, NGO only)
- `GET /api/campaigns/stats/overview` — NGO dashboard stats (protected)

Donations (`/api/donations`):
- `POST /api/donations/create` — create donation (protected, donor only)
- `GET /api/donations/my-donations` — donor's donations (protected)
- `GET /api/donations/campaign/:campaignId` — NGO view campaign donations (protected)
- `PATCH /api/donations/:donationId/status` — NGO update donation status (protected)

Authentication middleware protects routes and signs tokens with `JWT_SECRET`.

## Testing / Development Notes

- Use `npm run server` in the backend for auto-restart with `nodemon`.
- Use the React dev server (`npm start`) for hot reload.
- When adding breakpoints or debugging in Node, ensure the `type: "module"` usage is accounted for.

## Contributing

If you plan to contribute:

- Follow existing code style in the repo.
- Add tests where appropriate.
- Run the app locally and ensure backend + frontend work together.

## License

This repository does not contain a license file by default. Add `LICENSE` if you intend to publish.

---

If you want, I can also:
- Add a `backend/.env.example` file.
- Add a small `Makefile` or `dev` script to start both services concurrently.
- Add Postman collection or example curl commands for common flows (register/login/create campaign).

Tell me which extras you'd like and I will add them next.