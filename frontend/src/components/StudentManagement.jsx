import { useState, useEffect } from 'react';
import { studentAPI, batchAPI } from '../utils/api';

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [filterBatch, setFilterBatch] = useState('');
    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        email: '',
        batchId: '',
    });

    useEffect(() => {
        fetchData();
    }, [filterBatch]);

    const fetchData = async () => {
        try {
            const [studentsRes, batchesRes] = await Promise.all([
                studentAPI.getAll(filterBatch ? { batchId: filterBatch } : {}),
                batchAPI.getAll(),
            ]);
            setStudents(studentsRes.data.students);
            setBatches(batchesRes.data.batches);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await studentAPI.update(editingStudent.studentId, formData);
            } else {
                await studentAPI.create(formData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            alert(error.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            studentId: student.studentId,
            name: student.name,
            email: student.email || '',
            batchId: student.batchId,
        });
        setShowForm(true);
    };

    const handleDelete = async (studentId) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            await studentAPI.delete(studentId);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({ studentId: '', name: '', email: '', batchId: '' });
        setEditingStudent(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
                <div className="flex gap-3">
                    <select
                        value={filterBatch}
                        onChange={(e) => setFilterBatch(e.target.value)}
                        className="input w-48"
                    >
                        <option value="">All Batches</option>
                        {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                                {batch.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary"
                    >
                        {showForm ? 'Cancel' : '+ Add Student'}
                    </button>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingStudent ? 'Edit Student' : 'Add New Student'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Student ID *
                                </label>
                                <input
                                    type="text"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    className="input"
                                    required
                                    disabled={!!editingStudent}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Batch *
                                </label>
                                <select
                                    value={formData.batchId}
                                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Select Batch</option>
                                    {batches.map((batch) => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="btn btn-primary">
                                {editingStudent ? 'Update' : 'Add'} Student
                            </button>
                            <button type="button" onClick={resetForm} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Students Table */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Batch
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {student.studentId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {student.email || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {student.batch?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(student)}
                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.studentId)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {students.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No students found. Add your first student to get started.
                </div>
            )}
        </div>
    );
}
