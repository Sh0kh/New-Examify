import { Card, Typography, IconButton } from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { $api } from "../../../utils";
import { useEffect, useState } from "react";
import Loading from "../../UI/Loadings/Loading";

export default function Reyting() {
    const TABLE_HEAD = ["Name", "Exam", "Type", "Date", "Action"];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUncheckedExam = async () => {
        setLoading(true);
        try {
            const response = await $api.get(`/study-center/get-unchecked-exams/${localStorage.getItem("StId")}`);
            setData(response?.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUncheckedExam();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="p-[20px]">
            <Typography variant="h5" color="blue-gray" className="mb-6 font-bold">
                Unchecked Exams
            </Typography>

            {data.length === 0 ? (
                <Card className="w-full p-10 text-center flex flex-col items-center justify-center bg-blue-50">
                    <InformationCircleIcon className="h-10 w-10 text-blue-500 mb-3" />
                    <Typography variant="h6" className="text-blue-800">
                        No exam data found
                    </Typography>
                    <Typography variant="small" className="text-blue-gray-500 mt-1">
                        All exams have been checked or there are no exams available yet.
                    </Typography>
                </Card>
            ) : (
                <Card className="w-full mx-auto p-6">
                    <Card className="h-full w-full overflow-scroll">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    const isLast = index === data.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={item.id}>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {index + 1}. {item.user?.name || "—"} {' '} {item.user?.surname || "—"}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {item.exam?.name || "—"}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {item.exam?.language || "—"}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {new Date(item.start_time).toLocaleDateString()}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <NavLink to={`/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar/${item.id}`}>
                                                    <IconButton variant="text" color="blue">
                                                        <EyeIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </NavLink>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Card>
                </Card>
            )}
        </div>
    );
}
