import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { $api } from "../../../../../utils";
import { useParams } from "react-router-dom";
import CONFIG from "../../../../../utils/Config";
import Loading from "../../../../UI/Loadings/Loading";
import CenterExamStatusEditModal from "./components/CenterExamStatusEditModal";
import CenterExamInfoModal from "./components/CenterExamInfoModal";

export default function CenterExam() {
    const { studyCenterId } = useParams();
    const [loading, setLoading] = useState(true);
    const [Data, setData] = useState([]);

    const exams = [
        {
            id: 1,
            title: "Matematika",
            type: "Fan",
            price: "50,000 so'm",
            image: "https://source.unsplash.com/400x300/?math",
        },
        {
            id: 2,
            title: "Fizika",
            type: "Fan",
            price: "60,000 so'm",
            image: "https://source.unsplash.com/400x300/?physics",
        },
        {
            id: 3,
            title: "Ingliz tili",
            type: "Til",
            price: "55,000 so'm",
            image: "https://source.unsplash.com/400x300/?english",
        },
        {
            id: 4,
            title: "Tarix",
            type: "Fan",
            price: "45,000 so'm",
            image: "https://source.unsplash.com/400x300/?history",
        },
        {
            id: 5,
            title: "Rus tili",
            type: "Til",
            price: "52,000 so'm",
            image: "https://source.unsplash.com/400x300/?russian",
        },
    ];


    const getAllExams = async () => {
        try {
            const response = await $api(`/admin/study-center-exams/${studyCenterId}`)
            setData(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllExams()
    }, [])


    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4">
            {Data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center mt-20">
                    <div className="text-6xl mb-4">📄</div>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Imtihonlar mavjud emas
                    </Typography>
                    <Typography color="gray" className="max-w-md">
                        Ushbu o‘quv markazida hozircha birorta ham imtihon mavjud emas. Keyinroq yana urinib ko‘ring.
                    </Typography>
                </div>  
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Data.map((exam) => (
                        <Card key={exam.id} className="shadow-md">
                            <CardHeader floated={false} className="h-40">
                                <img
                                    src={CONFIG.API_URL + exam.logo}
                                    alt={exam.title}
                                    className="h-full w-full object-cover"
                                />
                            </CardHeader>
                            <CardBody>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {exam.title}
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                    Nomi: <span className="font-medium">{exam.name}</span>
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                    Til: <span className="font-medium">{exam.language}</span>
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                    Imtihon turi:{" "}
                                    <span className="font-medium">
                                        {exam.type_id == 1
                                            ? "Tekin"
                                            : exam.type_id == 2
                                                ? "Pullik"
                                                : exam.type_id == 3
                                                    ? "Yopiq (kalitli)"
                                                    : "Noma'lum"}
                                    </span>
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                    Narx:{" "}
                                    <span className="font-medium">
                                        {exam.type_id == 3
                                            ? Number(exam.price).toLocaleString("ru-RU")
                                            : Number(exam.price).toLocaleString("ru-RU")}{" "}
                                        so‘m
                                    </span>
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                    Status:{" "}
                                    <span className="font-medium">
                                        {exam.status === "active" ? "Faol" : "Nofaol"}
                                    </span>
                                </Typography>
                                <div className="flex items-center gap-2 mt-4">
                                    <CenterExamStatusEditModal
                                        ExamData={exam}
                                        refresh={getAllExams}
                                        type={exam.type_id}
                                        examId={exam.id}
                                    />
                                    {exam.type_id == 3 && (
                                        <CenterExamInfoModal
                                            refresh={getAllExams}
                                            data={exam}
                                        />
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

}
