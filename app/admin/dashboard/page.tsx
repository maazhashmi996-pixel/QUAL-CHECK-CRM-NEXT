"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

// Interfaces for Type Safety
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
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Parallel fetching for better performance
            const [usersRes, reqsRes] = await Promise.all([
                api.get('/auth/pending-users', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get('/verification/admin/all', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setPendingUsers(usersRes.data);
            setAllRequests(reqsRes.data);
        } catch (err: any) {
            console.error("Data fetch error", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.clear();
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const approveStudent = async (userId: string) => {
        if (!confirm("Are you sure you want to approve this student?")) return;

        try {
            const token = localStorage.getItem('token');
            await api.put(`/auth/approve/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // UI Update: Remove approved user from list
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
            alert("User approved successfully!");
        } catch (err) {
            console.error("Approval error", err);
            alert("Approval failed! Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-blue-900 text-white p-6 flex flex-col fixed h-full">
                <h2 className="text-2xl font-bold mb-10 tracking-tight">Admin CRM</h2>
                <nav className="space-y-4 flex-1">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-700 shadow-inner' : 'hover:bg-blue-800'
                            }`}
                    >
                        Pending Approvals
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${activeTab === 'requests' ? 'bg-blue-700 shadow-inner' : 'hover:bg-blue-800'
                            }`}
                    >
                        Verification Requests
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="w-full text-left p-3 text-red-300 hover:text-red-100 border-t border-blue-800 pt-5 transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Main Content Area (Margin left to compensate for fixed sidebar) */}
            <div className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {activeTab === 'users' ? 'User Approvals' : 'All Verification Requests'}
                    </h1>
                    <p className="text-gray-500 mt-1">Manage student accounts and degree verifications.</p>
                </header>

                {activeTab === 'users' ? (
                    /* User Table */
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-gray-600 font-semibold text-sm">Name</th>
                                    <th className="p-4 text-gray-600 font-semibold text-sm">Email</th>
                                    <th className="p-4 text-gray-600 font-semibold text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-10 text-center text-gray-400">
                                            No pending users found.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingUsers.map(user => (
                                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-black font-medium">{user.name}</td>
                                            <td className="p-4 text-gray-600">{user.email}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => approveStudent(user.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
                                                >
                                                    Approve Student
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Verification Requests Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allRequests.length === 0 ? (
                            <div className="col-span-full p-10 text-center text-gray-400 bg-white rounded-xl border">
                                No verification requests found.
                            </div>
                        ) : (
                            allRequests.map(req => (
                                <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-blue-600 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'COMPLETED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {req.status}
                                        </span>
                                        <span className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-500 border border-gray-200">
                                            ID: {req.accessCode}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 mb-1">{req.fullName}</h3>
                                    <p className="text-sm text-gray-500 mb-6 flex-grow">{req.universityName}</p>
                                    <button
                                        onClick={() => router.push(`/admin/verify/${req.id}`)}
                                        className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-semibold text-sm"
                                    >
                                        View & Upload Report
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}