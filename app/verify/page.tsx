"use client";

import { useState, FormEvent } from 'react';
import api from '@/lib/axios';

interface VerifiedData {
    fullName: string;
    universityName: string;
    degreeTitle: string;
    status: string;
    verifiedReportUrl: string;
    createdAt: string;
    serviceType: string;
    graduationYear: number;
}

export default function UniversityVerify() {
    const [code, setCode] = useState('');
    const [result, setResult] = useState<VerifiedData | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Humne backend par route banaya tha: /verification/verify/:code
            const res = await api.get(`/verification/verify/${code}`);
            setResult(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid Access Code ya report abhi tayyar nahi hui.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans">
            <div className="max-w-md w-full text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Verify Credential</h1>
                <p className="text-slate-600">Student ka Access Code darj karein taake verified report dekhi ja sakay.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100">
                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Enter Access Code
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="E.G. A1B2C3D4"
                            className="w-full p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-center text-2xl font-mono font-bold tracking-widest text-black"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
                    >
                        {loading ? 'Verifying...' : 'Search Record'}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Result Display */}
                {result && (
                    <div className="mt-8 p-6 bg-green-50 rounded-2xl border-2 border-green-100 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-center mb-4">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">✓ Verified Record Found</span>
                        </div>

                        <div className="space-y-4 text-slate-800">
                            <div className="flex justify-between border-b border-green-100 pb-2">
                                <span className="text-slate-500 text-sm italic">Name:</span>
                                <span className="font-bold">{result.fullName}</span>
                            </div>
                            <div className="flex justify-between border-b border-green-100 pb-2">
                                <span className="text-slate-500 text-sm italic">University:</span>
                                <span className="font-bold text-right">{result.universityName}</span>
                            </div>
                            <div className="flex justify-between border-b border-green-100 pb-2">
                                <span className="text-slate-500 text-sm italic">Degree:</span>
                                <span className="font-bold">{result.degreeTitle}</span>
                            </div>
                            <div className="flex justify-between border-b border-green-100 pb-2">
                                <span className="text-slate-500 text-sm italic">Graduation Year:</span>
                                <span className="font-bold">{result.graduationYear}</span>
                            </div>
                        </div>

                        <a
                            href={result.verifiedReportUrl}
                            target="_blank"
                            className="mt-6 block w-full bg-green-600 text-white text-center py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                        >
                            Download Official Report (PDF)
                        </a>
                    </div>
                )}
            </div>

            <footer className="mt-12 text-slate-400 text-sm">
                © 2026 Your CRM Verification System. Secure & Trusted.
            </footer>
        </div>
    );
}