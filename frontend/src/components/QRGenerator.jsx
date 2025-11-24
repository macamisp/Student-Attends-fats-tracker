import { useState, useEffect } from 'react';
import { qrAPI, batchAPI } from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';

export default function QRGenerator() {
    const [batches, setBatches] = useState([]);
    const [activeTokens, setActiveTokens] = useState([]);
    const [generatedQR, setGeneratedQR] = useState(null);
    const [formData, setFormData] = useState({
        batchId: '',
        eventType: 'IN',
        validFrom: '',
        validTo: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [batchesRes, tokensRes] = await Promise.all([
                batchAPI.getAll(),
                qrAPI.getActive(),
            ]);
            setBatches(batchesRes.data.batches);
            setActiveTokens(tokensRes.data.tokens);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            const response = await qrAPI.generate(formData);
            setGeneratedQR(response.data);
            fetchData(); // Refresh active tokens
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to generate QR code');
        }
    };

    const handleDeactivate = async (id) => {
        if (!confirm('Deactivate this QR code?')) return;
        try {
            await qrAPI.deactivate(id);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to deactivate');
        }
    };

    const downloadQR = () => {
        const canvas = document.getElementById('qr-canvas');
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${generatedQR.qrToken.batchName}_${generatedQR.qrToken.eventType}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    // Set default dates
    useEffect(() => {
        const now = new Date();
        const today = now.toISOString().slice(0, 16);
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

        if (!formData.validFrom) {
            setFormData(prev => ({ ...prev, validFrom: today }));
        }
        if (!formData.validTo) {
            setFormData(prev => ({ ...prev, validTo: tomorrow }));
        }
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Generator Form */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Generate New QR Code</h3>
                    <form onSubmit={handleGenerate} className="space-y-4">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Type *
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="IN"
                                        checked={formData.eventType === 'IN'}
                                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                        className="mr-2"
                                    />
                                    <span className="badge badge-success">IN</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="OUT"
                                        checked={formData.eventType === 'OUT'}
                                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                        className="mr-2"
                                    />
                                    <span className="badge badge-warning">OUT</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valid From *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.validFrom}
                                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valid To *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.validTo}
                                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                                className="input"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full">
                            Generate QR Code
                        </button>
                    </form>
                </div>

                {/* Generated QR Display */}
                {generatedQR && (
                    <div className="card text-center">
                        <h3 className="text-lg font-semibold mb-4">Generated QR Code</h3>
                        <div className="bg-white p-6 rounded-lg inline-block">
                            <canvas id="qr-canvas" style={{ display: 'none' }} />
                            <QRCodeSVG
                                value={generatedQR.attendanceUrl}
                                size={256}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-left">
                            <p><strong>Batch:</strong> {generatedQR.qrToken.batchName}</p>
                            <p><strong>Type:</strong> <span className={`badge ${generatedQR.qrToken.eventType === 'IN' ? 'badge-success' : 'badge-warning'}`}>{generatedQR.qrToken.eventType}</span></p>
                            <p><strong>Valid From:</strong> {new Date(generatedQR.qrToken.validFrom).toLocaleString()}</p>
                            <p><strong>Valid To:</strong> {new Date(generatedQR.qrToken.validTo).toLocaleString()}</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <button onClick={downloadQR} className="btn btn-primary w-full">
                                Download QR Code
                            </button>
                            <button
                                onClick={() => navigator.clipboard.writeText(generatedQR.attendanceUrl)}
                                className="btn btn-secondary w-full"
                            >
                                Copy URL
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Active Tokens */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Active QR Codes</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid From</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid To</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activeTokens.map((token) => (
                                <tr key={token.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{token.batch?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`badge ${token.eventType === 'IN' ? 'badge-success' : 'badge-warning'}`}>
                                            {token.eventType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(token.validFrom).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(token.validTo).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button
                                            onClick={() => handleDeactivate(token.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Deactivate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {activeTokens.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No active QR codes</p>
                )}
            </div>
        </div>
    );
}
