import {
    Card,
    Typography,
    Select,
    Option,
    Button,
    Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { $api } from "../../../../utils";

function getMonthStartEndDates() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
    };
}

export default function PravidExamFinance() {
    const { startDate, endDate } = getMonthStartEndDates();
    const [data, setData] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [start_date, setStartDate] = useState(startDate);
    const [end_date, setEndDate] = useState(endDate);
    const [perPage, setPerPage] = useState(10);

    const getPravidExam = async (page = 1) => {
        try {
            const response = await $api.get(`/admin/exam-results/type2`, {
                params: {
                    page,
                    start_date,
                    end_date,
                    per_page: perPage,
                },
            });
            setData(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPravidExam(currentPage);
    }, [currentPage, start_date, end_date, perPage]);

    const payments = data.map(item => ({
        id: item.id,
        name: `${item.user?.name ?? ''} ${item.user?.surname ?? ''}`,
        date: new Date(item.start_time).toLocaleDateString("uz-UZ"),
        exam: `Type ${item.exam_type_id}`,
        price: parseInt(item.payment),
        studyCenter: "ITLive Academy",
    }));

    const uniqueCenters = [...new Set(payments.map(p => p.studyCenter))];
    const filteredPayments = selectedCenter
        ? payments.filter(p => p.studyCenter === selectedCenter)
        : payments;

    const totalPrice = filteredPayments.reduce((acc, curr) => acc + curr.price, 0);
    const profit = totalPrice * 0.6;
    const TABLE_HEAD = ["F.I", "Study Center", "Date", "Price", "KeyCount"];

    return (
        <div className="space-y-6">
            {/* Top Summary Cards */}
            <div className="flex flex-col sm:flex-row items-stretch gap-[20px]">
                <Card className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white shadow-xl p-4 rounded-2xl">
                    <Typography variant="h5" className="mb-2">Umumiy summa</Typography>
                    <Typography variant="h3" className="font-bold">
                        {totalPrice.toLocaleString("uz-UZ")} UZS
                    </Typography>
                </Card>
                <Card className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl p-4 rounded-2xl">
                    <Typography variant="h5" className="mb-2">Sof foyda</Typography>
                    <Typography variant="h3" className="font-bold">
                        {profit.toLocaleString("uz-UZ")} UZS
                    </Typography>
                </Card>
            </div>

            {/* Filter Panel */}
            <Card className="p-6 shadow-xl rounded-2xl">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Boshlanish sanasi</label>
                        <Input type="date" value={start_date} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Tugash sanasi</label>
                        <Input type="date" value={end_date} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
            </Card>

            {/* Table */}
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
                                ({ id, date, price, user, studyCenter, ...rest }, index) => {
                                    const isLast = index === filteredPayments.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";
                                    const keyCount = Object.keys({ id, date, price, user, studyCenter, ...rest }).length;
                                    return (
                                        <tr key={id}>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {user}
                                                </Typography>

                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {studyCenter}
                                                </Typography>

                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {price.toLocaleString("uz-UZ")} UZS
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal pl-[20px]">
                                                    {keyCount}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </Card>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <Button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outlined"
                        size="sm"
                    >
                        ⬅️ Previous
                    </Button>
                    <Typography variant="small" color="blue-gray">
                        Page {currentPage} of {lastPage}
                    </Typography>
                    <Button
                        onClick={() => currentPage < lastPage && setCurrentPage(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        variant="outlined"
                        size="sm"
                    >
                        Next ➡️
                    </Button>
                </div>
            </Card>
        </div>
    );
}
