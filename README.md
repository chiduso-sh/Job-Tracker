# Job Tracker — Frontend (Week 2)

React + Vite + Tailwind CSS + React Query frontend.

## Project structure

```
src/
  App.jsx                        ← Router + auth provider
  main.jsx                       ← React Query + entry point
  index.css                      ← Tailwind + component classes
  context/
    AuthContext.jsx              ← User state, login, logout
  lib/
    api.js                       ← Axios instance with JWT
    statusConfig.js              ← Status labels and colors
  hooks/
    useApplications.js           ← All React Query hooks
  components/
    PrivateRoute.jsx             ← Auth guard
    layout/
      AppLayout.jsx              ← Page wrapper
      Navbar.jsx                 ← Navigation bar
    ui/
      StatusBadge.jsx            ← Colored status pill
      Modal.jsx                  ← Reusable modal
      ApplicationForm.jsx        ← Create/edit form
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Applications.jsx
    ApplicationDetail.jsx
    Reminders.jsx
    NotFound.jsx
```

## Setup

### 1. Make sure the backend is running
```powershell
# In the backend folder
npm run dev
```
Backend must be at `http://localhost:5000`.

### 2. Install dependencies
```powershell
npm install
```

### 3. Start the dev server
```powershell
npm run dev
```

Frontend runs at `http://localhost:5173`

The Vite proxy forwards all `/api` requests to `http://localhost:5000`,
so no CORS issues in development.

## Pages

| Route | Page | Auth |
|-------|------|------|
| /login | Login | No |
| /register | Register | No |
| / | Dashboard | Yes |
| /applications | Applications list | Yes |
| /applications/:id | Application detail + notes | Yes |
| /reminders | Upcoming deadlines | Yes |
