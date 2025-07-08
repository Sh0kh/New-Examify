import { Button, Card, Typography } from "@material-tailwind/react";

export default function StKey() {
    const payments = [
        { id: 1, name: "Ali Valiyev", date: "2025-05-20", exam: "100", price: "50,000 so'm" },
        { id: 2, name: "Nodira Abdullayeva", date: "2025-05-18", exam: "102", price: "55,000 so'm" },
        { id: 3, name: "Jasurbek Karimov", date: "2025-05-15", exam: "1051", price: "60,000 so'm" },
        { id: 4, name: "Madina Qodirova", date: "2025-05-10", exam: "100", price: "45,000 so'm" },
    ];

    const TABLE_HEAD = ["Sana", "Kalit", "Narxi"];

    return (
        <div className="p-6 space-y-6">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg p-6 rounded-2xl">
                <Typography variant="h5" className="mb-1">
                    Umumiy Kalitlar soni
                </Typography>
                <Typography variant="h2" className="font-bold">
                    1 000
                </Typography>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                    Kalitlar tarixi
                </Typography>
                <Button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition"
                >
                    Yaratish
                </Button>
            </div>

            <Card className="shadow-md rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-blue-gray-50">
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="px-6 py-4 text-sm font-semibold text-blue-gray-700 border-b">
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(({ id, name, date, exam, price }, index) => (
                                <tr
                                    key={id}
                                    className="hover:bg-blue-gray-50 transition duration-200"
                                >
                                    <td className="px-6 py-4 text-sm text-blue-gray-800">{date}</td>
                                    <td className="px-6 py-4 text-sm text-blue-gray-800">{exam}</td>
                                    <td className="px-6 py-4 text-sm text-blue-gray-800">{price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
