# QR Attendance System

> **A premium, production‑ready QR‑based attendance tracking solution**
>
> **Live‑recording • Per‑batch isolation • Secure token validation • Excel reporting**
>
> Built with **Node.js (Express) + PostgreSQL** on the backend and **React + Vite + Tailwind CSS** on the frontend, this project delivers a sleek, mobile‑first experience for students and a powerful admin dashboard for staff.

---

## ✨ Features

- **QR Code Generation** – Time‑limited, batch‑specific QR codes (IN/OUT) with cryptographically secure UUID tokens.
- **Student Attendance** – Simple mobile UI; students scan a QR, enter their ID, and mark IN/OUT instantly.
- **Admin Dashboard** – Full CRUD for batches & students, QR management, real‑time attendance view, and Excel export.
- **Security** – JWT admin authentication, rate limiting, Helmet headers, CORS protection, audit logging, and duplicate‑scan prevention.
- **Reporting** – Per‑batch Excel reports with styled headers, alternating rows, and downloadable files.
- **Scalable Architecture** – PostgreSQL + Sequelize, Docker‑ready, and easy to extend with background workers or cloud storage.

---

## 📁 Project Structure

```
Qr-attendn-System/
├── backend/                     # Express API
│   ├── src/
│   │   ├── config/            # DB & app config
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, rate limiting, errors
│   │   ├── models/            # Sequelize models
│   │   ├── routes/            # API routes
│   │   ├── database/          # Seed script
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/        # Dashboard widgets
│   │   ├── context/            # Auth context
│   │   ├── pages/             # Attendance, login, dashboard
│   │   ├── utils/             # Axios API wrapper
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── SETUP.md                    # Full setup & run guide
├── README.md                    # **This file** – project overview
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- **npm** (or **yarn**)

### 1️⃣ Clone & Initialise
```bash
# Clone the repo (if you haven't already)
git clone https://github.com/macamisp/Student-Attends-fats-tracker.git
cd Student-Attends-fats-tracker
```

### 2️⃣ Database
```sql
-- In psql or any PostgreSQL client
CREATE DATABASE qr_attendance;
```

### 3️⃣ Backend
```bash
cd backend
cp .env.example .env   # edit with your DB credentials if needed
npm install
npm run seed           # creates tables & sample data
npm run dev            # starts API on http://localhost:5000
```

### 4️⃣ Frontend
```bash
cd ../frontend
cp .env.example .env   # defaults to http://localhost:5000/api
npm install
npm run dev            # starts Vite dev server on http://localhost:5173
```

### 5️⃣ Access the App
- **Student page:** `http://localhost:5173/attend?token=YOUR_QR_TOKEN`
- **Admin login:** `http://localhost:5173/admin/login` (default: `admin / admin123`)

---

## 🛠️ Production Ready

1. **Set environment variables** (`.env`) with strong secrets.
2. **Build the frontend**
   ```bash
   cd frontend
   npm run build   # outputs to ./dist
   ```
3. **Run the backend** with `npm start` (or via Docker/PM2).
4. **Serve the static files** (`dist`) with Nginx, Apache, or a CDN.
5. **Enable HTTPS** and configure CORS for your domain.

---

## 📦 Scripts Overview

| Script | Description |
|--------|-------------|
| `npm run dev` (backend) | Starts Express with nodemon (auto‑reload) |
| `npm start` (backend) | Production start (`node src/server.js`) |
| `npm run seed` | Sync DB schema & seed sample data |
| `npm run dev` (frontend) | Vite dev server (hot‑module reload) |
| `npm run build` (frontend) | Production build (`dist` folder) |
| `npm run preview` (frontend) | Preview the production build locally |

---

## 🧪 Testing & Verification

- **Unit tests** – add with Jest/Mocha (not included yet).
- **Integration** – use Postman or curl to hit `/api/attendance`.
- **Load test** – tools like k6 or Artillery to simulate peak scans.
- **Security audit** – run `npm audit` and address any findings.

---

## 📚 Documentation

- **Backend API** – see `backend/README.md` for endpoint details.
- **Frontend** – see `frontend/README.md` for component guide.
- **Setup** – see `SETUP.md` for step‑by‑step installation.

---

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/awesome‑feature`).
3. Commit your changes with clear messages.
4. Open a Pull Request.

All contributions must follow the existing code style (ESLint for JS, Prettier for formatting) and include tests where applicable.

---

## 📜 License

MIT – feel free to use, modify, and distribute.

---

## 🎉 Thank You!

Enjoy the QR Attendance System! If you need help customizing or deploying to the cloud, just let me know.
