import React from "react";
import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const lineData = {
    labels: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun"],
    datasets: [
        {
            label: "Daromad",
            data: [1200, 1900, 3000, 2500, 3200, 4000],
            fill: false,
            borderColor: "#3b82f6",
            tension: 0.3,
            pointBackgroundColor: "#3b82f6",
        },
    ],
};

const lineOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { color: "#6b7280", font: { size: 12 } },
        },
        x: {
            ticks: { color: "#6b7280", font: { size: 12 } },
        },
    },
};

const stats = [
    { label: "Jami buyurtmalar", value: "1 245" },
    { label: "Yangi mijozlar", value: "318" },
    { label: "Oy daromadi", value: "₽412,300" },
    { label: "Bajarilgan vazifalar", value: "92%" },
];

const ReportDashboardUzbek = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen w-full">
            <Typography variant="h4" color="blue-gray" className="mb-6 text-center">
                📊 Yarmi yillik hisobot
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full">
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
            <Card className="w-full p-4 shadow-md rounded-xl bg-white">
                <CardBody>
                    <Typography variant="h6" color="blue-gray" className="mb-4">
                        Oy bo‘yicha daromad grafigi
                    </Typography>
                    <div className="h-72 w-full">
                        <Line className="w-full" data={lineData} options={lineOptions} />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ReportDashboardUzbek;
