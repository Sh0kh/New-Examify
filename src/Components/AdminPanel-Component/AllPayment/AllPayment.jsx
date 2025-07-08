import {
    Card,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { useState } from "react";

export default function AllPayment() {
    const payments = [
        {
            id: 1,
            name: "Ali Valiyev",
            date: "2025-05-20",
            exam: "Matematika",
            price: "200000",
            studyCenter: "Alpha Center",
        },
        {
            id: 2,
            name: "Nodira Abdullayeva",
            date: "2025-05-18",
            exam: "Ingliz tili",
            price: "180000",
            studyCenter: "Beta Academy",
        },
        {
            id: 3,
            name: "Jasurbek Karimov",
            date: "2025-05-15",
            exam: "Fizika",
            price: "220000",
            studyCenter: "Alpha Center",
        },
        {
            id: 4,
            name: "Madina Qodirova",
            date: "2025-05-10",
            exam: "Tarix",
            price: "190000",
            studyCenter: "Gamma School",
        },
    ];

    const TABLE_HEAD = ["Name", "Date", "Exam", "Price", "Study Center"];
    const [selectedCenter, setSelectedCenter] = useState("");

    const uniqueCenters = [...new Set(payments.map((p) => p.studyCenter))];
    const filteredPayments = selectedCenter
        ? payments.filter((p) => p.studyCenter === selectedCenter)
        : payments;

    const totalPrice = filteredPayments.reduce((acc, curr) => acc + parseInt(curr.price), 0);
    const profit = totalPrice * 0.6;

    return (
        <div className="p-[20px] space-y-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
                Barcha tolovlar
            </Typography>

            <div className="flex flex-col sm:flex-row items-stretch gap-[20px]">
                <Card className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white shadow-xl p-4 rounded-2xl">
                    <Typography variant="h5" className="mb-2">
                        Umumiy summa
                    </Typography>
                    <Typography variant="h3" className="font-bold">
                        {totalPrice.toLocaleString("uz-UZ")} UZS
                    </Typography>
                </Card>
                <Card className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl p-4 rounded-2xl">
                    <Typography variant="h5" className="mb-2">
                        Sof foyda 
                    </Typography>
                    <Typography variant="h3" className="font-bold">
                        {profit.toLocaleString("uz-UZ")} UZS
                    </Typography>
                </Card>
            </div>

            <div className="max-w-xs">
                <Select
                    label="O‘quv markazi bo‘yicha filter"
                    value={selectedCenter}
                    onChange={(val) => setSelectedCenter(val)}
                >
                    <Option value="">Barchasi</Option>
                    {uniqueCenters.map((center) => (
                        <Option key={center} value={center}>
                            {center}
                        </Option>
                    ))}
                </Select>
            </div>

            <Card className="w-full mx-auto p-6 shadow-xl rounded-2xl">
                <Card className="h-full w-full overflow-x-auto">
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
                                            className="font-semibold leading-none opacity-80"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(
                                ({ id, name, date, exam, price, studyCenter }, index) => {
                                    const isLast = index === filteredPayments.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={id}>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {index + 1}.{name}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {exam}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {parseInt(price).toLocaleString("uz-UZ")} UZS
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {studyCenter}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </Card>
            </Card>
        </div>
    );
}
