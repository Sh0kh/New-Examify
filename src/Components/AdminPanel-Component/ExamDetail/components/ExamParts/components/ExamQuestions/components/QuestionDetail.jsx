import { Button, Card } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { $api } from "../../../../../../../../utils";
import Loading from "../../../../../../../UI/Loadings/Loading";
import AnswerCreate from "./AnswerCreate";
import CONFIG from "../../../../../../../../utils/Config";
import AnswerDelete from "./AnswerDelete";

export default function QuestionDetail() {
    const { questionID } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getQuestionById = async () => {
        setLoading(true);
        try {
            const response = await $api.get(`/study-center/questions/${questionID}`);
            setData(response?.data);
        } catch (error) {
            console.error("Error fetching question data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuestionById();
    }, []);

    if (loading) {
        return <Loading />;
    }

    // Заменить {textinput} на 1) _____, 2) _____ и т.д.
    const processQuestionText = (text) => {
        return text.replace(/\{textinput\}/g, () => `_____`);
    };

    const processedQuestionText = processQuestionText(data?.question_text || "");

    return (
        <div className="Exam__test p-4 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Savol tafsilotlari</h1>
                <AnswerCreate refresh={getQuestionById} />
            </div>

            <Card className="p-5 shadow-lg w-full">
                <p
                    className="font-bold text-[22px] mb-4"
                    dangerouslySetInnerHTML={{ __html: processedQuestionText }}
                />
                {data?.image_url && (
                    <img
                        src={CONFIG.API_URL + data.image_url}
                        alt="Question Illustration"
                        className="rounded-md mb-4 max-w-[300px]"
                    />
                )}
            </Card>

            {/* Ответы */}
            <div className="space-y-4">
                {data?.answers?.map((answer, index) => (
                    <Card key={answer.id} className="p-4 w-full shadow-md">
                        <div className="flex justify-between items-center">
                            <span className={`text-lg font-medium ${answer.is_correct ? 'text-green-600' : 'text-gray-800'}`}>
                                {index + 1}. {answer.answer_text}
                            </span>
                            <AnswerDelete answerId={answer.id} refresh={getQuestionById} />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
