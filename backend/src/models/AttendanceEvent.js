import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AttendanceEvent = sequelize.define('AttendanceEvent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'student_id',
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'batch_id',
    },
    qrTokenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'qr_token_id',
    },
    eventType: {
        type: DataTypes.ENUM('IN', 'OUT'),
        allowNull: false,
        field: 'event_type',
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'attendance_events',
    timestamps: false,
    underscored: true,
    indexes: [
        {
            fields: ['student_id', 'timestamp'],
        },
        {
            fields: ['batch_id', 'timestamp'],
        },
    ],
});

export default AttendanceEvent;
