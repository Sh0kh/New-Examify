import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Loading from "../../UI/Loadings/Loading";
import { FaArrowRight } from "react-icons/fa";
import Logo from "@/Images/logo.png";
import ExamBuyModal from "../Exams/components/ExamBuyModal";
import BalanceErrorModal from "../Exams/components/BalanceErrorModal";

export default function ExamifyExams() {
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);
    const [BuyExamModal, setBuyExamModal] = useState(false);
    const [examId, setExamId] = useState(null);
    const [examType, setExamType] = useState(null);
    const [error, setError] = useState(false);


    const gradientColors = [
        "from-pink-400 to-red-500",
        "from-indigo-400 to-purple-500",
        "from-yellow-400 to-orange-500",
        "from-cyan-400 to-blue-500",
        "from-teal-400 to-teal-600",
        "from-rose-400 to-pink-500",
        "from-violet-400 to-fuchsia-500"
    ];

    const getAllExam = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/user/get-center-exams/${4}`);
            setExams(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllExam();
    }, []);

    const activeExams = useMemo(() => {
        return exams
            .filter(exam => exam.status === "active")
            .sort((a, b) => {
                if (a.type_id == 1 && b.type_id !== 1) return -1;
                if (a.type_id !== 1 && b.type_id == 1) return 1;
                return 0;
            });
    }, [exams]);




    return (
        <>
            <main className="min-h-screen px-4 py-10 mt-[80px]">
                <div className="container">
                    <h1 className="text-3xl font-bold">Examify Exams</h1>
                    <p className="text-gray-600 mt-2">
                        Dear user. The Examify team wishes you good luck and we want you to pass the tests successfully.
                    </p>
                    {loading ? (
                        <Loading />
                    ) : activeExams.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-40 text-center">
                            <div className="text-6xl mb-4">📄</div>
                            <h2 className="text-xl font-semibold text-gray-700">No Exams Available</h2>
                            <p className="text-gray-500 mt-2 max-w-md">
                                There are currently no active exams available at this center. Please try again later.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                            {activeExams.map((exam, index) => {
                                const colorClass =
                                    `bg-gradient-to-r ${gradientColors[index % gradientColors.length]}`;
                                return (
                                    <div
                                        key={exam.id}
                                        onClick={() => {
                                            setExamId(exam?.id);
                                            setExamType(exam?.type_id);
                                            setBuyExamModal(true);
                                        }}
                                        className={`p-6 rounded-2xl h-[314px] flex flex-col justify-between text-white shadow-lg 
                    ${colorClass}
                    cursor-pointer transition-transform hover:scale-105`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold flex items-center space-x-2">
                                                <img src={Logo} alt="IELTS logo" className="w-[25px] h-[34px]" />
                                                <span>Examify</span>
                                            </h2>
                                            {exam?.created_at && (() => {
                                                const createdDate = new Date(exam.created_at);
                                                const today = new Date();
                                                const diffInDays = (today - createdDate) / (1000 * 60 * 60 * 24);
                                                return diffInDays <= 20 ? <span>New</span> : null;
                                            })()}
                                        </div>
                                        <div>
                                            <h3 className="text-lg mt-2">{exam.name}</h3>
                                            <p className="text-sm mt-1">Language: {exam.language}</p>

                                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-white text-black`}>
                                                {exam.type_id == 1
                                                    ? "Free"
                                                    : exam.type_id == 2
                                                        ? "Paid"
                                                        : exam.type_id == 3
                                                            ? "Private (with key)"
                                                            : "Unknown"}
                                            </span>
                                            {exam.type_id == 2 && (
                                                <p className="text-sm mt-1">
                                                    Price: {exam.price.toLocaleString("ru-RU")} UZS
                                                </p>
                                            )}
                                        </div>

                                        <button className="mt-4 flex items-center text-sm font-medium text-white">
                                            Start <FaArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </main>
            <ExamBuyModal id={examId} examType={examType} isOpen={BuyExamModal} onClose={() => setBuyExamModal(false)} Error={() => setError(true)} />
            <BalanceErrorModal isOpen={error} onClose={() => setError(false)} />
        </>
    );
}
