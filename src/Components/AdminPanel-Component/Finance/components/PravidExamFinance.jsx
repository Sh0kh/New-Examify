import {
    Card,
    Typography,
    Button,
    Input,
    Select,
    Option,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { $api } from "../../../../utils";
import Loading from "../../../UI/Loadings/Loading";

function getMonthStartEndDates() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
    };
}

export default function PravidExamFinance({ studyCenterData }) {
    const { startDate, endDate } = getMonthStartEndDates();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);
    const [start_date, setStartDate] = useState(startDate);
    const [end_date, setEndDate] = useState(endDate);
    const [selectedStudyCenter, setSelectedStudyCenter] = useState("all");
    const [AllPrice, setAllPrice] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const getPravidExam = async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                start_date,
                end_date,
                per_page: perPage,
            };

            // Добавляем study_center_id только если он выбран
            if (selectedStudyCenter && selectedStudyCenter !== "all") {
                params.study_center_id = selectedStudyCenter;
            }

            const response = await $api.get(`/admin/exam-results/type2`, {
                params
            });

            const results = response.data.results;

            setData(results?.data || []);
            setCurrentPage(results?.current_page || 1);
            setLastPage(results?.last_page || 1);
            setTotal(results?.total || 0);
            setFrom(results?.from || 0);
            setTo(results?.to || 0);
            setAllPrice(response.data.sum_payment || 0);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            // Сброс данных при ошибке
            setData([]);
            setCurrentPage(1);
            setLastPage(1);
            setTotal(0);
            setFrom(0);
            setTo(0);
            setAllPrice(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPravidExam(currentPage);
    }, [currentPage, start_date, end_date, selectedStudyCenter, perPage]);

    // Сброс страницы при изменении фильтров
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            getPravidExam(1);
        }
    }, [start_date, end_date, selectedStudyCenter, perPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const handlePerPageChange = (value) => {
        setPerPage(parseInt(value));
        setCurrentPage(1);
    };

    const handleStudyCenterChange = (value) => {
        console.log('Selected value:', value); // для отладки
        setSelectedStudyCenter(value);
        setCurrentPage(1);
    };

    // Format price with spaces for thousands and fixed decimals
    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    // Генерация массива страниц для пагинации
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (lastPage <= maxVisiblePages) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(lastPage);
            } else if (currentPage >= lastPage - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = lastPage - 3; i <= lastPage; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(lastPage);
            }
        }

        return pages;
    };

    if (loading) {
        return <Loading />;
    }

    const TABLE_HEAD = ["F.I.Sh", "Sana", "Narx", "Status", "Tekshirish turi"];

    return (
        <div className="space-y-6">
            {/* Top Summary Cards */}
            <div className="">
                <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white shadow-xl p-4 rounded-2xl">
                    <Typography variant="h6" className="mb-2">Umumiy summa</Typography>
                    <Typography variant="h4" className="font-bold">
                        {formatPrice(AllPrice)} UZS
                    </Typography>
                </Card>
            </div>

            {/* Filter Panel */}
            <Card className="p-6 shadow-xl rounded-2xl">
                <Typography variant="h6" className="mb-4">Filtrlar</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-2">Boshlanish sanasi</label>
                        <Input
                            type="date"
                            value={start_date}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-2">Tugash sanasi</label>
                        <Input
                            type="date"
                            value={end_date}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-2">O'quv markazi</label>
                        <Select
                            value={selectedStudyCenter}
                            onChange={handleStudyCenterChange}
                            className="w-full"
                        >
                            <Option value="all">Barchasi</Option>
                            {studyCenterData && studyCenterData.map((center) => (
                                <Option key={center.id} value={center.id.toString()}>
                                    {center.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="w-full mx-auto shadow-xl rounded-2xl overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6">Imtihon natijalari</Typography>
                        <Typography variant="small" color="gray" className="font-normal">
                            {from}-{to} dan {total} ta
                        </Typography>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr className="bg-gray-50">
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-b border-gray-200 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-semibold leading-none"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => {
                                    const fullName = `${item.user?.name || ''} ${item.user?.surname || ''}`.trim() || 'N/A';
                                    const date = item.start_time
                                        ? new Date(item.start_time).toLocaleDateString("uz-UZ")
                                        : 'N/A';
                                    const price = item.payment ? parseInt(item.payment) : 0;
                                    const isLast = index === data.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";

                                    // Определяем цвет статуса
                                    const getStatusColor = (status) => {
                                        switch (status) {
                                            case 'finished': return 'text-green-600';
                                            case 'checking': return 'text-yellow-600';
                                            case 'started': return 'text-blue-600';
                                            case 'pending': return 'text-gray-600';
                                            default: return 'text-gray-600';
                                        }
                                    };

                                    const getStatusText = (status) => {
                                        switch (status) {
                                            case 'finished': return 'Tugallangan';
                                            case 'checking': return 'Tekshirilmoqda';
                                            case 'started': return 'Boshlangan';
                                            case 'pending': return 'Kutilmoqda';
                                            default: return status || 'N/A';
                                        }
                                    };

                                    const getCheckTypeText = (checkType) => {
                                        switch (checkType) {
                                            case 'ai': return 'AI';
                                            case 'human': return 'Inson';
                                            default: return checkType || 'N/A';
                                        }
                                    };

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {fullName}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {formatPrice(price)} UZS
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    className={`font-medium ${getStatusColor(item.status)}`}
                                                >
                                                    {getStatusText(item.status)}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {getCheckTypeText(item.check_type)}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="p-8 text-center">
                                        <Typography variant="small" color="gray" className="font-normal">
                                            Hech qanday ma'lumot topilmadi
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Enhanced Pagination */}
                {lastPage > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                variant="outlined"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                ⏮️ Birinchi
                            </Button>
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                variant="outlined"
                                size="sm"
                            >
                                ⬅️ Oldingi
                            </Button>
                        </div>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2">...</span>
                                ) : (
                                    <Button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        variant={currentPage === page ? "filled" : "outlined"}
                                        size="sm"
                                        className="min-w-[40px]"
                                    >
                                        {page}
                                    </Button>
                                )
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === lastPage}
                                variant="outlined"
                                size="sm"
                            >
                                Keyingi ➡️
                            </Button>
                            <Button
                                onClick={() => handlePageChange(lastPage)}
                                disabled={currentPage === lastPage}
                                variant="outlined"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                Oxirgi ⏭️
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}