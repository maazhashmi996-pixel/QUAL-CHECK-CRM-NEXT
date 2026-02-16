"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isApproved: boolean;
    createdAt: string;
}

export default function ManageStudents() {
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchAllStudents();
    }, []);

    const fetchAllStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/auth/all-users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter taake sirf students nazar aayein, admin nahi
            setStudents(res.data.filter((user: User) => user.role === 'STUDENT'));
        } catch (err) {
            console.error("Error fetching students", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteStudent = async (id: string) => {
        if (!window.confirm("Kya aap waqai is student ko delete karna chahte hain?")) return;

        try {
            const token = localStorage.getItem('token');
            await api.delete(`/auth/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(students.filter(s => s.id !== id));
            alert("Student deleted successfully.");
        } catch (err) {
            alert("Delete fail ho gaya.");
        }
    };

    if (loading) return <div className="p-10 text-center font-sans">Loading Students Database...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Student Database</h1>
                        <p className="text-gray-500 text-sm">Tamam registered students ki list aur status yahan manage karein.</p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-bold text-gray-700">Name</th>
                                <th className="p-4 font-bold text-gray-700">Email</th>
                                <th className="p-4 font-bold text-gray-700">Status</th>
                                <th className="p-4 font-bold text-gray-700">Joined Date</th>
                                <th className="p-4 font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-black">{student.name}</td>
                                    <td className="p-4 text-gray-600">{student.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {student.isApproved ? 'APPROVED' : 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(student.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => deleteStudent(student.id)}
                                            className="text-red-500 hover:bg-red-50 px-3 py-1 rounded border border-red-100 transition-all text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}