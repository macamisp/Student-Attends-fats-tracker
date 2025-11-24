import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    action: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    performedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'performed_by',
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
}, {
    tableName: 'audit_logs',
    timestamps: false,
    underscored: true,
});

export default AuditLog;
