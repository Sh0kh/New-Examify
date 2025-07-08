import { useEffect, useState } from 'react';
import StudyCenterCreate from './StudyCenterCreate';
import { $api } from '../../../utils';
import ReactLoading from 'react-loading';
import CONFIG from '../../../utils/Config';
import { NavLink } from 'react-router-dom';

export default function StudyCenter() {
    const [studyCenterData, setStudyCenterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModal, setCreateModal] = useState(false);

    const getStudyCenter = async () => {
        setLoading(true);
        try {
            const response = await $api.get(`/admin/study-centers`);
            setStudyCenterData(response?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudyCenter();
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
            <div className="w-full min-h-screen p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">O'quv markazlar</h1>
                    <StudyCenterCreate refresh={getStudyCenter} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {studyCenterData.map((center) => (
                        <NavLink to={`/o'quv_markaz/${center?.id}`}>
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
                                        <strong>Telefon:</strong> {center.phone || 'Mavjud emas'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Manzil:</strong> {center.address || 'Mavjud emas'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Email:</strong> {center.email || 'Mavjud emas'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-3">
                                        Yaratildi: {new Date(center.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div >
        </>
    );
}