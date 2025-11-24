import { useState, useEffect } from 'react';
import { batchAPI } from '../utils/api';

export default function BatchManagement() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await batchAPI.getAll();
            setBatches(response.data.batches);
        } catch (error) {
            console.error('Error fetching batches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBatch) {
                await batchAPI.update(editingBatch.id, formData);
            } else {
                await batchAPI.create(formData);
            }
            fetchBatches();
            resetForm();
        } catch (error) {
            alert(error.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (batch) => {
        setEditingBatch(batch);
        setFormData({
            name: batch.name,
            description: batch.description || '',
            startDate: batch.startDate || '',
            endDate: batch.endDate || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this batch?')) return;

        try {
            await batchAPI.delete(id);
            fetchBatches();
        } catch (error) {
            alert(error.response?.data?.error || 'Delete failed');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', startDate: '', endDate: '' });
        setEditingBatch(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Batch Management</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? 'Cancel' : '+ Add Batch'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingBatch ? 'Edit Batch' : 'Create New Batch'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Batch Name *
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
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="btn btn-primary">
                                {editingBatch ? 'Update' : 'Create'} Batch
                            </button>
                            <button type="button" onClick={resetForm} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Batches List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map((batch) => (
                    <div key={batch.id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{batch.description}</p>
                            </div>
                            <span className={`badge ${batch.isActive ? 'badge-success' : 'badge-danger'}`}>
                                {batch.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                            {batch.startDate && (
                                <p>📅 Start: {new Date(batch.startDate).toLocaleDateString()}</p>
                            )}
                            {batch.endDate && (
                                <p>📅 End: {new Date(batch.endDate).toLocaleDateString()}</p>
                            )}
                            <p>👥 Students: {batch.students?.length || 0}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(batch)}
                                className="btn btn-secondary flex-1 text-sm"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(batch.id)}
                                className="btn btn-danger flex-1 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {batches.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No batches found. Create your first batch to get started.
                </div>
            )}
        </div>
    );
}
