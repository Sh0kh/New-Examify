import React, { useEffect, useState } from "react";
import {
    Card,
    Typography
} from "@material-tailwind/react";
import { $api } from "../../../utils";
import Loading from "../../UI/Loadings/Loading";

const ReportDashboardUzbek = () => {
    const [reportData, setReportData] = useState({
        all_users_count: 0,
        all_study_centers_count: 0,
        all_payments_sum: 0,
        active_exams_count: 0,
    });
    const [loading, setLoading] = useState(true)

    const getReport = async () => {
        try {
            const response = await $api.get(`/admin/dashboard`);
            setReportData(response.data);
        } catch (error) {
            console.error("Xatolik yuz berdi:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getReport();
    }, []);

    const stats = [
        { label: "Foydalanuvchilar soni", value: reportData.all_users_count },
        { label: "Ta'lim markazlari", value: reportData.all_study_centers_count },
        { label: "Faol imtihonlar", value: reportData.active_exams_count },
    ];

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-full">
            <Typography variant="h4" color="blue-gray" className="mb-6 text-left">
                Dashboard
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-4 shadow-sm rounded-xl border border-blue-gray-50 bg-white w-full">
                        <Typography variant="small" color="blue-gray" className="mb-2">
                            {stat.label}
                        </Typography>
                        <Typography variant="h5" color="blue">
                            {stat.value}
                        </Typography>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReportDashboardUzbek;
