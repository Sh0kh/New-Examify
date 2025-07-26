import { useEffect, useState, useCallback } from "react";
import ExamStart from "./components/ExamStart";
import ExamSolutionHeader from "./components/ExamSolutionHeader";
import ExamSolutionBody from "./components/ExamSolutionBody";
import LeavExamModal from "./components/LeavExamModal";
import NextSectionModal from "./components/NextSectionModal";
import CONFIG from "../../../utils/Config";

export default function ExamSolution({ initialExamData = null, loading = false, error = null }) {
    const [examData, setExamData] = useState(initialExamData);
    const [examStartModal, setExamStartModal] = useState(!initialExamData);
    const [timeLeft, setTimeLeft] = useState(0);
    const [outModal, setOutModal] = useState(false);
    const [nextSectionModal, setNextSectionModal] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const handleDataFromChild = useCallback((data) => {
        setExamData(data);
        setExamStartModal(false);
    }, []);

    useEffect(() => {
        if (initialExamData) {
            setExamData(initialExamData);
            setExamStartModal(false);
        }
    }, [initialExamData]);

    useEffect(() => {
        if (!examData?.section?.audio) return;

        const audioSrc = CONFIG.API_URL + 'audio/' + examData.section.audio;
        const audioElement = new Audio(audioSrc);

        audioElement.play().catch(err => {
            console.warn("Audio playback failed:", err);
        });

        return () => {
            audioElement.pause();
            audioElement.currentTime = 0;
        };
    }, [examData]);

    useEffect(() => {
        const durationInMinutes = examData?.section?.duration || examData?.next_section?.duration || 0;
        setTimeLeft(durationInMinutes * 60);
    }, [examData]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const confirmationMessage = "Вы действительно хотите покинуть страницу? Ваш прогресс может быть утерян.";
            e.preventDefault();
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    useEffect(() => {
        const blockKeys = (e) => {
            if (e.key === "Alt" && !e.ctrlKey && !e.shiftKey && !e.metaKey) return;
            if (e.key === "F5" || (e.ctrlKey && ["r", "p"].includes(e.key))) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const blockContextMenu = (e) => e.preventDefault();

        window.addEventListener("keydown", blockKeys);
        window.addEventListener("contextmenu", blockContextMenu);

        return () => {
            window.removeEventListener("keydown", blockKeys);
            window.removeEventListener("contextmenu", blockContextMenu);
        };
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme);
    }, [theme]);

    const handleThemeChange = (value) => {
        const newTheme = value ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        setTheme(value);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading exam data...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {examData && (
                <>
                    <ExamSolutionHeader
                        time={timeLeft}
                        theme={theme}
                        setTheme={handleThemeChange}
                        nextSection={() => setNextSectionModal(true)}
                        activeOutModal={() => setOutModal(true)}
                        examData={examData}
                        timeLeft={formatTime(timeLeft)}
                    />
                    <ExamSolutionBody
                        theme={theme}
                        setAnswers={setAnswers}
                        examData={examData}
                    />
                </>
            )}

            <ExamStart
                isOpen={examStartModal && !examData}
                onClose={() => setExamStartModal(false)}
                setDataFromChild={handleDataFromChild}
            />

            <LeavExamModal
                isOpen={outModal}
                onClose={() => setOutModal(false)}
            />

            <NextSectionModal
                time={timeLeft}
                setDataFromChild={handleDataFromChild}
                examData={examData}
                answers={answers}
                isOpen={nextSectionModal}
                onClose={() => setNextSectionModal(false)}
            />
        </div>
    );
}
