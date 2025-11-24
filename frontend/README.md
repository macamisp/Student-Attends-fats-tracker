# QR Attendance System - Frontend

React frontend for the QR Attendance System.

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

The default configuration connects to the backend at `http://localhost:5000/api`.

## Running the Application

### Development mode:
```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Application Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── BatchManagement.jsx
│   │   ├── StudentManagement.jsx
│   │   ├── QRGenerator.jsx
│   │   └── AttendanceReports.jsx
│   ├── context/          # React context providers
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── AttendancePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── DashboardPage.jsx
│   ├── utils/            # Utilities
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.js
└── tailwind.config.js
```

## Features

### Public Pages

#### Attendance Submission (`/attend?token=xxx`)
- Mobile-friendly interface
- QR token validation
- Student ID input
- Real-time feedback

### Admin Pages

#### Login (`/admin/login`)
- Secure authentication
- JWT token management

#### Dashboard (`/admin/dashboard`)
- **Batches Tab**: Create, edit, delete batches
- **Students Tab**: Manage student records
- **QR Codes Tab**: Generate and manage QR codes
- **Reports Tab**: View and export attendance reports

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

⚠️ Change these in production!

## API Integration

The frontend communicates with the backend API through the `api.js` utility. All API calls are organized by domain:

- `authAPI` - Authentication
- `attendanceAPI` - Attendance marking
- `batchAPI` - Batch management
- `studentAPI` - Student management
- `qrAPI` - QR code generation
- `exportAPI` - Excel exports

## Styling

Built with Tailwind CSS for responsive, modern design. Custom utility classes are defined in `index.css`.

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: `http://localhost:5000/api`)

## Troubleshooting

### API Connection Error
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify `VITE_API_URL` in `.env`

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

MIT
