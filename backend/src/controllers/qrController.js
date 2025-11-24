import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { QRToken, Batch, AuditLog } from '../models/index.js';
import { Op } from 'sequelize';

export const generateQR = async (req, res, next) => {
    try {
        const { batchId, eventType, validFrom, validTo } = req.body;

        // Validate required fields
        if (!batchId || !eventType || !validFrom || !validTo) {
            return res.status(400).json({
                error: 'batchId, eventType, validFrom, and validTo are required',
            });
        }

        // Validate event type
        if (!['IN', 'OUT'].includes(eventType)) {
            return res.status(400).json({
                error: 'eventType must be either IN or OUT',
            });
        }

        // Check if batch exists
        const batch = await Batch.findByPk(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        // Generate unique token
        const token = uuidv4();

        // Create QR token record
        const qrToken = await QRToken.create({
            token,
            batchId,
            eventType,
            validFrom: new Date(validFrom),
            validTo: new Date(validTo),
            createdBy: req.user.username,
        });

        // Generate QR code URL
        const attendanceUrl = `${req.protocol}://${req.get('host')}/attend?token=${token}`;

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(attendanceUrl, {
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });

        // Log the action
        await AuditLog.create({
            action: 'QR_GENERATED',
            performedBy: req.user.username,
            ipAddress: req.ip,
            details: {
                qrTokenId: qrToken.id,
                batchId,
                eventType,
                validFrom,
                validTo,
            },
        });

        res.json({
            success: true,
            qrToken: {
                id: qrToken.id,
                token: qrToken.token,
                batchId: qrToken.batchId,
                batchName: batch.name,
                eventType: qrToken.eventType,
                validFrom: qrToken.validFrom,
                validTo: qrToken.validTo,
            },
            qrCodeDataUrl,
            attendanceUrl,
        });
    } catch (error) {
        next(error);
    }
};

export const getActiveTokens = async (req, res, next) => {
    try {
        const { batchId } = req.query;
        const now = new Date();

        const where = {
            isActive: true,
            validFrom: { [Op.lte]: now },
            validTo: { [Op.gte]: now },
        };

        if (batchId) {
            where.batchId = batchId;
        }

        const tokens = await QRToken.findAll({
            where,
            include: [{ model: Batch, as: 'batch' }],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            success: true,
            tokens,
        });
    } catch (error) {
        next(error);
    }
};

export const deactivateToken = async (req, res, next) => {
    try {
        const { id } = req.params;

        const qrToken = await QRToken.findByPk(id);
        if (!qrToken) {
            return res.status(404).json({ error: 'QR token not found' });
        }

        qrToken.isActive = false;
        await qrToken.save();

        // Log the action
        await AuditLog.create({
            action: 'QR_DEACTIVATED',
            performedBy: req.user.username,
            ipAddress: req.ip,
            details: { qrTokenId: id },
        });

        res.json({
            success: true,
            message: 'QR token deactivated',
        });
    } catch (error) {
        next(error);
    }
};
