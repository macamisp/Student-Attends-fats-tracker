import sequelize from '../config/database.js';
import { Batch, Student } from '../models/index.js';

const seedDatabase = async () => {
    try {
        console.log('Starting database seed...');

        // Create sample batches
        const batch1 = await Batch.create({
            name: 'Computer Science 2024',
            description: 'Computer Science batch for academic year 2024',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            isActive: true,
        });

        const batch2 = await Batch.create({
            name: 'Information Technology 2024',
            description: 'IT batch for academic year 2024',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            isActive: true,
        });

        console.log('✓ Created sample batches');

        // Create sample students
        const students = [
            { studentId: 'CS001', name: 'John Doe', email: 'john@example.com', batchId: batch1.id },
            { studentId: 'CS002', name: 'Jane Smith', email: 'jane@example.com', batchId: batch1.id },
            { studentId: 'CS003', name: 'Bob Johnson', email: 'bob@example.com', batchId: batch1.id },
            { studentId: 'CS004', name: 'Alice Williams', email: 'alice@example.com', batchId: batch1.id },
            { studentId: 'CS005', name: 'Charlie Brown', email: 'charlie@example.com', batchId: batch1.id },
            { studentId: 'IT001', name: 'David Lee', email: 'david@example.com', batchId: batch2.id },
            { studentId: 'IT002', name: 'Emma Davis', email: 'emma@example.com', batchId: batch2.id },
            { studentId: 'IT003', name: 'Frank Miller', email: 'frank@example.com', batchId: batch2.id },
            { studentId: 'IT004', name: 'Grace Wilson', email: 'grace@example.com', batchId: batch2.id },
            { studentId: 'IT005', name: 'Henry Moore', email: 'henry@example.com', batchId: batch2.id },
        ];

        await Student.bulkCreate(students);
        console.log('✓ Created sample students');

        console.log('\n=== Seed Summary ===');
        console.log(`Batches created: 2`);
        console.log(`Students created: ${students.length}`);
        console.log('\nSample credentials:');
        console.log('Admin username: admin');
        console.log('Admin password: admin123');
        console.log('\nSample student IDs: CS001, CS002, IT001, IT002');
        console.log('\n✓ Database seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error seeding database:', error);
        process.exit(1);
    }
};

// Initialize database and seed
const init = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected');

        await sequelize.sync({ force: true }); // WARNING: This drops all tables
        console.log('✓ Database synchronized');

        await seedDatabase();
    } catch (error) {
        console.error('✗ Initialization error:', error);
        process.exit(1);
    }
};

init();
