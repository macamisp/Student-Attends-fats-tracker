import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import config from '../config/config.js';
import { AuditLog } from '../models/index.js';

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Simple admin check (in production, use database with hashed passwords)
        if (username === config.admin.username && password === config.admin.password) {
            const token = generateToken({ username, role: 'admin' });

            // Log the login
            await AuditLog.create({
                action: 'ADMIN_LOGIN',
                performedBy: username,
                ipAddress: req.ip,
                details: { success: true },
            });

            return res.json({
                success: true,
                token,
                user: { username, role: 'admin' },
            });
        }

        // Log failed attempt
        await AuditLog.create({
            action: 'ADMIN_LOGIN_FAILED',
            performedBy: username,
            ipAddress: req.ip,
            details: { reason: 'Invalid credentials' },
        });

        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        next(error);
    }
};

export const verifyToken = async (req, res) => {
    // If we reach here, token is valid (checked by middleware)
    res.json({
        success: true,
        user: req.user,
    });
};
