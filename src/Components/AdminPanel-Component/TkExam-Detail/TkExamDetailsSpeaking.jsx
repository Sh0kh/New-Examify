import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import { $api } from "../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../UI/Loadings/Loading";
import CONFIG from "../../../utils/Config";
import { Alert } from "../../../utils/Alert";

export default function TkExamDetailsSpeaking() {
    const { tkExamId } = useParams();
    const { sectionID } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [sectionData, setSectionData] = useState(null);
    const [scores, setScores] = useState({});
    const navigate = useNavigate()

    const getUserAnswer = async () => {
        setLoading(true);
        try {
            const data = {
                exam_id: tkExamId,
                section_score_id: sectionID
            };
            const response = await $api.post(`/study-center/user-answers`, data);
            setSectionData(response.data);

            // Initialize scores from existing data
            const initialScores = {};
            response.data.part_scores?.forEach(partScore => {
                partScore.user_answers?.forEach(answer => {
                    initialScores[answer.id] = answer.score || 0;
                });
            });
            setScores(initialScores);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (answerId, score) => {
        const numScore = parseInt(score) || 0;
        setScores(prev => ({
            ...prev,
            [answerId]: numScore
        }));
    };

    const submitScores = async () => {
        setSubmitting(true);
        try {
            const parts_scores = sectionData.part_scores.map(partScore => ({
                part_score_id: partScore.id,
                answers: partScore.user_answers.map(answer => ({
                    user_answer_id: answer.id,
                    score: scores[answer.id] || 0
                }))
            }));

            const submitData = {
                exam_id: parseInt(tkExamId),
                section_score_id: parseInt(sectionID),
                parts_scores
            };

            await $api.post(`/study-center/check`, submitData);
            Alert("Muvaffaqiyatli qo'shildi", "success");
            navigate(-1)
        } catch (error) {
            console.log(error);
            Alert(`Xatolik: ${error}`, "error");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        getUserAnswer();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!sectionData) {
        return (
            <div className="min-h-screen p-6">
                <Typography variant="h6" color="red">
                    Ma'lumotlar topilmadi
                </Typography>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <Typography variant="h4" color="blue-gray" className="mb-6">
                Speaking Tekshirish
            </Typography>

            {sectionData.part_scores?.map((partScore, partIndex) => (
                <Card key={partScore.id} className="mb-6 shadow-md">
                    <CardBody>
                        <Typography variant="h5" color="blue" className="mb-4">
                            Part {partIndex + 1}
                        </Typography>

                        <div className="space-y-4">
                            {partScore.user_answers?.map((answer, answerIndex) => (
                                <div key={answer.id} className="border rounded-lg p-4">
                                    <Typography color="gray" className="text-sm mb-2">
                                        Savol {answerIndex + 1}
                                    </Typography>

                                    {answer.question?.question_text && (
                                        <div className="mb-3 bg-blue-50 p-3 rounded-lg">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: answer.question.question_text
                                                }}
                                            />
                                        </div>
                                    )}

                                    {answer.file_path && (
                                        <div className="mb-3">
                                            <audio controls className="w-full">
                                                <source
                                                    src={`${CONFIG.API_URL}audio_speeches/${answer.file_path}`}
                                                    type="audio/webm"
                                                />
                                                Brauzeringiz audio qo'llab-quvvatlamaydi.
                                            </audio>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Typography variant="small" color="blue-gray">
                                            Baho:
                                        </Typography>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={scores[answer.id] || ''}
                                            onChange={(e) => handleScoreChange(answer.id, e.target.value)}
                                            className="w-20"
                                            containerProps={{ className: "min-w-0" }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            ))}

            <div className="mt-6 text-center">
                <Button
                    color="blue"
                    onClick={submitScores}
                    loading={submitting}
                >
                    {submitting ? 'Saqlanmoqda...' : 'Baholarni saqlash'}
                </Button>
            </div>
        </div>
    );
}