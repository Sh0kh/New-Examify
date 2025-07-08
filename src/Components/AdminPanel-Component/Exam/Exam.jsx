import { useEffect, useState } from 'react';
import { $api } from '../../../utils';
import ReactLoading from 'react-loading';
import CONFIG from '../../../utils/Config';
import { NavLink } from 'react-router-dom';
import ExamCreate from './components/ExamCreate';

export default function Exam() {
    const [Exam, setExam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModal, setCreateModal] = useState(false);

    const getExam = async () => {
        setLoading(true);
        try {
            const response = await $api.get(`/study-center/exams`);
            setExam(response?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getExam();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                <ReactLoading type="spinningBubbles" color="#1976d2" height={80} width={80} />
            </div>
        );
    }

    return (
        <>
            <div className="w-full min-h-screen p-6 ">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Imtihonlar</h1>
                    <ExamCreate refresh={getExam} />
                </div>
                {Exam?.length <= 0 || !Exam ? (
                    <>
                        <div className="mb-6 p-4 bg-white h-[500px] rounded-lg shadow flex items-center justify-center ">
                            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                                <div className="text-gray-400 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-2"> Ma'lumot topilmadi</h3>
                                <p className="text-sm text-gray-500 max-w-xs">
                                    Hozircha hali ma'lumot yo‘q, iltimos, keyinroq urinib korishni so‘raymiz.
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Exam.map((center) => (
                            <NavLink to={`/o'quv_markaz/imtihon/${center?.id}`}>
                                <div
                                    key={center.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-200"
                                >
                                    {center.logo ? (
                                        <img
                                            src={CONFIG.API_URL + center?.logo}
                                            alt={center.name}
                                            className="w-full h-40 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-blue-100 flex items-center justify-center">
                                            <span className="text-gray-400 text-sm">Logo mavjud emas</span>
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-800">{center.name}</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong>Til:</strong> {center.language || 'Mavjud emas'}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong>Status:</strong> {center.status || 'Mavjud emas'}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong>Narxi:</strong> {center.price || 'Mavjud emas'}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong>Statusi:</strong> {center?.status}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <strong>imtihon turi:</strong> {center?.type_id == 1 ? "Tekin" : center?.type_id == 2 ? "Pullik" : center?.type_id == 3 ? "Yopiq (kalitli)" : "?????"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-3">
                                            Yaratildi: {new Date(center.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div >
        </>
    );
}