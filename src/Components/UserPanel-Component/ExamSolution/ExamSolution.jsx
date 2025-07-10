import { useEffect, useState } from "react";
import ExamStart from "./components/ExamStart";
import { useCallback } from "react";
import ExamSolutionHeader from "./components/ExamSolutionHeader";
import ExamSolutionBody from "./components/ExamSolutionBody";
import LeavExamModal from "./components/LeavExamModal";
import NextSectionModal from "./components/NextSectionModal";
import CONFIG from "../../../utils/Config";

export default function ExamSolution() {
    const [examStartModal, setExamStartModal] = useState(true)
    const [examData, setExamData] = useState([])
    const [timeLeft, setTimeLeft] = useState(0);
    const [outModal, setOutModal] = useState(false);
    const [nextSectionModal, setNextSectionModal] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    }); const handleDataFromChild = useCallback((data) => {
        setExamData(data);
    }, []);

    useEffect(() => {
        if (examData?.section?.audio) {
            const audioSrc = CONFIG.API_URL + 'audio/' + examData.section.audio;
            const audioElement = new Audio(audioSrc);
            audioElement.play().catch(err => {
                console.warn("Audio playback failed:", err);
            });

            return () => {
                audioElement.pause();
                audioElement.currentTime = 0;
            };
        }
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


    // console.log(examData)


    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme);
    }, [theme]);

    const handleThemeChange = (value) => {
        const newTheme = value ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        setTheme(value);
    };


    return (
        <>
            <ExamSolutionHeader
                theme={theme}
                setTheme={handleThemeChange}
                nextSection={() => setNextSectionModal(true)} activeOutModal={() => setOutModal(true)} examData={examData} timeLeft={formatTime(timeLeft)} />
            <ExamSolutionBody theme={theme} setAnswers={setAnswers} examData={examData} />
            <ExamStart isOpen={examStartModal} onClose={() => setExamStartModal(false)} setDataFromChild={handleDataFromChild} />
            <LeavExamModal isOpen={outModal} onClose={() => setOutModal(false)} />
            <NextSectionModal setDataFromChild={handleDataFromChild} examData={examData} answers={answers} isOpen={nextSectionModal} onClose={() => setNextSectionModal(false)} />
        </>
    )
}