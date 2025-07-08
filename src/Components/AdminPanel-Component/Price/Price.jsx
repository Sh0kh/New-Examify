import { Button, Card, Typography } from "@material-tailwind/react";
import { $api } from "../../../utils";
import { useEffect, useState } from "react";
import Loading from "../../UI/Loadings/Loading";
import PriceEditModal from "./Components/PriceEditModal";

export default function Price() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const getExamPrice = async () => {
        setLoading(true)
        try {
            const response = await $api.get(`/admin/get-exam-price`)
            setData(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getExamPrice()
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Заголовок и кнопка */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                    Narxlar Statistkasi
                </Typography>
                <PriceEditModal data={data} refresh={getExamPrice} />
            </div>

            {/* Карточки */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-50 p-6 shadow-md rounded-xl">
                    <Typography variant="h6" color="green" className="mb-2">
                        Maksimal summa
                    </Typography>
                    <Typography variant="h3" color="green" className="font-bold">
                        {Number(data?.max_price).toLocaleString("uz-UZ")} so'm
                    </Typography>
                </Card>

                <Card className="bg-red-50 p-6 shadow-md rounded-xl">
                    <Typography variant="h6" color="red" className="mb-2">
                        Minimal summa
                    </Typography>
                    <Typography variant="h3" color="red" className="font-bold">
                        {Number(data?.min_price).toLocaleString("uz-UZ")} so'm
                    </Typography>
                </Card>
            </div>
        </div>
    );
}
