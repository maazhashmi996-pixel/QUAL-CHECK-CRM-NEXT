"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
    const [formData, setFormData] = useState({
        fullName: '',
        universityName: '',
        degreeTitle: '',
        graduationYear: '',
        registrationNo: '',
        serviceType: 'Academic',
        packageType: 'Standard',
        degreeDoc: '',     // Filhal hum yahan URLs lenge
        transcriptDoc: '',
        passportDoc: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // Check login status
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) router.push('/login');
    }, [router]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/verification/submit', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Request successfully submitted! Access Code: " + res.data.request.accessCode);
            // Form reset
        } catch (err: any) {
            setError(err.response?.data?.message || "Submission fail ho gayi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">New Verification Request</h1>
                    <button
                        onClick={() => { localStorage.clear(); router.push('/login'); }}
                        className="text-red-500 hover:text-red-700 font-medium"
                    >
                        Logout
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal & Degree Info */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Full Name (as per Degree)</label>
                            <input type="text" name="fullName" onChange={handleChange} required className="w-full p-2 border rounded mt-1 text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">University Name</label>
                            <input type="text" name="universityName" onChange={handleChange} required className="w-full p-2 border rounded mt-1 text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Degree Title</label>
                            <input type="text" name="degreeTitle" placeholder="e.g. BS Computer Science" onChange={handleChange} required className="w-full p-2 border rounded mt-1 text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Graduation Year</label>
                            <input type="number" name="graduationYear" onChange={handleChange} required className="w-full p-2 border rounded mt-1 text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Registration / Roll No</label>
                            <input type="text" name="registrationNo" onChange={handleChange} required className="w-full p-2 border rounded mt-1 text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Service Type</label>
                            <select name="serviceType" onChange={handleChange} className="w-full p-2 border rounded mt-1 text-black font-sans">
                                <option value="Academic">Academic</option>
                                <option value="Employment">Employment</option>
                            </select>
                        </div>
                    </div>

                    <hr />

                    {/* Document URLs (Temporary for now) */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-700">Document Links (PDF/Images)</h3>
                        <input type="text" name="degreeDoc" placeholder="Degree Document URL" onChange={handleChange} className="w-full p-2 border rounded text-black font-sans text-sm" />
                        <input type="text" name="transcriptDoc" placeholder="Transcript Document URL" onChange={handleChange} className="w-full p-2 border rounded text-black font-sans text-sm" />
                        <input type="text" name="passportDoc" placeholder="Passport Copy URL" onChange={handleChange} className="w-full p-2 border rounded text-black font-sans text-sm" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-bold ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Verification Request'}
                    </button>
                </form>

                {message && <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-300 font-bold">{message}</div>}
                {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">{error}</div>}
            </div>
        </div>
    );
}