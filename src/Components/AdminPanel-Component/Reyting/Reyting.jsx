import {
    Card,
    Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { $api } from "../../../utils";
import { NavLink } from "react-router-dom";
import Loading from "../../UI/Loadings/Loading";

export default function Reyting() {
    const TABLE_HEAD = ["#", "Ism Familiya", "Telefon", "Imtihon nomi", "Natija", "Boshlanish vaqti", "Action"];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)

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

    const getAllResult = async () => {
        setLoading(true)
        try {
            const response = await $api.get(`/study-center/get-my-users-rating`);
            setData(response?.data?.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getAllResult();
    }, []);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="p-[20px] space-y-6">
            <Typography variant="h5" color="blue-gray" className="font-bold">
                Reyting: Imtihonni topshirganlar
            </Typography>
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
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4">{item?.user?.name} {item?.user?.surname}</td>
                                        <td className="p-4">{item?.user?.phoneNumber}</td>
                                        <td className="p-4">{item?.exam?.name}</td>
                                        <td className="p-4">{item?.score}</td>
                                        <td className="p-4">{formatDateTime(item?.start_time)}</td>
                                        <td className="p-4">
                                            <NavLink to={`/o'quv_markaz/imtihon/foydalanuvchi/${item?.id}`} className={`flex items-center justify-center text-[25px]`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"></path></svg>
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="p-4 text-center text-gray-500">
                                        Ma'lumot yo‘q
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
