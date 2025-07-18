import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { $api } from "../../../../utils";

export default function ContinueExam({ open, onClose, data }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleContinueExam = async () => {
        try {
            setLoading(true);

            const response = await $api.post(`/user/continue-exam`, {
                exam_result_id: data?.id,
                user_id: localStorage.getItem("user_id"),
            });

            if (!response.data) {
                throw new Error('No data received from server');
            }

            // Переход на страницу решения экзамена
            navigate(`/exam-solution/${data.id}`);

        } catch (error) {
            console.error("Continue exam error:", error);
            alert("Failed to continue exam. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 bg-[#0000006b] z-50 flex items-center justify-center transition-opacity duration-500 ${open ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
        >
            <div
                className={`p-4 sm:p-6 bg-white rounded-[8px] w-[100%] sm:w-[50%] lg:w-[28%] transform transition-all duration-500 ${open
                    ? "scale-100 opacity-100 translate-y-0"
                    : "scale-75 opacity-0 translate-y-10"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-[10px]">
                    <div />
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✖
                    </button>
                </div>

                <h2 className="text-lg text-center font-semibold mb-2">
                    Do you want to continue the exam?
                </h2>

                <div className="flex items-center justify-center gap-[12px] mt-[20px]">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white w-full py-[9px] font-bold rounded-lg shadow-sm transition duration-500 border-2 border-blue-600 hover:bg-transparent hover:text-blue-600"
                        disabled={loading}
                    >
                        No
                    </button>
                    <button
                        onClick={handleContinueExam}
                        className={`bg-blue-600 text-white w-full py-[9px] font-bold rounded-lg shadow-sm transition duration-500 border-2 border-blue-600
                        ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-transparent hover:text-blue-600"}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                    ></path>
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            "Yes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
