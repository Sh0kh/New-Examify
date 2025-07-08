import { NavLink, useParams } from "react-router-dom";
import Loading from "../../../../../../UI/Loadings/Loading";
import { useEffect, useState } from "react";
import { Button, Card } from "@material-tailwind/react";
import { $api } from "../../../../../../../utils";
import QuestionCreate from "./components/QuestionCreate";
import QuestionDelete from "./components/QuestionEdit";
import QuestionEdit from "./components/QuestionEdit";
import { Edit, Eye } from "lucide-react";
import DeleteQuestion from "./components/DeleteQuestion";

export default function ExamPartDetail() {
    const { partID } = useParams();
    const [partData, setPartData] = useState({});
    const [loading, setLoading] = useState(true);

    const getPartById = async () => {
        setLoading(true);
        try {
            const response = await $api.get(`/study-center/parts/${partID}`);
            setPartData(response?.data?.part || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getPartById();
    }, [partID]);

    if (loading) {
        return <Loading />;
    }


    return (
        <div className="p-4">
            <Card className="p-[20px] mb-[30px] shadow-lg ">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[22px]">{partData.name}</h2>
                    <NavLink to={`/o'quv_markaz/imtihon/qism/savol-yatatish/${partID}`}>
                        <Button color="blue">
                            Savol yaratish
                        </Button>
                    </NavLink>
                </div>
            </Card>

            {/* Вопросы */}
            <div className="flex flex-col gap-4">
                {Array.isArray(partData?.questions) && partData?.questions?.length > 0 ? (
                    partData?.questions?.map((question, index) => (
                        <Card
                            key={question.id}
                            className="w-full p-6 shadow-md border border-blue-100 hover:shadow-xl transition-all duration-200"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg text-blue-700">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                        {question.question_type?.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <NavLink to={`/o'quv_markaz/imtihon/qism/savol/${question?.id}`}>
                                        <Button color="blue" className="flex items-center justify-center py-[5px] px-[20px]">
                                            <Eye size={20} />
                                        </Button>
                                    </NavLink>
                                    <NavLink to={`/o'quv_markaz/imtihon/qism/savol-tahrirlash/${partID}/${question?.id}`}>
                                        <Button className="flex items-center justify-center py-[5px] px-[20px]" color="blue" onClick={() => setOpen(true)}>
                                            <Edit size={20} />
                                        </Button>
                                    </NavLink>
                                    <DeleteQuestion questionId={question?.id} refresh={getPartById} />
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-gray-500 text-center">Savollar topilmadi</div>
                )}
            </div>
        </div>
    );
}