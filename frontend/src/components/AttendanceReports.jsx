import { useState, useEffect } from 'react';
import { batchAPI, exportAPI } from '../utils/api';

export default function AttendanceReports() {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBatches();
        // Set default dates to current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await batchAPI.getAll();
            setBatches(response.data.batches);
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    const fetchAttendance = async () => {
        if (!selectedBatch) {
            alert('Please select a batch');
            return;
        }

        setLoading(true);
        try {
            const response = await batchAPI.getAttendance(selectedBatch, {
                startDate,
                endDate,
            });
            setAttendanceData(response.data);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!selectedBatch) {
            alert('Please select a batch');
            return;
        }

        try {
            const response = await exportAPI.attendance({
                batchId: selectedBatch,
                startDate,
                endDate,
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_${selectedBatch}_${startDate}_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to export');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Attendance Reports</h2>

            {/* Filters */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Batch *
                        </label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="input"
                        >
                            <option value="">Select Batch</option>
                            {batches.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            onClick={fetchAttendance}
                            disabled={loading}
                            className="btn btn-primary flex-1"
                        >
                            {loading ? 'Loading...' : 'View Report'}
                        </button>
                        <button
                            onClick={handleExport}
                            className="btn btn-secondary"
                            title="Export to Excel"
                        >
                            📥
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            {attendanceData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Events</p>
                                <p className="text-3xl font-bold text-blue-900">{attendanceData.totalEvents}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-50 to-green-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">IN Events</p>
                                <p className="text-3xl font-bold text-green-900">
                                    {attendanceData.events.filter(e => e.eventType === 'IN').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600">OUT Events</p>
                                <p className="text-3xl font-bold text-yellow-900">
                                    {attendanceData.events.filter(e => e.eventType === 'OUT').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🚪</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Table */}
            {attendanceData && attendanceData.events.length > 0 && (
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Student ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Event Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        IP Address
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendanceData.events.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {event.student?.studentId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {event.student?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`badge ${event.eventType === 'IN' ? 'badge-success' : 'badge-warning'}`}>
                                                {event.eventType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {event.ipAddress || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {attendanceData && attendanceData.events.length === 0 && (
                <div className="card text-center py-12 text-gray-500">
                    No attendance records found for the selected criteria.
                </div>
            )}
        </div>
    );
}
