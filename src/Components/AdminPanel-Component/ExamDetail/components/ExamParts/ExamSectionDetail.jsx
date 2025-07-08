import { NavLink, useParams } from "react-router-dom"
import { $api } from "../../../../../utils"
import { useEffect, useState } from "react"
import { Card, Chip, Button } from "@material-tailwind/react"
import Loading from "../../../../UI/Loadings/Loading"
import ExamPartCreate from "./components/ExamPartCreate"
import { PlayCircleIcon, ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import ExamPartEdit from "./components/ExamPartEdit"
import { useNavigate } from "react-router-dom";
import ExamPartDelete from "./components/ExamPartDelete"
import { Eye } from "lucide-react"

export default function ExamSectionDetail() {
    const { sectionID } = useParams()
    const [sectionData, setSectionData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();


    const getSectionById = async () => {
        setLoading(true)
        try {
            const response = await $api.get(`/study-center/sections/${sectionID}`)
            setSectionData(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSectionById()
    }, [sectionID])


    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className="p-4">
                <Card className="p-[20px] mb-[30px] shadow-lg">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-[22px]">
                            {sectionData?.exam?.name} - {sectionData?.name}
                        </h2>
                        <ExamPartCreate refresh={getSectionById} />
                    </div>
                </Card>

                {/* Выводим parts */}
                <div className="flex flex-col gap-6">
                    {sectionData?.parts?.length > 0 ? (
                        sectionData.parts.map((part) => (
                            <Card
                                key={part.id}


                                className="w-full p-6 shadow-md border border-blue-100 hover:shadow-xl transition-all duration-200"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <DocumentTextIcon className="w-6 h-6 text-blue-500" />
                                            <span className="font-bold text-xl">{part.name}</span>
                                            <Chip
                                                value={part.status === 1 ? "Active" : "Inactive"}
                                                color={part.status === 1 ? "green" : "red"}
                                                size="sm"
                                                className="ml-2"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2 items-center mt-[10px]">
                                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-blue-800 text-sm">
                                                <PlayCircleIcon className="w-4 h-4" />
                                                {part.type}
                                            </span>
                                            <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-gray-800 text-sm">
                                                <ClockIcon className="w-4 h-4" />
                                                {part.duration} min
                                            </span>
                                            <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-gray-800 text-sm">
                                                {part.total_questions} questions
                                            </span>
                                            {part.order && (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-gray-800 text-sm">
                                                    Order: {part.order}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 min-w-[120px] justify-end">
                                        <Button
                                            size="sm"
                                            color="blue"
                                            variant="outlined"
                                            className="flex items-center gap-2"
                                            onClick={() => navigate(`/o'quv_markaz/imtihon/qism/${part.id}`)}
                                        >
                                            <Eye size={15} />
                                            Batafsil
                                        </Button>
                                        <ExamPartEdit refresh={getSectionById} data={part} />
                                        <ExamPartDelete refresh={getSectionById} partId={part?.id} />
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center">No parts found</div>
                    )}
                </div>
            </div >
        </>
    )
}