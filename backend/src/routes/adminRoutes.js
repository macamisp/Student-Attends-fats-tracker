import express from 'express';
import {
    getAllBatches,
    getBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
} from '../controllers/batchController.js';
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} from '../controllers/studentController.js';
import {
    generateQR,
    getActiveTokens,
    deactivateToken,
} from '../controllers/qrController.js';
import {
    exportAttendance,
    getBatchAttendanceReport,
} from '../controllers/exportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// Batch routes
router.get('/batches', getAllBatches);
router.get('/batches/:id', getBatchById);
router.post('/batches', createBatch);
router.put('/batches/:id', updateBatch);
router.delete('/batches/:id', deleteBatch);

// Student routes
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// QR routes
router.post('/qr/generate', generateQR);
router.get('/qr/active', getActiveTokens);
router.put('/qr/:id/deactivate', deactivateToken);

// Report routes
router.get('/batches/:id/attendance', getBatchAttendanceReport);
router.get('/export/attendance', exportAttendance);

export default router;
