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
        return (
            <Loading />
        );
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Typography variant="h5">No data found</Typography>
            </div>
        );
    }

    const { exam_result, user_answers } = data;


    return (
        <>
            <Header />
            <div className="container mx-auto p-4 h-screen mt-[150px]">
                <Card>
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-4">
                            Your Answers
                        </Typography>

                        {user_answers.length > 0 ? (
                            <div className="space-y-4">
                                {user_answers.map((answer, index) => (
                                    <div
                                        key={answer.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <Typography variant="h6">
                                                Question {index + 1}
                                            </Typography>

                                            {/* Показываем Chip только если это НЕ Speaking и НЕ Writing */}
                                            {answer.type !== "Speaking" && answer.type !== "Writing" && (
                                                <Chip
                                                    color={answer.is_correct === "1" ? "green" : "red"}
                                                    value={answer.is_correct === "1" ? "Correct" : "Incorrect"}
                                                    size="sm"
                                                />
                                            )}
                                        </div>

                                        {answer.file_path ? (
                                            <div className="mt-2">
                                                <Typography color="gray">Your Answer (Audio):</Typography>
                                                <audio
                                                    controls
                                                    className="mt-2 w-full"
                                                    src={`${CONFIG?.API_URL}/${answer.file_path.replace(/\\/g, "/")}`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="mt-2">
                                                <Typography color="gray">Your Answer:</Typography>
                                                <Typography className="mt-1">
                                                    {answer.answer_text || "No answer provided"}
                                                </Typography>
                                            </div>
                                        )}

                                        <div className="mt-2">
                                            <Typography color="gray">Score:</Typography>
                                            <Typography>{answer.score}</Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
