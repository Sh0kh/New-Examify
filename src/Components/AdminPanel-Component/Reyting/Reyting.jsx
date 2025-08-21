import {
    Card,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { $api } from "../../../utils";
import { NavLink } from "react-router-dom";
import Loading from "../../UI/Loadings/Loading";

export default function Reyting() {
    const TABLE_HEAD = ["#", "Ism Familiya", "Telefon", "Imtihon nomi", "Natija", "Boshlanish vaqti", "Action"];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    // 📅 функция для форматирования даты в YYYY-MM-DD (без UTC сдвига)
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // 📅 дефолт — текущий месяц (ИСПРАВЛЕНО)
    const now = new Date();

    // Получаем первый день текущего месяца
    const firstDayDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDay = formatDate(firstDayDate);

    // Получаем последний день текущего месяца
    // Создаем дату следующего месяца с днем 0 (это даст последний день текущего месяца)
    const lastDayDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastDay = formatDate(lastDayDate);

    console.log('Сегодня:', formatDate(now));
    console.log('Первый день месяца:', firstDay);
    console.log('Последний день месяца:', lastDay);

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("uz-UZ", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getAllResult = async (pageNum = 1) => {
        setLoading(true);
        try {
            const response = await $api.get(`/study-center/get-my-users-rating`, {
                params: {
                    page: pageNum,
                    start_date: startDate,
                    end_date: endDate,
                }
            });
            setData(response?.data?.data || []);
            setPagination(response?.data || {});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // ⚡️ при загрузке сразу запрос с текущим месяцем
    useEffect(() => {
        getAllResult(page);
    }, [page]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-[20px] space-y-6">
            <Typography variant="h5" color="blue-gray" className="font-bold">
                Reyting: Imtihonni topshirganlar
            </Typography>

            {/* FILTERS */}
            <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 w-full sm:w-auto">
                    <Input
                        type="date"
                        label="Boshlanish sanasi"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                        type="date"
                        label="Tugash sanasi"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <Button color="blue" onClick={() => getAllResult(1)}>
                    Filtrlash
                </Button>
            </Card>

            {/* TABLE */}
            <Card className="w-full mx-auto p-6">
                <div className="overflow-auto">
                    <table className="w-full min-w-max table-auto text-left border-collapse">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head, i) => (
                                    <th
                                        key={i}
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-sm font-semibold text-blue-gray-700"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-blue-gray-50 transition">
                                        <td className="p-4">{(pagination.from || 0) + index}</td>
                                        <td className="p-4">{item?.user?.name} {item?.user?.surname}</td>
                                        <td className="p-4">{item?.user?.phoneNumber}</td>
                                        <td className="p-4">{item?.exam?.name}</td>
                                        <td className="p-4">{item?.score}</td>
                                        <td className="p-4">{formatDateTime(item?.start_time)}</td>
                                        <td className="p-4">
                                            <NavLink
                                                to={`/o'quv_markaz/imtihon/foydalanuvchi/${item?.id}`}
                                                className="flex items-center justify-center text-[25px]"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"></path></svg>
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="p-4 text-center text-gray-500">
                                        Ma'lumot yo'q
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    {pagination.links?.map((link, idx) => (
                        <Button
                            key={idx}
                            size="sm"
                            variant={link.active ? "filled" : "outlined"}
                            onClick={() => {
                                if (link.url) {
                                    const newPage = new URL(link.url).searchParams.get("page");
                                    setPage(Number(newPage));
                                }
                            }}
                            disabled={!link.url}
                        >
                            {link.label.replace("&laquo; Previous", "«").replace("Next &raquo;", "»")}
                        </Button>
                    ))}
                </div>
            </Card>
        </div>
    );
}