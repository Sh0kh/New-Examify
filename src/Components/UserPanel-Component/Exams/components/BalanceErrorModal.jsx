import { useNavigate } from "react-router-dom";

export default function BalanceErrorModal({ isOpen, onClose, examPrice }) {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/payment", { state: { examPrice } });
        onClose();
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
                    <div></div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
                </div>
                <h2 className="text-lg font-semibold">There is not enough money on your balance</h2>
                <div className="flex items-center justify-center gap-[12px] mt-[10px]">
                    <button
                        onClick={handleRedirect}
                        className="bg-[#2970FF] text-white p-[10px] w-full rounded-[10px] px-[20px] border-[2px] border-[#2970FF] transition duration-500 hover:bg-transparent hover:text-[#2970FF]">
                        Top up balance
                    </button>
                </div>
            </div>
        </div>
    );
}
