"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload'; // Component import karein

export default function StudentDashboard() {
    const [formData, setFormData] = useState({
        fullName: '',
        universityName: '',
        degreeTitle: '',
        graduationYear: '',
        registrationNo: '',
        serviceType: 'Academic',
        packageType: 'Standard',
        degreeDoc: '',
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
        if (!token) router.push('/'); // Home (Login) par bhejein
    }, [router]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Validation: Check if files are uploaded
        if (!formData.degreeDoc || !formData.transcriptDoc || !formData.passportDoc) {
            setError("Tamam documents upload karna zaroori hain.");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/verification/submit', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Request successfully submitted! Access Code: " + res.data.request.accessCode);

            // Success ke baad form reset kar sakte hain
        } catch (err: any) {
            setError(err.response?.data?.message || "Submission fail ho gayi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">New Verification Request</h1>
                        <p className="text-sm text-gray-500">Apni details aur documents upload karein.</p>
                    </div>
                    <button
                        onClick={() => { localStorage.clear(); router.push('/'); }}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all font-medium"
                    >
                        Logout
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal & Degree Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-blue-700 border-b pb-2">Academic Information</h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Full Name (as per Degree)</label>
                                <input type="text" name="fullName" onChange={handleChange} required className="w-full p-3 border rounded-lg mt-1 text-black outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">University Name</label>
                                <input type="text" name="universityName" onChange={handleChange} required className="w-full p-3 border rounded-lg mt-1 text-black outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Degree Title</label>
                                <input type="text" name="degreeTitle" placeholder="e.g. BS Computer Science" onChange={handleChange} required className="w-full p-3 border rounded-lg mt-1 text-black outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-blue-700 border-b pb-2">Identification Details</h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Graduation Year</label>
                                <input type="number" name="graduationYear" onChange={handleChange} required className="w-full p-3 border rounded-lg mt-1 text-black outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Registration / Roll No</label>
                                <input type="text" name="registrationNo" onChange={handleChange} required className="w-full p-3 border rounded-lg mt-1 text-black outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Service Type</label>
                                <select name="serviceType" onChange={handleChange} className="w-full p-3 border rounded-lg mt-1 text-black outline-none focus:ring-2 focus:ring-blue-500 font-sans">
                                    <option value="Academic">Academic Verification</option>
                                    <option value="Employment">Employment Verification</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Real File Uploads */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-blue-700 border-b pb-2">Upload Required Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FileUpload
                                label="Degree Certificate"
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, degreeDoc: url }))}
                            />
                            <FileUpload
                                label="Transcript / Marksheet"
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, transcriptDoc: url }))}
                            />
                            <FileUpload
                                label="Passport / ID Copy"
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, passportDoc: url }))}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic">* Files must be in Image or PDF format (Max 5MB).</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}
                    >
                        {loading ? 'Submitting Application...' : 'Submit Verification Request'}
                    </button>
                </form>

                {/* Status Messages */}
                {message && (
                    <div className="mt-6 p-6 bg-green-50 text-green-700 rounded-2xl border-2 border-green-200 animate-bounce">
                        <p className="text-center font-bold text-lg">{message}</p>
                        <p className="text-center text-sm mt-2 italic text-green-600 underline">Is code ko mehfooz kar len, university isi se verify karegi.</p>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center font-medium">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}