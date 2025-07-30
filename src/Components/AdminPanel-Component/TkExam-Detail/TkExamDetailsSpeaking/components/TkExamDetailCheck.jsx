import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../UI/Loadings/Loading";
import { Alert } from "../../../../../utils/Alert";
import { Button, Card, CardBody, Typography, Input } from "@material-tailwind/react";
import CONFIG from "../../../../../utils/Config";
import { $api } from "../../../../../utils";

export default function DetailedCheck({ tkExamId, sectionID }) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [sectionData, setSectionData] = useState(null);
    const [partScores, setPartScores] = useState({});
    const navigate = useNavigate();

    const getUserAnswer = async () => {
        setLoading(true);
        try {
            const data = {
                exam_id: tkExamId,
                section_score_id: sectionID
            };
            const response = await $api.post(`/study-center/user-answers`, data);
            setSectionData(response.data);

            const initialPartScores = {};
            response.data.part_scores?.forEach(partScore => {
                initialPartScores[partScore.id] = {
                    fluency: 0,
                    lexical: 0,
                    grammar: 0,
                    pronunciation: 0
                };
            });

            setPartScores(initialPartScores);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePartScoreChange = (partId, field, value) => {
        const numScore = parseInt(value) || 0;
        setPartScores(prev => ({
            ...prev,
            [partId]: {
                ...prev[partId],
                [field]: numScore
            }
        }));
    };

    const submitScores = async () => {
        setSubmitting(true);
        try {
            const parts_scores = sectionData.part_scores.map(partScore => ({
                part_score_id: partScore.id,
                part_score: {
                    fluency: partScores[partScore.id]?.fluency || 0,
                    lexical: partScores[partScore.id]?.lexical || 0,
                    grammar: partScores[partScore.id]?.grammar || 0,
                    pronunciation: partScores[partScore.id]?.pronunciation || 0
                },
                answers: [] // убрали баллы за отдельные вопросы
            }));

            const submitData = {
                exam_id: parseInt(tkExamId),
                section_score_id: parseInt(sectionID),
                parts_scores
            };

            await $api.post(`/study-center/check`, submitData);
            Alert("Muvaffaqiyatli qo'shildi", "success");
            navigate(-1);
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

    if (loading) return <Loading />;

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
        <div className="min-h-screen p-4">
            {sectionData.part_scores?.map((partScore, partIndex) => (
                <Card key={partScore.id} className="mb-6 shadow-md">
                    <CardBody>
                        <Typography variant="h5" color="blue" className="mb-4">
                            Part {partIndex + 1}
                        </Typography>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Typography variant="small">Fluency and Coherence</Typography>
                                <Input
                                    type="number"
                                    min="0"
                                    value={partScores[partScore.id]?.fluency || ''}
                                    onChange={(e) =>
                                        handlePartScoreChange(partScore.id, "fluency", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Typography variant="small">Lexical Resource</Typography>
                                <Input
                                    type="number"
                                    min="0"
                                    value={partScores[partScore.id]?.lexical || ''}
                                    onChange={(e) =>
                                        handlePartScoreChange(partScore.id, "lexical", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Typography variant="small">Grammar</Typography>
                                <Input
                                    type="number"
                                    min="0"
                                    value={partScores[partScore.id]?.grammar || ''}
                                    onChange={(e) =>
                                        handlePartScoreChange(partScore.id, "grammar", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Typography variant="small">Pronunciation</Typography>
                                <Input
                                    type="number"
                                    min="0"
                                    value={partScores[partScore.id]?.pronunciation || ''}
                                    onChange={(e) =>
                                        handlePartScoreChange(partScore.id, "pronunciation", e.target.value)
                                    }
                                />
                            </div>
                        </div>

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
                                </div>
                            ))}
                        </div>
                    </CardBody>
                    
                </Card>
            ))}

            <div className="mt-6 text-center">
                <Button color="blue" onClick={submitScores} loading={submitting}>
                    {submitting ? 'Saqlanmoqda...' : 'Baholarni saqlash'}
                </Button>
            </div>
        </div>
    );
}
