import { Card, Typography } from "@material-tailwind/react";

export default function Payment() {
    const payments = [
        { id: 1, name: "Ali Valiyev", date: "2025-05-20", exam: "Matematika", price: "50,000 so'm" },
        { id: 2, name: "Nodira Abdullayeva", date: "2025-05-18", exam: "Ingliz tili", price: "55,000 so'm" },
        { id: 3, name: "Jasurbek Karimov", date: "2025-05-15", exam: "Fizika", price: "60,000 so'm" },
        { id: 4, name: "Madina Qodirova", date: "2025-05-10", exam: "Tarix", price: "45,000 so'm" },
    ];

    const TABLE_HEAD = ["Name", "Date", "Exam", "Price"];

    return (
        <Card className="w-full  mx-auto mt-10 p-6">
            <Typography variant="h5" color="blue-gray" className="mb-6 font-bold">
                Ro'yxat: Imtihonni topshirganlar
            </Typography>

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
                        {payments.map(({ id, name, date, exam, price }, index) => {
                            const isLast = index === payments.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={id}>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {name}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {date}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {exam}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {price}
                                        </Typography>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </Card>
    );
}