"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    isApproved: boolean;
}

interface Request {
    id: string;
    fullName: string;
    universityName: string;
    status: string;
    accessCode: string;
}

export default function AdminDashboard() {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [allRequests, setAllRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');
    const router = useRouter();

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [usersRes, reqsRes] = await Promise.all([
                api.get('/auth/pending-users', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/verification/admin/all', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setPendingUsers(usersRes.data);
            setAllRequests(reqsRes.data);
        } catch (err) {
            console.error("Data fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const approveStudent = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/auth/approve/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setPendingUsers(pendingUsers.filter(u => u.id !== userId));
            alert("User approved successfully!");
        } catch (err) {
            alert("Approval failed!");
        }
    };

    if (loading) return <div className="p-10 text-center font-sans">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-blue-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-10">Admin CRM</h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left p-3 rounded ${activeTab === 'users' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                    >
                        Pending Approvals
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`w-full text-left p-3 rounded ${activeTab === 'requests' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                    >
                        Verification Requests
                    </button>
                    <button
                        onClick={() => { localStorage.clear(); router.push('/login'); }}
                        className="w-full text-left p-3 text-red-300 hover:text-red-100 mt-10"
                    >
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {activeTab === 'users' ? 'User Approvals' : 'All Verification Requests'}
                    </h1>
                </header>

                {activeTab === 'users' ? (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 text-gray-600 font-sans">Name</th>
                                    <th className="p-4 text-gray-600 font-sans">Email</th>
                                    <th className="p-4 text-gray-600 font-sans">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.length === 0 && <tr><td colSpan={3} className="p-10 text-center text-gray-400">No pending users.</td></tr>}
                                {pendingUsers.map(user => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 text-black font-medium">{user.name}</td>
                                        <td className="p-4 text-gray-600">{user.email}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => approveStudent(user.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                            >
                                                Approve Student
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allRequests.map(req => (
                            <div key={req.id} className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {req.status}
                                    </span>
                                    <span className="text-xs font-mono bg-gray-100 p-1 rounded">Code: {req.accessCode}</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-1">{req.fullName}</h3>
                                <p className="text-sm text-gray-500 mb-4">{req.universityName}</p>
                                <button
                                    onClick={() => router.push(`/admin/verify/${req.id}`)}
                                    className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-semibold"
                                >
                                    View & Upload Report
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}