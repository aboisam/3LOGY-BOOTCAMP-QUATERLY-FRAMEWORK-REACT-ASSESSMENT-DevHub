# DevShelf 🗂️ — React Assessment

> Build a developer productivity dashboard with React. Save code snippets, bookmark resources, track tasks — all powered by a real .NET API backend.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![Assessment](https://img.shields.io/badge/type-assessment-orange?style=flat-square)

---

## 📋 What Is This?

This is a **React frontend assessment**. The backend API is fully built and working. Your job is to build the entire React frontend from scratch.

| You Build | Already Done |
|-----------|-------------|
| All React components | .NET API server |
| All pages (Login, Register, Dashboard, Snippets, Resources, Tasks) | Database + migrations |
| API service layer (Axios) | Authentication (JWT) |
| Auth context + state management | All CRUD endpoints |
| React Router navigation | CORS configured |
| Forms with validation | |
| Loading/error states | |

---

## 📁 Project Structure

```
DevShelf/
├── server/                    # ✅ .NET API (provided, don't modify)
│   ├── Controllers/           #    Auth, Profile, Snippets, Resources, Tasks, Dashboard
│   ├── Models/                #    User, Snippet, Resource, DevTask
│   ├── DTOs/                  #    Request/response data shapes
│   ├── Services/              #    Auth + JWT services
│   ├── Data/                  #    EF Core database context
│   └── Program.cs             #    Server entry point
│
├── client/                    # 🔨 React app (YOU BUILD THIS)
│   ├── src/
│   │   ├── main.jsx           #    Entry point (provided)
│   │   ├── index.css          #    Starter styles (provided)
│   │   └── ...                #    Everything else — you create!
│   ├── package.json           #    Dependencies (provided)
│   └── .env.local             #    API URL config (provided)
│
├── ASSESSMENT.md              # 📖 Step-by-step build guide (START HERE)
├── API_REFERENCE.md           # 📡 Complete API documentation
├── RUBRIC.md                  # 📊 Grading criteria
└── README.md                  # This file
```

---

## 🚀 Quick Start

### 1. Start the API server

```bash
cd server
dotnet run
```
> Server runs on `https://localhost:7001`

### 2. Start the React dev server

```bash
cd client
npm install
npm run dev
```
> Client runs on `http://localhost:5173`

### 3. Read the assessment guide

📖 **Start here:** [ASSESSMENT.md](./ASSESSMENT.md)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [**ASSESSMENT.md**](./ASSESSMENT.md) | Step-by-step sprint guide — your main instructions |
| [**API_REFERENCE.md**](./API_REFERENCE.md) | Every API endpoint with request/response examples |
| [**RUBRIC.md**](./RUBRIC.md) | How your work will be graded (100 points total) |

---

## 🛠️ Tech Stack

### Frontend (What You Use)
- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **React Router v7** — Client-side routing
- **Axios** — HTTP client
- **React Hot Toast** — Toast notifications
- **Tailwind CSS v4** — Utility-first styling

### Backend (Provided)
- **ASP.NET Core (.NET 10)** — REST API
- **Entity Framework Core** — ORM
- **SQLite** — Database
- **BCrypt** — Password hashing
- **JWT** — Authentication tokens

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Login, get JWT | No |
| GET | `/api/profile` | Get user profile | Yes |
| GET/POST/PUT/DELETE | `/api/snippets` | Code snippets CRUD | Yes |
| GET/POST/PUT/DELETE | `/api/resources` | Bookmarks CRUD | Yes |
| GET/POST/PUT/PATCH/DELETE | `/api/tasks` | Tasks CRUD + status | Yes |
| GET | `/api/dashboard/stats` | Dashboard statistics | Yes |

> See [API_REFERENCE.md](./API_REFERENCE.md) for full details.

---

## 💡 Tips

1. **Follow the sprints in order** — Sprint 1 → 2 → 3 → 4
2. **Test the API first** — Use Postman or your browser to verify endpoints
3. **Commit after each sprint** — Protect your progress
4. **Read error messages** — They tell you exactly what's wrong
5. **60 points = pass** — Focus on Sprint 1 + 2 first

---

**Good luck! 🚀**
