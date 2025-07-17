import { NavLink, useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { $api } from "../../../utils";
import {
    CardBody,
    Typography,
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

    const getSectionScore = (name) => {
        return data?.section_scores?.find(s => s.section?.name === name);
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <Header />
            <main className="min-h-screen">
                <section className="mt-[150px]">
                    <div className="max-w-[1200px] mx-auto px-[10px]">
                        <h1 className="text-[32px] font-[600]">My results</h1>
                        <span className="block mt-[24px] text-[18px]">
                            Exam name: {data?.exam?.name}
                        </span>
                        <span className="block mt-[20px] text-[18px]">
                            Date: {new Date(data?.start_time).toLocaleString()}
                        </span>
                        <span className="block mt-[20px] text-[18px]">
                            Status:
                            <span className="text-[green]"> Finished</span>
                        </span>

                        <div className="bg-[#F5F5F5] w-full h-[2px] my-[30px]"></div>

                        {/* Сводная таблица по баллам */}
                        <CardBody className="overflow-x-auto p-[0px] mt-[30px] ">
                            <Typography variant="h5" className="mb-4 font-semibold text-gray-700">
                                Summary of Scores
                            </Typography>
                            <table className="min-w-full shadow-lg table-auto text-center border border-gray-200 rounded-2xl">
                                <thead className="bg-gray-100 text-gray-700 text-sm rounded-[20px]">
                                    <tr>
                                        <th className="p-4 border-b border-gray-200">Overall</th>
                                        <th className="p-4 border-b border-gray-200">
                                            <NavLink to={`/my-result/${resultId}/${getSectionScore("Listening")?.id}`}>
                                                Listening
                                            </NavLink>
                                        </th>
                                        <th className="p-4 border-b border-gray-200">
                                            <NavLink to={`/my-result/${resultId}/${getSectionScore("Reading")?.id}`}>
                                                Reading
                                            </NavLink>
                                        </th>
                                        <th className="p-4 border-b border-gray-200">
                                            <NavLink to={`/my-result/${resultId}/${getSectionScore("Speaking")?.id}`}>
                                                Speaking
                                            </NavLink>
                                        </th>
                                        <th className="p-4 border-b border-gray-200">
                                            <NavLink to={`/my-result/${resultId}/${getSectionScore("Writing")?.id}`}>
                                                Writing
                                            </NavLink>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-800 font-medium">
                                    <tr>
                                        <td className="p-6 border-b border-gray-100">
                                            {data?.score ?? "N/A"}
                                        </td>
                                        {/* Listening */}
                                        <td className="p-6 border-b border-gray-100 text-blue-600 hover:underline cursor-pointer">
                                            {getSectionScore("Listening") ? (
                                                <NavLink to={`/my-result/${resultId}/${getSectionScore("Listening")?.id}`}>
                                                    {getSectionScore("Listening")?.score}
                                                </NavLink>
                                            ) : "N/A"}
                                        </td>
                                        {/* Reading */}
                                        <td className="p-6 border-b border-gray-100 text-blue-600 hover:underline cursor-pointer">
                                            {getSectionScore("Reading") ? (
                                                <NavLink to={`/my-result/${resultId}/${getSectionScore("Reading")?.id}`}>
                                                    {getSectionScore("Reading")?.score}
                                                </NavLink>
                                            ) : "N/A"}
                                        </td>
                                        {/* Speaking */}
                                        <td className="p-6 border-b border-gray-100 text-blue-600 hover:underline cursor-pointer">
                                            {getSectionScore("Speaking") ? (
                                                <NavLink to={`/my-result/${resultId}/${getSectionScore("Speaking")?.id}`}>
                                                    {getSectionScore("Speaking")?.score}
                                                </NavLink>
                                            ) : "N/A"}
                                        </td>

                                        {/* Writing */}
                                        <td className="p-6 border-b border-gray-100 text-blue-600 hover:underline cursor-pointer">
                                            {getSectionScore("Writing") ? (
                                                <NavLink to={`/my-result/${resultId}/${getSectionScore("Writing")?.id}`}>
                                                    {getSectionScore("Writing")?.score}
                                                </NavLink>
                                            ) : "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardBody>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
