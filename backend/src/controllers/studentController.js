import { Student, Batch, AuditLog } from '../models/index.js';

export const getAllStudents = async (req, res, next) => {
    try {
        const { batchId } = req.query;

        const where = {};
        if (batchId) {
            where.batchId = batchId;
        }

        const students = await Student.findAll({
            where,
            include: [{ model: Batch, as: 'batch' }],
            order: [['name', 'ASC']],
        });

        res.json({
            success: true,
            students,
        });
    } catch (error) {
        next(error);
    }
};

export const getStudentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const student = await Student.findOne({
            where: { studentId: id },
            include: [{ model: Batch, as: 'batch' }],
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            success: true,
            student,
        });
    } catch (error) {
        next(error);
    }
};

export const createStudent = async (req, res, next) => {
    try {
        const { studentId, name, email, batchId, metadata } = req.body;

        if (!studentId || !name || !batchId) {
            return res.status(400).json({
                error: 'studentId, name, and batchId are required',
            });
        }

        // Check if batch exists
        const batch = await Batch.findByPk(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        const student = await Student.create({
            studentId,
            name,
            email,
            batchId,
            metadata,
        });

        // Log the action
        await AuditLog.create({
            action: 'STUDENT_CREATED',
            performedBy: req.user.username,
            ipAddress: req.ip,
            details: { studentId: student.id, studentIdValue: studentId, name },
        });

        res.status(201).json({
            success: true,
            student,
        });
    } catch (error) {
        next(error);
    }
};

export const updateStudent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, batchId, metadata } = req.body;

        const student = await Student.findOne({ where: { studentId: id } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        if (name !== undefined) student.name = name;
        if (email !== undefined) student.email = email;
        if (batchId !== undefined) {
            const batch = await Batch.findByPk(batchId);
            if (!batch) {
                return res.status(404).json({ error: 'Batch not found' });
            }
            student.batchId = batchId;
        }
        if (metadata !== undefined) student.metadata = metadata;

        await student.save();

        // Log the action
        await AuditLog.create({
            action: 'STUDENT_UPDATED',
            performedBy: req.user.username,
            ipAddress: req.ip,
            details: { studentId: student.id, changes: req.body },
        });

        res.json({
            success: true,
            student,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStudent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const student = await Student.findOne({ where: { studentId: id } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        await student.destroy();

        // Log the action
        await AuditLog.create({
            action: 'STUDENT_DELETED',
            performedBy: req.user.username,
            ipAddress: req.ip,
            details: { studentId: student.id, studentIdValue: id, name: student.name },
        });

        res.json({
            success: true,
            message: 'Student deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
