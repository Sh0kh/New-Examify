import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ExamStart from "./components/ExamStart";
import ExamSolutionHeader from "./components/ExamSolutionHeader";
import ExamSolutionBody from "./components/ExamSolutionBody";
import LeavExamModal from "./components/LeavExamModal";
import NextSectionModal from "./components/NextSectionModal";
import CONFIG from "../../../utils/Config";

export default function ExamSolution() {
    // Получаем данные из Redux store
    const { DataExam, loading, error } = useSelector((state) => state.exam);


    // Локальное состояние
    const [examData, setExamData] = useState(DataExam || null);
    const [examStartModal, setExamStartModal] = useState(!DataExam);
    const [timeLeft, setTimeLeft] = useState(0);
    const [outModal, setOutModal] = useState(false);
    const [nextSectionModal, setNextSectionModal] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    // Обработчик получения данных от дочернего компонента
    const handleDataFromChild = useCallback((data) => {
        setExamData(data);
        setExamStartModal(false);
    }, []);

    // Синхронизация данных при изменении DataExam из Redux
    useEffect(() => {
        if (DataExam) {
            setExamData(DataExam);
            setExamStartModal(false);
        }
    }, [DataExam]);

    // Воспроизведение аудио при изменении секции
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

    // Установка таймера
    useEffect(() => {
        const durationInMinutes = examData?.section?.duration || examData?.next_section?.duration || 0;
        setTimeLeft(durationInMinutes * 60);
    }, [examData]);

    // Обратный отсчет времени
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Форматирование времени
    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    // Защита от закрытия страницы
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

    // Блокировка клавиш и контекстного меню
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

    // Управление темой
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme);
    }, [theme]);

    const handleThemeChange = (value) => {
        const newTheme = value ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        setTheme(value);
    };


    // Состояния загрузки и ошибки
    if (loading) return <div className="flex justify-center items-center h-screen">Loading exam data...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Основной интерфейс экзамена */}
            {examData && (
                <>
                    <ExamSolutionHeader
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

            {/* Модальные окна */}
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
                setDataFromChild={handleDataFromChild}
                examData={examData}
                answers={answers}
                isOpen={nextSectionModal}
                onClose={() => setNextSectionModal(false)}
            />
        </div>
    );
}