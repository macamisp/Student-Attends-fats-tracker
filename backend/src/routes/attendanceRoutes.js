import express from 'express';
import { markAttendance, getStudentAttendance } from '../controllers/attendanceController.js';
import { attendanceLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', attendanceLimiter, markAttendance);
router.get('/student/:studentId', getStudentAttendance);

export default router;
