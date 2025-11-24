import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const QRToken = sequelize.define('QRToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'batch_id',
    },
    validFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'valid_from',
    },
    validTo: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'valid_to',
    },
    eventType: {
        type: DataTypes.ENUM('IN', 'OUT'),
        allowNull: false,
        field: 'event_type',
        comment: 'Type of attendance event this QR is for',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
    },
    createdBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'created_by',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
}, {
    tableName: 'qr_tokens',
    timestamps: false,
    underscored: true,
});

export default QRToken;
