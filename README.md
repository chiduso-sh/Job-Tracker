# Job Tracker — Frontend

A clean, responsive React application for tracking job applications through every stage of the hiring process.

**Live demo → [job-tracker-beryl-nu.vercel.app](https://job-tracker-beryl-nu.vercel.app)**

![Job Tracker Dashboard](https://img.shields.io/badge/status-live-brightgreen) ![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)

---

## Features

- **Dashboard** — stats cards, doughnut chart by status, bar chart of applications over time, upcoming deadlines
- **Application tracking** — add, edit, delete, and filter applications by status or search by company/role
- **Status progress tracker** — visual pipeline from Applied → Screening → Interview → Offer
- **Notes** — per-application notes with timestamps
- **Deadline highlighting** — red for overdue, amber for ≤ 3 days, green otherwise
- **CSV export** — download all your applications as a spreadsheet
- **Reminders** — upcoming deadlines with urgency indicators
- **Responsive** — mobile-friendly with hamburger nav and card layout on small screens
- **JWT auth** — register, login, protected routes

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Data fetching | TanStack React Query |
| HTTP client | Axios |
| Charts | Chart.js + react-chartjs-2 |
| Auth | JWT (stored in localStorage) |

---

## Project structure

```
src/
  App.jsx                        # Router + auth provider
  main.jsx                       # React Query + entry point
  context/
    AuthContext.jsx              # User state, login, logout
  lib/
    api.js                       # Axios instance with JWT
    statusConfig.js              # Status labels and colors
  hooks/
    useApplications.js           # All React Query hooks
  components/
    PrivateRoute.jsx             # Auth guard
    layout/
      AppLayout.jsx              # Page wrapper
      Navbar.jsx                 # Responsive navigation
    ui/
      StatusBadge.jsx            # Colored status pill
      StatusDoughnut.jsx         # Doughnut chart
      ApplicationTimeline.jsx    # Bar chart
      Modal.jsx                  # Reusable modal
      ApplicationForm.jsx        # Create/edit form
      ExportButton.jsx           # CSV export
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Applications.jsx
    ApplicationDetail.jsx
    Reminders.jsx
    NotFound.jsx
```

---

## Getting started

### Prerequisites
- Node.js 18+
- The backend running locally or deployed (see [job-tracker-backend](https://github.com/chiduso-sh/job-tracker-backend))

### Install and run

```bash
# Clone the repo
git clone https://github.com/chiduso-sh/job-tracker-frontend.git
cd job-tracker-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Set VITE_API_URL to your backend URL

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment variables

```env
VITE_API_URL=https://your-backend-url.up.railway.app
```

In development, leave this empty — the Vite proxy forwards `/api` to `localhost:5000` automatically.

---

## Related

- **Backend repo** → [github.com/chiduso-sh/job-tracker-backend](https://github.com/chiduso-sh/job-tracker-backend)
- **Live API** → [job-tracker-production-7b5c.up.railway.app](https://job-tracker-production-7b5c.up.railway.app)
