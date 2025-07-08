import { Card, Typography, IconButton } from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline"; // Если используешь Heroicons
import { NavLink } from "react-router-dom";

export default function Reyting() {
    const payments = [
        { id: 1, name: "Ali Valiyev", date: "2025-05-20", exam: "Matematika" },
        { id: 2, name: "Nodira Abdullayeva", date: "2025-05-18", exam: "Ingliz tili" },
        { id: 3, name: "Jasurbek Karimov", date: "2025-05-15", exam: "Fizika" },
        { id: 4, name: "Madina Qodirova", date: "2025-05-10", exam: "Tarix" },
    ];

    const TABLE_HEAD = ["Name", "Exam", "Date", "Action"];

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
                            {payments.map(({ id, name, date, exam }, index) => {
                                const isLast = index === payments.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={id}>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {index + 1}. {name}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {exam}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {date}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <NavLink to={`/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar/${id}`}>
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
