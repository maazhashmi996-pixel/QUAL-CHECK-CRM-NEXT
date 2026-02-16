"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // TypeScript Fix: FormEvent type add ki hai
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // Backend call
            const res = await api.post('/auth/signup', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            setMessage(res.data.message);
            // Form clear karna register hone ke baad
            setFormData({ name: '', email: '', password: '' });
        } catch (err: any) {
            // TypeScript Fix: err: any lagaya hai taake red line na aaye
            const errorMessage = err.response?.data?.message || 'Registration fail ho gayi. Dubara koshish karein.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Input change handler for TypeScript
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 font-sans">Student Register</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="John Doe"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black font-sans"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="example@mail.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black font-sans"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black font-sans"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-3 rounded-lg text-white font-semibold transition-all font-sans ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Create Account'}
                    </button>
                </form>

                {/* Success Message */}
                {message && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center text-sm font-medium font-sans">
                        {message}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center text-sm font-sans">
                        {error}
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-gray-600 font-sans">
                    Pehle se account hai?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-bold">
                        Login karein
                    </Link>
                </div>
            </div>
        </div>
    );
}