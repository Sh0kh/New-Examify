import {
    Card,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import axios from "axios";
import Loading from "../../UI/Loadings/Loading";
import CONFIG from "../../../utils/Config";
import { NavLink } from "react-router-dom";

export default function StudyCenter() {
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);

    const getAllExam = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/user/get-centers`);
            setExams(response.data);
        } catch (error) {
            console.error("Ошибка при получении экзаменов:", error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        getAllExam();
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-screen px-4 py-10 mt-[80px]">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold ">Study Center</h1>
                    {loading ? (
                        <div className="flex justify-center mt-10">
                            <Loading />
                        </div>
                    ) : exams.length === 0 ? (
                        <div className="flex items-center justify-center h-[400px] mt-10">
                            <Typography variant="h5" color="blue-gray" className="text-center">
                                Not Data
                            </Typography>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
                            {exams.map((exam) => (
                                <NavLink
                                    to={`/study-center/${exam.id}`}
                                    key={exam.id}
                                    className="transform transition duration-300 hover:scale-[1.02]"
                                >
                                    <Card className="shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                                        <CardHeader floated={false} className="h-40">
                                            <img
                                                src={CONFIG.API_URL + exam?.logo}
                                                alt={exam.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </CardHeader>
                                        <CardBody>
                                            <Typography variant="h6" color="blue-gray" className="mb-1">
                                                {exam.name}
                                            </Typography>

                                            <Typography color="gray" className="text-sm mb-2">
                                                {exam?.description || "Tavsif mavjud emas"}
                                            </Typography>

                                            <Typography color="blue-gray" className="text-xs font-medium">
                                                {exam?.date
                                                    ? new Date(exam.date).toLocaleDateString("uz-UZ", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })
                                                    : "Sana mavjud emas"}
                                            </Typography>
                                        </CardBody>
                                    </Card>
                                </NavLink>
                            ))}
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </>
    );
}
