import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import { $api } from "../../../../utils";

export default function ExamStart({ isOpen, onClose, setDataFromChild }) {
    const { ID } = useParams();
    const [loading, setLoading] = useState(false)
    const location = useLocation();

    console.log(document.referrer);




    const StartExam = async () => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("exam_result_id", ID);
            formData.append("user_id", localStorage.getItem('user_id'));

            const response = await $api.post(`/user/start-exam`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setDataFromChild(response?.data || []);

            // === ВХОД В ПОЛНОЭКРАННЫЙ РЕЖИМ ===
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) {
                await docEl.requestFullscreen();
            } else if (docEl.webkitRequestFullscreen) { // Safari
                await docEl.webkitRequestFullscreen();
            } else if (docEl.mozRequestFullScreen) { // Firefox
                await docEl.mozRequestFullScreen();
            } else if (docEl.msRequestFullscreen) { // IE/Edge
                await docEl.msRequestFullscreen();
            }

            Swal.fire({
                title: "Successful!",
                icon: "success",
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });

            onClose();
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Error.",
                icon: "error",
                position: "top-end",
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

    return (
        <div
            className={`fixed inset-0 bg-[#0000006b] z-50 flex items-center justify-center transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
        >
            <div
                className={`TestModal  p-4 sm:p-6 bg-white rounded-[8px] w-[10   0%] sm:w-[50%] lg:w-[28%] transform transition-all duration-500 
                    ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className=" text-[black] text-[20px]">Ready to submit tests?</h2>
                <p className="text-[14px] text-[#535862] mt-[10px]">
                    Please be aware that if you exit full screen mode or switch to another tab during the exam, you will be automatically terminated from the exam. Stay focused and make sure to keep your full attention on the exam to avoid any disruptions. Good luck! 📚🚫🚷
                </p>
                <div className="flex items-center justify-center gap-[30px] mt-[10px]">
                    <button
                        disabled={loading}
                        onClick={StartExam}
                        className={`bg-[#2970FF] px-[50px] w-full font-bold py-[7px] shadow-sm rounded-[8px] text-white transition duration-500 border-[2px] border-[#2970FF]
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-transparent hover:text-[#2970FF]"} `}    >
                        {loading ? "Loading..." : "Start"}
                    </button>
                </div>
            </div>
        </div>
    );
}
