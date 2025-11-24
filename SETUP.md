# QR Attendance System - Complete Setup Guide

This guide will help you set up and run the complete QR Attendance System.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn
- Git (optional)

## Quick Start

### 1. Database Setup

First, create a PostgreSQL database:

```sql
CREATE DATABASE qr_attendance;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# Update these values:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=qr_attendance
# DB_USER=postgres
# DB_PASSWORD=your_password

# Run database migrations and seed data
npm run seed

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults work)
cp .env.example .env

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

### Admin Access

1. Open `http://localhost:5173/admin/login`
2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

### Admin Dashboard Features

#### 1. Batch Management
- Create new batches (e.g., "Computer Science 2024")
- Edit batch details
- View students in each batch
- Delete batches

#### 2. Student Management
- Add students with ID, name, email, and batch
- Edit student information
- Filter students by batch
- Delete students

#### 3. QR Code Generation
- Select a batch
- Choose event type (IN or OUT)
- Set validity period (from/to datetime)
- Generate QR code
- Download QR code as PNG
- View active QR codes
- Deactivate QR codes

#### 4. Attendance Reports
- Select batch and date range
- View attendance statistics
- See detailed attendance table
- Export to Excel

### Student Attendance Flow

1. Admin generates a QR code for a specific batch and time
2. Admin displays/shares the QR code
3. Students scan the QR code with their phone
4. Students are redirected to attendance page
5. Students enter their Student ID
6. Students submit attendance
7. System validates and records attendance

### Sample Data

After running `npm run seed`, you'll have:

**Batches:**
- Computer Science 2024
- Information Technology 2024

**Students:**
- CS001 - John Doe
- CS002 - Jane Smith
- CS003 - Bob Johnson
- CS004 - Alice Williams
- CS005 - Charlie Brown
- IT001 - David Lee
- IT002 - Emma Davis
- IT003 - Frank Miller
- IT004 - Grace Wilson
- IT005 - Henry Moore

## Testing the Complete Flow

### 1. Generate a QR Code

1. Login to admin dashboard
2. Go to "QR Codes" tab
3. Fill in the form:
   - Batch: Computer Science 2024
   - Event Type: IN
   - Valid From: Current date/time
   - Valid To: 1 hour from now
4. Click "Generate QR Code"
5. Download or copy the URL

### 2. Mark Attendance

1. Open the attendance URL (or scan QR code)
2. Enter a student ID (e.g., `CS001`)
3. Click "Submit Attendance"
4. See success message

### 3. View Reports

1. Go to "Reports" tab in admin dashboard
2. Select "Computer Science 2024" batch
3. Set date range
4. Click "View Report"
5. See attendance records
6. Click export button to download Excel

## API Endpoints

### Public
- `POST /api/attendance` - Mark attendance

### Admin (requires JWT token)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/batches` - Get all batches
- `POST /api/admin/batches` - Create batch
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Create student
- `POST /api/admin/qr/generate` - Generate QR code
- `GET /api/admin/batches/:id/attendance` - Get attendance
- `GET /api/admin/export/attendance` - Export to Excel

See backend README for complete API documentation.

## Architecture

```
┌─────────────────┐
│   PostgreSQL    │
│    Database     │
└────────┬────────┘
         │
         │
┌────────▼────────┐      ┌──────────────┐
│  Backend API    │◄─────┤  Admin Web   │
│  (Express.js)   │      │  Dashboard   │
│  Port 5000      │      │  (React)     │
└────────┬────────┘      └──────────────┘
         │
         │
         │
┌────────▼────────┐
│  Student Page   │
│  (QR Scan)      │
│  (React)        │
└─────────────────┘
```

## Security Features

- JWT authentication for admin
- Rate limiting on all endpoints
- QR token expiration
- Duplicate attendance prevention
- IP address logging
- Audit trail
- CORS protection
- Helmet.js security headers

## Production Deployment

### Environment Variables

Update these for production:

**Backend (.env):**
```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
ADMIN_PASSWORD=<strong-password>
DB_HOST=<production-db-host>
DB_PASSWORD=<production-db-password>
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Build Commands

```bash
# Backend - runs as-is with Node.js
cd backend
npm start

# Frontend - build static files
cd frontend
npm run build
# Deploy the 'dist' folder to your web server
```

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database `qr_attendance` exists
- Check port 5000 is not in use

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify `VITE_API_URL` in frontend `.env`

### QR code doesn't work
- Check QR token is not expired
- Verify token is active
- Ensure student exists in database
- Check student belongs to correct batch

## Support

For issues or questions, refer to:
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Architecture document in project root

## License

MIT
