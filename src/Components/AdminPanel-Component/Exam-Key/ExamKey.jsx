import { useEffect, useState } from "react";
import { $api } from "../../../utils";
import Loading from "../../UI/Loadings/Loading";
import CONFIG from "../../../utils/Config";
import { NavLink } from "react-router-dom";

export default function ExamKey() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    const getPrivateExam = async () => {
        try {
            const response = await $api.get(`/study-center/get-private-exams/${localStorage.getItem("StId")}`);
            setData(response?.data || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPrivateExam()
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }


    return (
        <div className="min-h-screen p-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Imtihonlar</h1>
            </div>

            {/* Agar data bo'sh bo‘lsa */}
            {data.length === 0 ? (
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center text-gray-500">
                        <p className="text-lg font-medium">Imtihonlar mavjud emas</p>
                        <p className="text-sm mt-1">Siz hali hech qanday imtihon qo‘shmagansiz</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-[20px]">
                    {data.map((center) => (
                        <NavLink key={center.id} to={`/o'quv_markaz/imtihon/kalit/${center?.id}`}>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-200">
                                {center.logo ? (
                                    <img
                                        src={CONFIG.API_URL + center?.logo}
                                        alt={center.name}
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-blue-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">Logo mavjud emas</span>
                                    </div>
                                )}

                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800">{center.name}</h2>

                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Til:</strong> {center.language || "Mavjud emas"}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Status:</strong> {center.status || "Mavjud emas"}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Kalit narxi:</strong>{" "}
                                        {center.price !== null && center.price !== undefined
                                            ? `${Number(center.price).toLocaleString("uz-UZ")} so'm`
                                            : "Mavjud emas"}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Kalit soni:</strong>{" "}
                                        {center.all_keys_count !== null && center.all_keys_count !== undefined
                                            ? `${Number(center.all_keys_count).toLocaleString("uz-UZ")}`
                                            : "Mavjud emas"}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-3">
                                        Yaratildi:{" "}
                                        {center.created_at
                                            ? new Date(center.created_at).toLocaleDateString("uz-UZ", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : "Sana mavjud emas"}
                                    </p>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );

}
