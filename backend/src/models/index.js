import Student from './Student.js';
import Batch from './Batch.js';
import QRToken from './QRToken.js';
import AttendanceEvent from './AttendanceEvent.js';
import AuditLog from './AuditLog.js';

// Define associations
Student.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
Batch.hasMany(Student, { foreignKey: 'batchId', as: 'students' });

QRToken.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
Batch.hasMany(QRToken, { foreignKey: 'batchId', as: 'qrTokens' });

AttendanceEvent.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
AttendanceEvent.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
AttendanceEvent.belongsTo(QRToken, { foreignKey: 'qrTokenId', as: 'qrToken' });

Student.hasMany(AttendanceEvent, { foreignKey: 'studentId', as: 'attendanceEvents' });
Batch.hasMany(AttendanceEvent, { foreignKey: 'batchId', as: 'attendanceEvents' });
QRToken.hasMany(AttendanceEvent, { foreignKey: 'qrTokenId', as: 'attendanceEvents' });

export {
    Student,
    Batch,
    QRToken,
    AttendanceEvent,
    AuditLog,
};
