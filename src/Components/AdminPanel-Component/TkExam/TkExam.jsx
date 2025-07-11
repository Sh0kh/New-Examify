import { Card, Typography, IconButton } from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { $api } from "../../../utils";
import { useEffect, useState } from "react";

export default function Reyting() {
    const TABLE_HEAD = ["Name", "Exam", "Type", "Date", "Action"];
    const [data, setData] = useState([]);

    const getUncheckedExam = async () => {
        try {
            const response = await $api.get(`/study-center/get-unchecked-exams/${localStorage.getItem("StId")}`);
            setData(response?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUncheckedExam();
    }, []);

    return (
        <div className="p-[20px]">
            <Typography variant="h5" color="blue-gray" className="mb-6 font-bold">
                Tekshirilmagan imtihonlar
            </Typography>
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
                                                {index + 1}. {item.user_id}
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
        </div>
    );
}
