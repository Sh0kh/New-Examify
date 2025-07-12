import { NavLink, useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { $api } from "../../../utils";
import {
    Card,
    CardBody,
    Typography,
    Spinner,
} from "@material-tailwind/react";
import Loading from "../../UI/Loadings/Loading";

export default function MyResultDetail() {
    const { resultId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getMyResult = async () => {
        setLoading(true);
        try {
            const response = await $api.get(`/user/my-exam/${resultId}`);
            setData(response?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyResult();
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-[80vh] pt-[120px] bg-gray-50 py-6 px-4">
                {loading ? (
                    <div className="flex justify-center items-center h-[100vh]">
                        <Loading />
                    </div>
                ) : (
                    <section className="max-w-4xl mx-auto space-y-6">
                        {/* Основная информация */}
                        <Card className="shadow-md">
                            <CardBody>
                                <Typography variant="h5" className="mb-2 text-blue-700">
                                    Imtihon natijasi: {data?.exam?.name}
                                </Typography>
                                <Typography color="gray" className="mb-1">
                                    Til: <strong>{data?.exam?.language}</strong>
                                </Typography>
                                <Typography color="gray" className="mb-1">
                                    Umumiy ball: <strong>{data?.score}</strong>
                                </Typography>
                                <Typography color="gray">
                                    Natija (A1-C2): <strong>{data?.result}</strong>
                                </Typography>
                            </CardBody>
                        </Card>

                        {/* Bo‘limlar natijasi */}
                        <div className="space-y-4">
                            {data?.section_scores?.map((sectionScore) => (
                                <NavLink className={'block'} to={`/my-result/${sectionScore?.exam_result_id}/${sectionScore?.id}`}>
                                    <Card key={sectionScore.id} className="border border-blue-100">
                                        <CardBody>
                                            <Typography variant="h6" className="text-blue-600">
                                                {sectionScore?.section?.name}
                                            </Typography>
                                            <Typography color="gray">
                                                Holati:{" "}
                                                <strong className="capitalize">
                                                    {sectionScore.status}
                                                </strong>
                                            </Typography>
                                            <Typography color="gray">
                                                Ball: <strong>{sectionScore.score}</strong>
                                            </Typography>
                                            <Typography color="gray" className="text-sm mt-1">
                                                Boshlangan vaqt:{" "}
                                                {new Date(sectionScore.start_time).toLocaleTimeString()}
                                            </Typography>
                                            <Typography color="gray" className="text-sm">
                                                Tugagan vaqt:{" "}
                                                {new Date(sectionScore.end_time).toLocaleTimeString()}
                                            </Typography>
                                        </CardBody>
                                    </Card>
                                </NavLink>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
