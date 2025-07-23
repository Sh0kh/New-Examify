import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { $api } from "../../../utils";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Typography,
    Chip,
} from "@material-tailwind/react";
import Loading from "../../UI/Loadings/Loading";

export default function ExamKeyGenerate() {
    const { examID } = useParams();
    const [keys, setKeys] = useState([]);
    const [total, setTotal] = useState(0);
    const [examLoading, setExamLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [exam, setExam] = useState(null);

    const generateExamKey = async () => {
        setLoading(true);
        try {
            const response = await $api.post(`/study-center/create-exam-keys`, {
                exam_id: examID,
                keys_count: 10,
            });

            setKeys(response.data.keys || []);
            setTotal(response.data.total_keys_count || 0);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const GetExamById = async () => {
        setExamLoading(true);
        try {
            const response = await $api.get(`/study-center/exams/${examID}`);
            setExam(response?.data || null);
        } catch (error) {
            console.log(error);
        } finally {
            setExamLoading(false);
        }
    };

    useEffect(() => {
        GetExamById();
    }, []);

    if (examLoading || !exam) return <Loading />;

    return (
        <div className="min-h-screen p-6">
            {/* Imtihon nomi */}
            <div className="w-full flex items-center justify-between mb-6">
                <Typography variant="h3" className="">
                    {exam?.name || "Imtihon nomi mavjud emas"}
                </Typography>
                <Button
                    onClick={generateExamKey}
                    loading={loading}
                    className="bg-blue-600"
                >
                    {loading ? "Yaratilmoqda..." : "Kalitlar yaratish"}
                </Button>
            </div>

            {/* Kalit yaratish va natijalar */}
            <Card className="w-full  mx-auto">
                <CardBody className="space-y-6">
                    {keys.length > 0 ? (
                        <>
                            <Typography variant="h6" className="text-gray-800 text-center">
                                Jami: {total} ta kalit yaratildi
                            </Typography>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {keys.map((key, index) => (
                                    <Chip
                                        key={index}
                                        value={key}
                                        onClick={() => {
                                            navigator.clipboard.writeText(key);
                                        }}
                                        className="text-sm px-3 py-2 bg-blue-100 text-blue-900 border border-blue-300 cursor-pointer hover:bg-blue-200 transition normal-case"
                                    />
                                ))}
                            </div>

                        </>
                    ) : (
                        <Typography variant="h6" className="text-gray-500 text-center">
                            Kalitlar hali yaratilmagan
                        </Typography>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
