# QR Attendance System - Backend

Node.js Express API for the QR Attendance System.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qr_attendance
DB_USER=postgres
DB_PASSWORD=your_password
```

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE qr_attendance;
```

2. Run the seed script to create tables and sample data:
```bash
npm run seed
```

This will create:
- 2 sample batches (Computer Science 2024, IT 2024)
- 10 sample students (CS001-CS005, IT001-IT005)

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### Mark Attendance
```http
POST /api/attendance
Content-Type: application/json

{
  "token": "qr-token-here",
  "studentId": "CS001"
}
```

### Authentication

#### Admin Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Returns a JWT token to use in subsequent requests.

### Admin Endpoints (Require Authentication)

Add the JWT token to requests:
```http
Authorization: Bearer <your-jwt-token>
```

#### Batch Management
- `GET /api/admin/batches` - Get all batches
- `GET /api/admin/batches/:id` - Get batch by ID
- `POST /api/admin/batches` - Create new batch
- `PUT /api/admin/batches/:id` - Update batch
- `DELETE /api/admin/batches/:id` - Delete batch

#### Student Management
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:id` - Get student by ID
- `POST /api/admin/students` - Create new student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student

#### QR Code Management
- `POST /api/admin/qr/generate` - Generate QR code
- `GET /api/admin/qr/active` - Get active QR tokens
- `PUT /api/admin/qr/:id/deactivate` - Deactivate QR token

#### Reports & Export
- `GET /api/admin/batches/:id/attendance` - Get batch attendance report
- `GET /api/admin/export/attendance?batchId=1&startDate=2024-01-01&endDate=2024-12-31` - Export to Excel

## Sample QR Generation Request

```http
POST /api/admin/qr/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "batchId": 1,
  "eventType": "IN",
  "validFrom": "2024-11-24T06:00:00Z",
  "validTo": "2024-11-24T10:00:00Z"
}
```

## Default Credentials

- **Admin Username**: admin
- **Admin Password**: admin123

⚠️ **Change these in production!**

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── database/        # Database scripts
│   └── server.js        # Main server file
├── exports/             # Generated Excel files
├── .env.example         # Environment template
└── package.json
```

## Environment Variables

See `.env.example` for all available configuration options.

## Security Features

- JWT authentication for admin routes
- Rate limiting on all endpoints
- Helmet.js for security headers
- CORS protection
- Input validation
- Audit logging

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 5000

## License

MIT
