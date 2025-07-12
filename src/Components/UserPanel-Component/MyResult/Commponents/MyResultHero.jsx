import { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Chip,
    Button
} from "@material-tailwind/react";
import { $api } from "../../../../utils";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

export default function MyResultHero() {
    const [data, setData] = useState([]);

    const getMyResult = async () => {
        try {
            const userData = {
                user_id: localStorage.getItem("user_id"),
            };
            const response = await $api.post(`/user/my-exams`, userData);
            setData(response?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMyResult();
    }, []);

    return (
        <section className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <Typography
                    variant="h4"
                    color="blue-gray"
                    className="mb-6 text-center font-semibold"
                >
                    My Exam Results
                </Typography>

                {data.length === 0 ? (
                    <Typography color="gray" className="text-center">
                        No exam results available.
                    </Typography>
                ) : (
                    data.map((item) => {
                        const isFinished = item.status === "finished";
                        const statusColor = isFinished ? "green" : "amber";
                        const StatusIcon = isFinished ? CheckCircleIcon : ClockIcon;

                        return (
                            <Card
                                key={item.id}
                                className="w-full shadow-md border border-gray-200"
                            >
                                <CardBody className="space-y-4 p-6">
                                    <div className="flex justify-between items-center flex-wrap gap-3">
                                        <div>
                                            <Typography variant="h5" className="font-medium">
                                                {item.exam?.name || "Unnamed Exam"}
                                            </Typography>
                                            <Typography className="text-sm text-gray-500">
                                                Language: {item.exam?.language}
                                            </Typography>
                                        </div>

                                        <Chip
                                            icon={<StatusIcon className="h-4 w-4" />}
                                            value={isFinished ? "Completed" : "In Progress"}
                                            color={statusColor}
                                            className="px-3 py-1.5 text-sm font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                        <div>
                                            <Typography className="font-medium text-gray-600">
                                                Start Time
                                            </Typography>
                                            <Typography>
                                                {new Date(item.start_time).toLocaleString()}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography className="font-medium text-gray-600">
                                                Score
                                            </Typography>
                                            <Typography>
                                                {item.score ?? "Not yet available"}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography className="font-medium text-gray-600">
                                                Price
                                            </Typography>
                                            <Typography>
                                                {item.exam?.price} UZS
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        {isFinished ? (
                                            <NavLink to={`/my-result/${item?.id}`}>
                                                <Button
                                                    color="green"
                                                    size="md"
                                                    className="rounded-md shadow-md"
                                                >
                                                    View Result
                                                </Button>
                                            </NavLink>
                                        ) : (
                                            <Button
                                                color="amber"
                                                size="md"
                                                className="rounded-md shadow-md"
                                            >
                                                Continue Exam
                                            </Button>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })
                )}
            </div>
        </section>
    );
}
