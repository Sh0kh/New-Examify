import { useEffect, useState } from "react";
import {
    Typography,
    Chip,
    Button
} from "@material-tailwind/react";
import { $api } from "../../../../utils";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import Loading from "../../../UI/Loadings/Loading";

export default function MyResultHero() {
    const [data, setData] = useState([]);
    const [links, setLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const getMyResult = async (page = 1) => {
        try {
            setLoading(true);
            const userData = {
                user_id: localStorage.getItem("user_id"),
            };
            const response = await $api.post(`/user/my-exams?page=${page}`, userData);
            setData(response?.data?.data || []);
            setLinks(response?.data?.links || []);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyResult(currentPage);
    }, [currentPage]);

    const handlePageChange = (label, url) => {
        if (!url) return;
        const pageNum = Number(new URL(url).searchParams.get("page"));
        if (!isNaN(pageNum)) {
            setCurrentPage(pageNum);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Typography
                    variant="h4"
                    color="blue-gray"
                    className="text-center font-bold"
                >
                    My Exam Results
                </Typography>

                {loading ? (
                    <Loading />
                ) : data.length === 0 ? (
                    <Typography color="gray" className="text-center text-lg">
                        No exam results available.
                    </Typography>
                ) : (
                    <div className="space-y-4">
                        {data.map((item) => {
                            const isFinished = item.status === "finished";
                            const statusColor = isFinished ? "green" : "amber";
                            const StatusIcon = isFinished ? CheckCircleIcon : ClockIcon;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-3 text-gray-800">
                                            <StatusIcon className={`h-5 w-5 text-${statusColor}-500`} />
                                            <Typography variant="h6" className="font-semibold">
                                                {item.exam?.name || "Unnamed Exam"}
                                            </Typography>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-700">
                                            <p>
                                                <span className="text-gray-500 font-medium">Language:</span>{" "}
                                                {item.exam?.language}
                                            </p>
                                            <p>
                                                <span className="text-gray-500 font-medium">Score:</span>{" "}
                                                {item.score ?? "Not yet available"}
                                            </p>
                                            <p>
                                                <span className="text-gray-500 font-medium">Price:</span>{" "}
                                                {item.exam?.price} UZS
                                            </p>
                                            <p className="text-gray-500 sm:hidden">
                                                <span className="font-medium">Started:</span>{" "}
                                                {new Date(item.start_time).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end mt-4 sm:mt-0 sm:ml-4 gap-2">
                                        <Chip
                                            value={isFinished ? "Completed" : "In Progress"}
                                            color={statusColor}
                                            className="rounded-full text-xs px-2 py-1"
                                        />
                                        {isFinished ? (
                                            <NavLink to={`/my-result/${item?.id}`}>
                                                <Button size="sm" color="green" className="rounded-md shadow-sm">
                                                    View
                                                </Button>
                                            </NavLink>
                                        ) : (
                                            <Button size="sm" color="amber" className="rounded-md shadow-sm">
                                                Continue
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* PAGINATION */}
                <div className="flex flex-wrap justify-center gap-2 pt-10">
                    {links.map((link, idx) => (
                        <button
                            key={idx}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            disabled={!link.url}
                            onClick={() => handlePageChange(link.label, link.url)}
                            className={`min-w-[36px] px-3 py-1.5 border text-sm rounded-md transition ${link.active
                                    ? "bg-blue-600 text-white shadow"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
