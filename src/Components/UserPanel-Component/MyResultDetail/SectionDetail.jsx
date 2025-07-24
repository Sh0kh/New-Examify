import { useEffect, useState } from "react";
import { $api } from "../../../utils";
import { useParams } from "react-router-dom";
import {
    Card,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CONFIG from "../../../utils/Config";
import Loading from "../../UI/Loadings/Loading";

export default function SectionDetail() {
    const { resultId, sectionId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getSectionDetail = async () => {
        try {
            const response = await $api.get(`/user/my-exam/${resultId}/${sectionId}`);
            setData(response?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSectionDetail();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Typography variant="h5">No data found</Typography>
            </div>
        );
    }

    const { user_answers, section } = data;
    const sectionType = section?.type;

    // Определяем, нужно ли показывать таблицу (для Listening и Reading)
    const showTable = sectionType === "Listening" || sectionType === "Reading";

    return (
        <>
            <Header />
            <div className="container mx-auto p-4 mt-[150px]">
                <Card>
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-4">
                            {sectionType} Section Results
                        </Typography>

                        {user_answers.length > 0 ? (
                            showTable ? (
                                // Таблица для Listening и Reading
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-3 px-4 text-left font-semibold text-gray-700">#</th>
                                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Your Answer</th>
                                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Correct Answer</th>
                                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Result</th>
                                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {user_answers.map((answer, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="py-3 px-4">{index + 1}</td>
                                                    <td className="py-3 px-4">
                                                        {answer.answer_text ||
                                                            (answer.selected_answer?.answer_text
                                                                ? `Selected: ${answer.selected_answer.answer_text}`
                                                                : "No answer")}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {answer.correct_answer ||
                                                            (answer.selected_answer?.is_correct
                                                                ? "Correct"
                                                                : "Incorrect")}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {answer.is_correct === "1" ? (
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                                                                ✓
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white">
                                                                ✗
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">{answer.score || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Карточки для Writing и Speaking
                                <div className="space-y-4">
                                    {user_answers.map((answer, index) => (
                                        <Card key={index} className="border rounded-lg hover:shadow-md transition-shadow">
                                            <CardBody>
                                                <div className="flex justify-between items-start">
                                                    <Typography variant="h6">Answer {index + 1}</Typography>
                                                </div>

                                                {answer.file_path ? (
                                                    <div className="mt-2">
                                                        <Typography color="gray">Your Answer (Audio):</Typography>
                                                        <audio
                                                            controls
                                                            className="mt-2 w-full max-w-xs"
                                                            src={`${CONFIG?.API_URL}${answer.file_path.replace(
                                                                /\\/g,
                                                                "/"
                                                            )}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="mt-2">
                                                            <Typography color="gray">Your Answer:</Typography>
                                                            <Typography className="mt-1">
                                                                {answer.answer_text || answer?.selected_answer?.answer_text || "-"}
                                                            </Typography>
                                                        </div>
                                                        <div className="mt-2">
                                                            <Typography color="gray">Correct Answer:</Typography>
                                                            <Typography className="mt-1">
                                                                {answer.correct_answer || "-"}
                                                            </Typography>
                                                        </div>
                                                    </>
                                                )}

                                                <div className="mt-2">
                                                    <Typography color="gray">Score:</Typography>
                                                    <Typography>{answer.score}</Typography>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            )
                        ) : (
                            <Typography color="gray" className="text-center py-4">
                                No answers found for this section
                            </Typography>
                        )}
                    </CardBody>
                </Card>
            </div>
            <Footer />
        </>
    );
}