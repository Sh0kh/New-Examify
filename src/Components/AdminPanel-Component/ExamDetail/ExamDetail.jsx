import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Icon,
} from "@material-tailwind/react";
import ExamSections from "./components/ExamSections/ExamSections";
import { $api } from "../../../utils";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../UI/Loadings/Loading";
import CONFIG from "../../../utils/Config";



export default function ExamDetail() {

    const { examID } = useParams()
    const [examData, setExamData] = useState(false)
    const [loading, setLoading] = useState(true)

    const getExam = async () => {
        try {
            const response = await $api.get(`/study-center/exams/${examID}`)
            setExamData(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        getExam()
    }, [examID])

    if (loading) {
        return (
            <Loading />
        );
    }

    const statusColor = examData.status === "active" ? "green" : "red";
    return (
        <div className=" mx-auto p-6 space-y-8">
            <Card className="shadow-lg border border-gray-300">
                <CardHeader
                    floated={false}
                    className="bg-blue-100 flex items-center justify-center p-6"
                >
                    {examData?.logo ? (
                        <img
                            src={CONFIG.API_URL + examData?.logo}
                            alt={examData?.name}
                            className="h-32 w-full rounded-[10px] object-cover"
                        />
                    ) : (
                        <div className="h-32 w-32 bg-blue-300 flex items-center justify-center rounded-full text-white text-4xl font-bold uppercase">
                            {examData?.name?.charAt(0)}
                        </div>
                    )}
                </CardHeader>
                <CardBody className="space-y-3">
                    <Typography variant="h4" className="font-semibold text-gray-800">
                        {examData.name}
                    </Typography>

                    <Typography className="text-gray-700">
                        Til: <span className="font-medium uppercase">{examData?.language}</span>
                    </Typography>

                    <Typography className="text-gray-700">
                        Status:{" "}
                        <span
                            className={`font-semibold text-${statusColor}-600 capitalize`}
                        >
                            {examData?.status}
                        </span>
                    </Typography>

                    <Typography className="text-gray-700">
                        Narxi: <span className="font-semibold">{Number(examData?.price).toLocaleString()} UZS</span>
                    </Typography>

                    <Typography className="text-gray-500 text-sm">
                        Yaratilgan sana: {new Date(examData?.created_at).toLocaleDateString()}
                    </Typography>
                </CardBody>
            </Card>
            <ExamSections sectionData={examData?.sections} refresh={getExam} />
        </div>
    );
}
