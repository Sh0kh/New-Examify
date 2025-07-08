import { useEffect, useState } from 'react';
import { BarChart2, Users, CheckCircle, XCircle, Calendar } from 'lucide-react';

export default function StudyCenterDashboard() {
    const [stats] = useState({
        totalExams: 15,
        totalUsers: 89,
        passedUsers: 67,
        failedUsers: 22,
        recentResults: [
            {
                id: 1,
                user_name: "Ali Valiyev",
                exam_title: "Matematika",
                passed: true,
                date: "2025-04-05T10:30:00Z"
            },
            {
                id: 2,
                user_name: "Nodira Karimova",
                exam_title: "Ingliz tili",
                passed: false,
                date: "2025-04-04T15:20:00Z"
            },
            {
                id: 3,
                user_name: "Sardor Bekov",
                exam_title: "Fizika",
                passed: true,
                date: "2025-04-03T09:15:00Z"
            },
            {
                id: 4,
                user_name: "Madina Tursunova",
                exam_title: "Biologiya",
                passed: false,
                date: "2025-04-02T11:45:00Z"
            }
        ],
    });

    // Фейковая активность по дням
    const activityData = [
        { day: "Dush", passed: 5, failed: 2 },
        { day: "Sesh", passed: 3, failed: 1 },
        { day: "Chor", passed: 7, failed: 3 },
        { day: "Pay", passed: 4, failed: 2 },
        { day: "Jum", passed: 6, failed: 1 },
        { day: "Shan", passed: 2, failed: 4 },
        { day: "Yak", passed: 1, failed: 3 },
    ];

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Boshqaruv paneli</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <StatCard title="Jami imtixonlar" value={stats.totalExams} icon={<BarChart2 size={20} />} />
                <StatCard title="Jami foydalanuvchilar" value={stats.totalUsers} icon={<Users size={20} />} />
                <StatCard title="Topshirganlar" value={stats.passedUsers} icon={<CheckCircle size={20} />} color="green" />
                <StatCard title="Yiqilganlar" value={stats.failedUsers} icon={<XCircle size={20} />} color="red" />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Haftalik aktivlik</h2>
                    <SimpleBarChart data={activityData} />
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Oxirgi natijalar</h2>
                    <RecentResultsTable results={stats.recentResults} />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color = "blue" }) {
    const colorMap = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        red: "bg-red-500",
    };

    return (
        <div className="flex items-center bg-white rounded-lg shadow-sm border-l-4 border-blue-500 overflow-hidden">
  
            <div className="pl-4 pr-6 py-4">
                <h3 className="text-sm text-gray-500">{title}</h3>
                <p className="text-xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

function SimpleBarChart({ data }) {
    // Находим максимальное значение для масштабирования
    const maxVal = Math.max(...data.map(d => Math.max(d.passed, d.failed))) || 1;

    return (
        <div className="space-y-4">
            {data.map((day, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <div className="w-10 text-xs text-right text-gray-600">{day.day}</div>
                    <div className="flex-1 h-8 flex items-center space-x-1">
                        <div
                            className="bg-green-500 h-full rounded-l"
                            style={{ width: `${(day.passed / maxVal) * 100}%` }}
                        ></div>
                        <div
                            className="bg-red-500 h-full rounded-r"
                            style={{ width: `${(day.failed / maxVal) * 100}%` }}
                        ></div>
                    </div>
                    <div className="w-10 text-xs text-left text-gray-600">{day.passed + day.failed}</div>
                </div>
            ))}
            <div className="flex justify-between text-xs text-gray-500 px-12 mt-1">
                <span>Topshirdi</span>
                <span>Yiqildi</span>
            </div>
        </div>
    );
}

function RecentResultsTable({ results }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="px-4 py-2">F.I.O.</th>
                        <th className="px-4 py-2">Imtixon</th>
                        <th className="px-4 py-2">Natija</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {results.length > 0 ? (
                        results.map(res => (
                            <tr key={res.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{res.user_name}</td>
                                <td className="px-4 py-2">{res.exam_title}</td>
                                <td className={`px-4 py-2 font-medium flex items-center ${res.passed ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {res.passed ? (
                                        <>
                                            <CheckCircle size={14} className="mr-1" /> Topshirdi
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={14} className="mr-1" /> Yiqildi
                                        </>
                                    )}
                                </td>
                                <td className="px-4 py-2 flex items-center">
                                    <Calendar size={14} className="mr-1 text-gray-400" />
                                    {new Date(res.date).toLocaleDateString('uz-UZ')}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                                Ma'lumot topilmadi
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}