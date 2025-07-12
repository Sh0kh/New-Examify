import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { NavLink, useParams } from "react-router-dom";
import { $api } from "../../../utils";
import { useEffect, useState } from "react";
import Loading from "../../UI/Loadings/Loading";

export default function TkExamDetail() {
    const { tkExamId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const getUncheckedExam = async () => {
        setLoading(true);
        try {
            const response = await $api.post(`/study-center/unchecked-exam`, {
                exam_id: tkExamId
            });
            setData(response?.data || null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUncheckedExam();
    }, []);

    if (loading) return <Loading />;

    if (!data || !data.section_scores?.length) {
        return (
            <div className="p-6">
                <Card className="p-6 text-center border bg-blue-50">
                    <Typography variant="h6" className="text-blue-700">
                        Tekshiriladigan bo‘limlar topilmadi.
                    </Typography>
                </Card>
            </div>
        );
    }

    const pendingSections = data.section_scores.filter(section => section.status === "pending");

    if (!pendingSections.length) {
        return (
            <div className="p-6">
                <Card className="p-6 text-center border bg-green-50">
                    <Typography variant="h6" className="text-green-700">
                        Bu imtihon allaqachon tekshirildi.
                    </Typography>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 space-y-6">
            {pendingSections.map((sectionScore) => {
                const section = sectionScore.section;
                const sectionName = section?.name || "Noma’lum";
                const sectionType = section?.type?.toLowerCase() || "noma'lum";

                return (
                    <NavLink
                        key={sectionScore.id}
                        to={`/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar/${tkExamId}/${sectionType}/${sectionScore?.id}`}
                        className="block"
                    >
                        <Card className="w-full mx-auto border border-blue-200 shadow-md bg-white">
                            <CardBody>
                                <Typography variant="h5" color="blue-gray" className="mb-2 capitalize">
                                    {sectionName}
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                    {sectionName.toLowerCase()} bo‘limi haqida batafsil — holati: <strong>{sectionScore.status}</strong>
                                </Typography>
                            </CardBody>
                        </Card>
                    </NavLink>
                );
            })}
        </div>
    );
}
