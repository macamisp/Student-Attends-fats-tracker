import ExcelJS from 'exceljs';
import { Op } from 'sequelize';
import { AttendanceEvent, Student, Batch, QRToken } from '../models/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportAttendance = async (req, res, next) => {
    try {
        const { batchId, startDate, endDate } = req.query;

        if (!batchId) {
            return res.status(400).json({ error: 'batchId is required' });
        }

        // Get batch info
        const batch = await Batch.findByPk(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        // Build query
        const where = { batchId };
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp[Op.gte] = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.timestamp[Op.lte] = end;
            }
        }

        // Fetch attendance events
        const events = await AttendanceEvent.findAll({
            where,
            include: [
                { model: Student, as: 'student' },
                { model: QRToken, as: 'qrToken' },
            ],
            order: [['timestamp', 'ASC']],
        });

        // Create workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        // Set up columns
        worksheet.columns = [
            { header: 'Student ID', key: 'studentId', width: 15 },
            { header: 'Student Name', key: 'studentName', width: 25 },
            { header: 'Event Type', key: 'eventType', width: 12 },
            { header: 'Timestamp', key: 'timestamp', width: 20 },
            { header: 'Date', key: 'date', width: 12 },
            { header: 'Time', key: 'time', width: 10 },
            { header: 'QR Token', key: 'qrToken', width: 15 },
            { header: 'IP Address', key: 'ipAddress', width: 15 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' },
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

        // Add data
        events.forEach((event) => {
            const timestamp = new Date(event.timestamp);
            worksheet.addRow({
                studentId: event.student.studentId,
                studentName: event.student.name,
                eventType: event.eventType,
                timestamp: timestamp.toISOString(),
                date: timestamp.toLocaleDateString(),
                time: timestamp.toLocaleTimeString(),
                qrToken: event.qrToken.token.substring(0, 8) + '...',
                ipAddress: event.ipAddress || 'N/A',
            });
        });

        // Add alternating row colors
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1 && rowNumber % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF2F2F2' },
                };
            }
        });

        // Create exports directory if it doesn't exist
        const exportsDir = path.join(__dirname, '../../exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }

        // Generate filename
        const dateStr = startDate && endDate
            ? `${startDate}_to_${endDate}`
            : new Date().toISOString().split('T')[0];
        const filename = `attendance_${batch.name.replace(/\s+/g, '_')}_${dateStr}.xlsx`;
        const filepath = path.join(exportsDir, filename);

        // Write file
        await workbook.xlsx.writeFile(filepath);

        // Send file
        res.download(filepath, filename, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
            // Optionally delete file after sending
            // fs.unlinkSync(filepath);
        });
    } catch (error) {
        next(error);
    }
};

export const getBatchAttendanceReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;

        const batch = await Batch.findByPk(id);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        const where = { batchId: id };
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp[Op.gte] = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.timestamp[Op.lte] = end;
            }
        }

        const events = await AttendanceEvent.findAll({
            where,
            include: [
                { model: Student, as: 'student' },
                { model: QRToken, as: 'qrToken' },
            ],
            order: [['timestamp', 'DESC']],
        });

        res.json({
            success: true,
            batch: {
                id: batch.id,
                name: batch.name,
            },
            totalEvents: events.length,
            events,
        });
    } catch (error) {
        next(error);
    }
};
