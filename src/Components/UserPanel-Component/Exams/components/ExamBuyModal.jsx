import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Check from '@/Images/BuyCheck.png';
import { $api } from "../../../../utils";

export default function ExamBuyModal({ isOpen, onClose, id, Error, examType }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const BuyExam = async (type) => {
        if (loading) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('exam_id', id);
            formData.append('check_type', type);
            formData.append('user_id', localStorage.getItem('user_id'));

            if (examType == 3) {
                if (!key) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Please enter the key!',
                        icon: 'warning',
                        position: 'top-end',
                        timer: 3000,
                        toast: true,
                        showCloseButton: true,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    });
                    setLoading(false);
                    return;
                }
                formData.append('key', key);
                const response = await $api.post(`/user/buy-exam-with-key`, formData);
                Swal.fire({
                    title: 'Successful!',
                    icon: 'success',
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                    showCloseButton: true,
                    toast: true,
                    showConfirmButton: false,
                });
                navigate(`/exam-solution/${response?.data?.exam_result?.id}`);
            } else {
                const response = await $api.post(`/user/buy-exam`, formData);
                Swal.fire({
                    title: 'Successful!',
                    icon: 'success',
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                    showCloseButton: true,
                    toast: true,
                    showConfirmButton: false,
                });
                navigate(`/exam-solution/${response?.data?.exam_result?.id}`);
            }
        } catch (error) {
            if (error?.status === 401) {
                navigate('/login');
                localStorage.clear();
            } else {
                Error();
            }
            onClose();
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Error.',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,

            });
        } finally {
            setLoading(false);
        }
    };

    const handleTypeClick = (type) => {
        setSelectedType(type);
        if (examType === 3) {
            setShowKeyInput(true);
        } else {
            BuyExam(type);
        }
    };

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 bg-[#0000006b] z-50 flex items-center justify-center transition-opacity duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
        >
            <div
                className={`TestModal p-4 sm:p-6 bg-white rounded-[8px] w-[100%] sm:w-[50%] lg:w-[28%] transform transition-all duration-500 
                    ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between mb-[10px]'>
                    <div>
                        <img src={Check} alt="Foto" />
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
                </div>
                <h2 className="text-lg font-semibold">
                    What will you choose to have your test checked by AI or Human?
                </h2>
                <p>
                    
                </p>

                {examType == 3 && (
                    <div className="mt-4">
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Enter your key"
                            className="w-full p-2 border rounded"
                        />
                        {/* <button
                            onClick={() => BuyExam(selectedType)}
                            disabled={loading}
                            className="mt-2 w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                        >
                            {loading ? 'Loading...' : 'Submit Key & Buy'}
                        </button> */}
                    </div>
                )}

                <div className="flex items-center justify-center gap-[12px] mt-[10px]">
                    <button
                        onClick={() => handleTypeClick('ai')}
                        disabled={loading}
                        className={`p-[10px] w-full rounded-[10px] px-[20px] border-[2px] transition duration-500 
                            ${loading ? 'bg-gray-400 border-gray-400 text-white cursor-not-allowed' : 'bg-[#2970FF] border-[#2970FF] text-white hover:bg-transparent hover:text-[#2970FF]'}`}
                    >
                        {loading ? 'Loading...' : 'AI'}
                    </button>
                    <button
                        onClick={() => handleTypeClick('human')}
                        disabled={loading}
                        className={`p-[10px] w-full rounded-[10px] px-[20px] border-[2px] transition duration-500 
                            ${loading ? 'bg-gray-400 border-gray-400 text-white cursor-not-allowed' : 'bg-[#2970FF] border-[#2970FF] text-white hover:bg-transparent hover:text-[#2970FF]'}`}
                    >
                        {loading ? 'Loading...' : 'Human'}
                    </button>
                </div>


            </div>
        </div>
    );
}
