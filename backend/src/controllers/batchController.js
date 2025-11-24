import { Batch, Student, AuditLog } from '../models/index.js';

export const getAllBatches = async (req, res, next) => {
    try {
        const batches = await Batch.findAll({
            include: [
                {
                    model: Student,
                    as: 'students',
                    attributes: ['id', 'studentId', 'name'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            success: true,
            batches,
        });
    } catch (error) {
        next(error);
    }
};

export const getBatchById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const batch = await Batch.findByPk(id, {
            include: [
                {
                    model: Student,
                    as: 'students',
                },
            ],
        });

        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        res.json({
            success: true,
            batch,
        });
    } catch (error) {
        next(error);
    }
};

export const createBatch = async (req, res, next) => {
    try {
        const { name, description, startDate, endDate } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Batch name is required' });
        }

        const batch = await Batch.create({
            name,
            description,
            startDate,
            endDate,
        });

        // Log the action
        await AuditLog.create({
            action: 'BATCH_CREATED',
            performedBy: req.user.username,
            ipAddress: req.ip,
            details: { batchId: batch.id, name },
        });

        res.status(201).json({
            success: true,
            batch,
        });
    } catch (error) {
        next(error);
    }
};

export const updateBatch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, startDate, endDate, isActive } = req.body;

        const batch = await Batch.findByPk(id);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        if (name !== undefined) batch.name = name;
        if (description !== undefined) batch.description = description;
        if (startDate !== undefined) batch.startDate = startDate;
        if (endDate !== undefined) batch.endDate = endDate;
        if (isActive !== undefined) batch.isActive = isActive;

        await batch.save();

        // Log the action
        await AuditLog.create({
            action: 'BATCH_UPDATED',
            performedBy: req.user.username,
            ipAddress: req.ip,
            details: { batchId: id, changes: req.body },
        });

        res.json({
            success: true,
            batch,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBatch = async (req, res, next) => {
    try {
        const { id } = req.params;

        const batch = await Batch.findByPk(id);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        await batch.destroy();

        // Log the action
        await AuditLog.create({
            action: 'BATCH_DELETED',
            performedBy: req.user.username,
            ipAddress: req.ip,
            details: { batchId: id, name: batch.name },
        });

        res.json({
            success: true,
            message: 'Batch deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
