# Job Tracker — Frontend

A clean, responsive React application for tracking job applications through every stage of the hiring process.

**Live demo → [job-tracker-beryl-nu.vercel.app](https://job-tracker-beryl-nu.vercel.app)**

![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)

---

## Features

- **Dashboard** — stats cards, doughnut chart by status, bar chart of applications over time, upcoming deadlines
- **Application tracking** — add, edit, delete, and filter by status or search by company/role
- **Status progress tracker** — visual pipeline from Applied → Screening → Interview → Offer
- **Notes** — per-application notes with timestamps
- **Deadline highlighting** — red for overdue, amber for ≤ 3 days, green otherwise
- **CSV export** — download all applications as a spreadsheet
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
| Auth | JWT |

---

## Related

- **Backend repo** → [github.com/chiduso-sh/job-tracker-backend](https://github.com/chiduso-sh/job-tracker-backend)
- **Live API** → [job-tracker-production-7b5c.up.railway.app](https://job-tracker-production-7b5c.up.railway.app)
