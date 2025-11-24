import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { attendanceAPI } from '../utils/api';

export default function AttendancePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setError('Invalid QR code. No token provided.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId.trim()) {
            setError('Please enter your student ID');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await attendanceAPI.mark({ token, studentId });
            setMessage(response.data);
            setStudentId('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="card">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Mark Attendance
                        </h1>
                        <p className="text-gray-600">
                            Enter your student ID to mark your attendance
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                            <div className="flex items-center justify-center mb-3">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-green-900 text-center mb-2">
                                Attendance Marked!
                            </h3>
                            <div className="space-y-1 text-sm text-green-800">
                                <p className="text-center"><strong>{message.event?.studentName}</strong></p>
                                <p className="text-center">ID: {message.event?.studentId}</p>
                                <p className="text-center">Type: <span className="badge badge-success">{message.event?.type}</span></p>
                                <p className="text-center text-xs text-green-600 mt-2">
                                    {new Date(message.event?.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    {!message && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Student ID
                                </label>
                                <input
                                    type="text"
                                    id="studentId"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="Enter your student ID (e.g., CS001)"
                                    className="input"
                                    disabled={loading || !token}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !token || !studentId.trim()}
                                className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    'Submit Attendance'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-500">
                            QR Attendance System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
