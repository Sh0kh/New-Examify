import {
    Card,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { useState } from "react";

export default function Reyting() {
    const payments = [
        { id: 1, name: "Ali Valiyev", date: "2025-05-20", exam: "Matematika", score: "95" },
        { id: 2, name: "Nodira Abdullayeva", date: "2025-05-18", exam: "Ingliz tili", score: "88" },
        { id: 3, name: "Jasurbek Karimov", date: "2025-05-15", exam: "Fizika", score: "91" },
        { id: 4, name: "Madina Qodirova", date: "2025-05-10", exam: "Tarix", score: "87" },
    ];
    const TABLE_HEAD = ["Name", "Date", "Exam", "Ball"];
    const [selectedExam, setSelectedExam] = useState("");

    const uniqueExams = [...new Set(payments.map((p) => p.exam))];
    const filteredPayments = selectedExam
        ? payments.filter((p) => p.exam === selectedExam)
        : payments;

    return (
        <div className="p-[20px] space-y-6">
            <Typography variant="h5" color="blue-gray" className="font-bold">
                Reyting: Imtihonni topshirganlar
            </Typography>

            <div className="max-w-xs">
                <Select label="Fan bo‘yicha filter" value={selectedExam} onChange={setSelectedExam}>
                    <Option value="">Barchasi</Option>
                    {uniqueExams.map((exam) => (
                        <Option key={exam} value={exam}>
                            {exam}
                        </Option>
                    ))}
                </Select>
            </div>

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
                            {filteredPayments.map(({ id, name, date, exam, score }, index) => {
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
                                                {score}
                                            </Typography>
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
