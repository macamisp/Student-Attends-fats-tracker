import { Op } from 'sequelize';
import { AttendanceEvent, Student, QRToken, Batch } from '../models/index.js';

export const markAttendance = async (req, res, next) => {
    try {
        const { token, studentId } = req.body;

        if (!token || !studentId) {
            return res.status(400).json({
                error: 'Token and student ID are required',
            });
        }

        // Validate QR token
        const qrToken = await QRToken.findOne({
            where: { token, isActive: true },
            include: [{ model: Batch, as: 'batch' }],
        });

        if (!qrToken) {
            return res.status(404).json({
                error: 'Invalid or inactive QR code',
            });
        }

        // Check if token is within valid time window
        const now = new Date();
        if (now < qrToken.validFrom || now > qrToken.validTo) {
            return res.status(400).json({
                error: 'QR code has expired or is not yet valid',
                validFrom: qrToken.validFrom,
                validTo: qrToken.validTo,
            });
        }

        // Find student
        const student = await Student.findOne({
            where: { studentId },
        });

        if (!student) {
            return res.status(404).json({
                error: 'Student not found. Please register first.',
            });
        }

        // Check if student belongs to the batch
        if (student.batchId !== qrToken.batchId) {
            return res.status(403).json({
                error: 'You are not enrolled in this batch',
            });
        }

        // Check for duplicate attendance within last 5 minutes (prevent accidental double scans)
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const recentAttendance = await AttendanceEvent.findOne({
            where: {
                studentId: student.id,
                eventType: qrToken.eventType,
                timestamp: { [Op.gte]: fiveMinutesAgo },
            },
        });

        if (recentAttendance) {
            return res.status(409).json({
                error: 'Attendance already marked recently',
                existingEvent: {
                    type: recentAttendance.eventType,
                    timestamp: recentAttendance.timestamp,
                },
            });
        }

        // Create attendance event
        const attendanceEvent = await AttendanceEvent.create({
            studentId: student.id,
            batchId: qrToken.batchId,
            qrTokenId: qrToken.id,
            eventType: qrToken.eventType,
            timestamp: now,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        res.json({
            success: true,
            message: `Attendance marked successfully`,
            event: {
                id: attendanceEvent.id,
                studentName: student.name,
                studentId: student.studentId,
                batchName: qrToken.batch.name,
                type: attendanceEvent.eventType,
                timestamp: attendanceEvent.timestamp,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getStudentAttendance = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;

        const student = await Student.findOne({
            where: { studentId },
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const where = { studentId: student.id };

        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp[Op.gte] = new Date(startDate);
            if (endDate) where.timestamp[Op.lte] = new Date(endDate);
        }

        const events = await AttendanceEvent.findAll({
            where,
            include: [
                { model: Batch, as: 'batch' },
                { model: QRToken, as: 'qrToken' },
            ],
            order: [['timestamp', 'DESC']],
        });

        res.json({
            success: true,
            student: {
                id: student.studentId,
                name: student.name,
            },
            events,
        });
    } catch (error) {
        next(error);
    }
};
