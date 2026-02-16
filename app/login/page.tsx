"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', formData);

            // Token aur User Info save karna
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Dashboard par redirect karna
            if (res.data.user.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login fail ho gaya. Details check karein.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-2 text-center text-blue-700 font-sans">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8 font-sans text-sm">Apne account mein login karein</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="example@mail.com"
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none text-black focus:ring-2 focus:ring-blue-500 font-sans"
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
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none text-black focus:ring-2 focus:ring-blue-500 font-sans"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-3 rounded-lg text-white font-semibold transition-all font-sans ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                            }`}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm font-sans">
                        {error}
                    </div>
                )}

                <div className="mt-8 text-center text-sm text-gray-600 font-sans">
                    Account nahi hai?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline font-bold">
                        Register karein
                    </Link>
                </div>
            </div>
        </div>
    );
}