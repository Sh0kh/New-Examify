import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, FileText, CheckCircle, XCircle, AlertCircle, Moon, Sun } from 'lucide-react';
import CONFIG from '../../../../utils/Config';
import parse, { domToReact } from 'html-react-parser';
import { $api } from '../../../../utils';

// Question type components with dark mode support
const MultipleChoiceQuestion = ({ question, onAnswer, userAnswer, theme }) => (
    <div className="space-y-4">
        <div className="flex flex-col space-y-3">
            <p
                className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                dangerouslySetInnerHTML={{ __html: question.question_text }}
            />
            {question.image_url && (
                <img
                    src={CONFIG.API_URL + question.image_url}
                    alt="Question visual"
                    className="max-w-[400px] h-auto rounded-lg border"
                />
            )}
        </div>
        <div className="space-y-2">
            {question.answers.map((answer) => (
                <label
                    key={answer.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
            ${userAnswer === answer.id
                            ? theme === 'dark'
                                ? 'bg-blue-900 border-blue-700'
                                : 'bg-blue-50 border-blue-300'
                            : theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        checked={userAnswer === answer.id}
                        onChange={() => onAnswer(answer.id)}
                        className={`mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                    />
                    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>{answer.answer_text}</span>
                </label>
            ))}
        </div>
    </div>
);

const MultipleSelectQuestion = ({ question, onAnswer, userAnswer, theme }) => {
    const handleAnswerChange = (answerId) => {
        const newAnswers = userAnswer?.includes(answerId)
            ? userAnswer.filter(id => id !== answerId)
            : [...(userAnswer || []), answerId];
        onAnswer(newAnswers);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-3">
                <p
                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                    dangerouslySetInnerHTML={{ __html: question.question_text }}
                />
                {question.image_url && (
                    <img
                        src={CONFIG.API_URL + question.image_url}
                        alt="Question visual"
                        className="max-w-[400px] h-auto rounded-lg border"
                    />
                )}
            </div>
            <div className="space-y-2">
                {question.answers.map((answer) => (
                    <label
                        key={answer.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                            ${userAnswer?.includes(answer.id)
                                ? theme === 'dark'
                                    ? 'bg-blue-900 border-blue-700'
                                    : 'bg-blue-50 border-blue-300'
                                : theme === 'dark'
                                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <input
                            type="checkbox"
                            name={`question-${question.id}`}
                            value={answer.id}
                            checked={userAnswer?.includes(answer.id) || false}
                            onChange={() => handleAnswerChange(answer.id)}
                            className={`mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                        />
                        <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>{answer.answer_text}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const FillInBlankQuestion = ({ question, onAnswer, userAnswer, theme }) => {
    const questionText = question.question_text || "";

    // Подсчитываем количество {textinput} в тексте
    const inputCount = (questionText.match(/{textinput}/g) || []).length;

    // Создаем массив ответов для каждого input'а
    const answers = Array.isArray(userAnswer) ? userAnswer : new Array(inputCount).fill("");

    const handleInputChange = (inputIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[inputIndex] = value;
        onAnswer(newAnswers);
    };

    // Предварительно заменяем {textinput} на уникальные маркеры с индексами
    let inputIndex = 0;
    const processedText = questionText.replace(/{textinput}/g, () => {
        return `<span data-input-index="${inputIndex++}"></span>`;
    });

    const parsedContent = parse(processedText, {
        replace: (domNode) => {
            // Обрабатываем наши маркеры input'ов
            if (domNode.type === "tag" && domNode.name === "span" && domNode.attribs && domNode.attribs['data-input-index']) {
                const index = parseInt(domNode.attribs['data-input-index']);
                return (
                    <input
                        key={`input-${index}`}
                        type="text"
                        value={answers[index] || ""}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`inline-block border rounded px-2 py-1 mx-2 min-w-[100px] ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                            }`}
                    />
                );
            }
        },
    });

    return (
        <div className="space-y-4">
            <div className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {parsedContent}
            </div>
            {question.image_url && (
                <img
                    src={CONFIG.API_URL + question.image_url}
                    alt="Question visual"
                    className="max-w-[400px] h-auto rounded-lg border mb-4"
                />
            )}
        </div>
    );
};

const DropdownQuestion = ({ question, onAnswer, userAnswer, theme }) => {
    const handleSelectChange = (e) => {
        onAnswer(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-3">
                <p
                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                    dangerouslySetInnerHTML={{ __html: question.question_text }}
                />
                {question.image_url && (
                    <img
                        src={CONFIG.API_URL + question.image_url}
                        alt="Question visual"
                        className="max-w-[400px] h-auto rounded-lg border"
                    />
                )}
            </div>
            <div className="mt-4">
                <select
                    value={userAnswer || ""}
                    onChange={handleSelectChange}
                    className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                        }`}
                >
                    <option value="">Tanlang</option>
                    {question.answers.map((answer) => (
                        <option key={answer.id} value={answer.id}>
                            {answer.answer_text}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

const EssayQuestion = ({ question, onAnswer, userAnswer, theme }) => {
    const handleTextChange = (e) => {
        onAnswer(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-3">
                <p
                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                    dangerouslySetInnerHTML={{ __html: question.question_text }}
                />
                {question.image_url && (
                    <img
                        src={CONFIG.API_URL + question.image_url}
                        alt="Question visual"
                        className="max-w-[400px] h-auto rounded-lg border"
                    />
                )}
            </div>
            <div className="mt-4">
                <textarea
                    value={userAnswer || ""}
                    onChange={handleTextChange}
                    rows={8}
                    className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                        }`}
                    placeholder="Javobingizni yozing..."
                />
            </div>
        </div>
    );
};

const SpeakingQuestion = ({ question, onAnswer, userAnswer, theme, examResultId }) => {
    const [recording, setRecording] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    // Recording timer
    useEffect(() => {
        if (recording) {
            timerRef.current = setInterval(() => {
                setRecordTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [recording]);

    const handleRecord = async () => {
        if (!recording) {
            try {
                setRecordTime(0);
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (e) => {
                    audioChunksRef.current.push(e.data);
                };

                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    await uploadAudio(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current.start();
                setRecording(true);
            } catch (error) {
                console.error("Microphone permission denied:", error);
                alert("Microphone access denied. Please allow microphone access to record your answer.");
            }
        } else {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const uploadAudio = async (audioBlob) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("audio", audioBlob, "answer.webm");
        formData.append("exam_result_id", examResultId);
        formData.append("question_id", question.id);

        try {
            const response = await $api.post("/user/upload-audio", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            onAnswer({
                answer_id: response.data.id,
                file_path: response.data.file_path || null,
                answer_text: null
            });

        } catch (error) {
            console.error("Audio upload error:", error);
            alert("Failed to upload audio. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* Question Section */}
            <div className="flex flex-col space-y-4">
                <p
                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                    dangerouslySetInnerHTML={{ __html: question.question_text }}
                />
                {question.image_url && (
                    <img
                        src={CONFIG.API_URL + question.image_url}
                        alt="Question visual"
                        className="max-w-full md:max-w-[400px] h-auto rounded-lg border"
                    />
                )}
            </div>

            {/* Recording Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRecord}
                        disabled={uploading}
                        className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all
                            ${recording
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : theme === 'dark'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }
                            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {recording ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                                Stop Recording
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                Start Recording Answer
                            </>
                        )}
                    </button>

                    {recording && (
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                            <span className="font-medium">
                                {formatTime(recordTime)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Status Messages */}
                {uploading && (
                    <div className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
                        <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-blue-700'}>
                            Uploading audio...
                        </span>
                    </div>
                )}

                {userAnswer && !uploading && (
                    <div className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/30 border border-green-800' : 'bg-green-100 border border-green-200'}`}>
                        <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={theme === 'dark' ? 'text-green-300' : 'text-green-700'}>
                            Audio answer uploaded successfully
                        </span>
                        <button
                            onClick={handleRecord}
                            className="ml-auto text-sm px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Re-record
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// Question type renderer
const QuestionRenderer = ({ question, onAnswer, userAnswer, theme, examResultId }) => {
    const questionTypeComponents = {
        1: MultipleChoiceQuestion, // Bitta javobli test (Quiz)
        2: MultipleSelectQuestion, // Bir nechta javobli test
        3: FillInBlankQuestion,    // Bo'sh joy (alohida)
        4: FillInBlankQuestion,    // Bo'sh joy (hikoya shaklida)
        5: DropdownQuestion,       // Dropdown tanlov (Select)
        6: EssayQuestion,          // Essay (Writing)
        7: SpeakingQuestion,       // Speaking (Audio talabi)
    };

    const QuestionComponent = questionTypeComponents[question.question_type_id] || FillInBlankQuestion;

    return (
        <QuestionComponent
            question={question}
            onAnswer={onAnswer}
            userAnswer={userAnswer}
            theme={theme}
            examResultId={examResultId}
        />
    );
};

// import { CheckCircle, AlertCircle } from "lucide-react";
// import QuestionRenderer from "./QuestionRenderer";


export default function ExamSolutionBody({ examData, setAnswers }) {
    // Состояния компонента
    const [activePart, setActivePart] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [theme, setTheme] = useState('light');
    const [writingTexts, setWritingTexts] = useState({}); // Объект для хранения текстов всех частей
    const [wordCounts, setWordCounts] = useState({}); // Объект для хранения счетчиков слов

    // Данные экзамена
    const SectionType = examData?.next_section?.type;
    const parts = examData?.section?.parts || examData?.next_section?.parts || [];
    const currentPart = parts.find(part => part.id === activePart) || parts[0];
    const currentQuestions = currentPart?.questions || [];

    // Инициализация активной части
    useEffect(() => {
        if (parts.length > 0 && !activePart) {
            setActivePart(parts[0].id);
            // Инициализация текстов для всех Writing частей
            if (SectionType === 'Writing') {
                const initialTexts = {};
                const initialCounts = {};

                parts.forEach(part => {
                    const question = part.questions?.[0];
                    if (question) {
                        const answer = userAnswers[question.id] || "";
                        initialTexts[part.id] = answer;
                        initialCounts[part.id] = answer.trim() ? answer.trim().split(/\s+/).length : 0;
                    }
                });

                setWritingTexts(initialTexts);
                setWordCounts(initialCounts);
            }
        }
    }, [parts, activePart, SectionType, userAnswers]);

    // Обработчик изменения текста для Writing секции
    const handleWritingChange = (e, partId) => {
        const text = e.target.value;

        // Обновляем текст для текущей части
        setWritingTexts(prev => ({
            ...prev,
            [partId]: text
        }));

        // Обновляем счетчик слов для текущей части
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        setWordCounts(prev => ({
            ...prev,
            [partId]: words.length
        }));

        // Сохраняем ответ в userAnswers для вопроса текущей части
        const question = parts.find(p => p.id === partId)?.questions?.[0];
        if (question) {
            setUserAnswers(prev => ({
                ...prev,
                [question.id]: text
            }));
        }
    };

    // Управление темой
    useEffect(() => {
        const checkAndApplyTheme = () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            if (currentTheme !== theme) {
                setTheme(currentTheme);
                document.documentElement.classList.toggle('dark', currentTheme === 'dark');
            }
        };

        checkAndApplyTheme();
        const handleStorageChange = () => checkAndApplyTheme();
        window.addEventListener('storage', handleStorageChange);
        const intervalId = setInterval(checkAndApplyTheme, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [theme]);

    // Формирование ответов для отправки
    useEffect(() => {
        const formattedParts = parts.map(part => ({
            id: part.id,
            part_type: part.part_type,
            answers: part.questions.reduce((acc, q) => {
                const userAnswer = userAnswers[q.id];
                const questionType = parseInt(q.question_type_id);

                if (userAnswer === undefined || userAnswer === null) {
                    return acc;
                }

                // Handle different question types
                switch (questionType) {
                    case 1: // Single correct answer
                    case 5:
                        if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
                            const numericAnswer = Number(userAnswer);
                            if (!isNaN(numericAnswer)) {
                                acc.push({
                                    question_id: q.id,
                                    question_type_id: q.question_type_id,
                                    answer_id: numericAnswer,
                                    answer_text: null,
                                    selected_answers: null,
                                    file_path: null
                                });
                            }
                        }
                        break;

                    case 2: // Multiple choice
                        if (Array.isArray(userAnswer)) {
                            const validAnswers = userAnswer
                                .filter(id => id !== undefined && id !== null && id !== '')
                                .map(id => Number(id))
                                .filter(id => !isNaN(id));

                            if (validAnswers.length > 0) {
                                acc.push({
                                    question_id: q.id,
                                    question_type_id: q.question_type_id,
                                    answer_id: null,
                                    answer_text: null,
                                    selected_answers: validAnswers,
                                    file_path: null
                                });
                            }
                        }
                        break;

                    case 3: // Fill in blanks (separate)
                    case 4: // Fill in blanks (story)
                        if (Array.isArray(userAnswer)) {
                            // Create separate answer object for each blank answer
                            userAnswer.forEach(answer => {
                                const answerText = String(answer).trim();
                                if (answerText !== '') {
                                    acc.push({
                                        question_id: q.id,
                                        question_type_id: q.question_type_id,
                                        answer_id: null,
                                        answer_text: answerText,
                                        selected_answers: null,
                                        file_path: null
                                    });
                                }
                            });
                        }
                        break;

                    case 6: // Short answer
                        const answerText = String(userAnswer).trim();
                        if (answerText !== '') {
                            acc.push({
                                question_id: q.id,
                                question_type_id: q.question_type_id,
                                answer_id: null,
                                answer_text: answerText,
                                selected_answers: null,
                                file_path: null
                            });
                        }
                        break;

                    case 7: // Audio/video answer
                        if (userAnswer && (userAnswer.file_path || userAnswer.answer_id)) {
                            acc.push({
                                question_id: q.id,
                                question_type_id: q.question_type_id,
                                answer_id: userAnswer.answer_id || null,
                                answer_text: null,
                                selected_answers: null,
                                file_path: userAnswer.file_path || null
                            });
                        }
                        break;
                }

                return acc;
            }, [])
        }));

        const filteredParts = formattedParts.filter(part => part.answers.length > 0);
        setAnswers(filteredParts);
    }, [userAnswers, parts, setAnswers]);

    // Таймер
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    // Навигация между частями
    const handlePartChange = (partId) => {
        setActivePart(partId);
    };

    // Подсчет отвеченных вопросов
    const getAnsweredQuestionsCount = (partId) => {
        const part = parts.find(p => p.id === partId);
        if (!part) return 0;
        return part.questions.filter(q => userAnswers[q.id] !== undefined).length;
    };

    // Загрузка данных
    if (!examData) {
        return (
            <div className={`flex items-center justify-center h-64 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#FAFAFA]'}`}>
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Loading data...
                    </p>
                </div>
            </div>
        );
    }

    // Рендер компонента
    return (
        <div className={`min-h-screen Exam__test pt-[90px] p-2 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-[#FAFAFA] text-gray-800'}`}>
            {/* Навигация по частям */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {parts.map((part, index) => {
                        const answeredCount = getAnsweredQuestionsCount(part.id);
                        const totalQuestions = part.questions.length;
                        const isActive = activePart === part.id;

                        return (
                            <button
                                key={part.id}
                                onClick={() => handlePartChange(part.id)}
                                className={`relative px-4 py-3 rounded-lg border transition-all duration-200 font-medium
                                    ${isActive
                                        ? theme === 'dark'
                                            ? 'bg-blue-700 text-white border-blue-600 shadow-md'
                                            : 'bg-blue-600 text-white border-blue-600 shadow-md'
                                        : theme === 'dark'
                                            ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-sm">Part {index + 1}</span>
                                </div>
                                {answeredCount === totalQuestions && totalQuestions > 0 && (
                                    <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Основное содержимое в зависимости от типа секции */}
            {SectionType === 'Reading' ? (
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Левая часть - Текст для чтения */}
                    <div className={`md:w-1/2 rounded-lg shadow-sm overflow-y-auto h-[550px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                Reading Passage
                            </h3>
                            <div
                                className={`prose max-w-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                dangerouslySetInnerHTML={{ __html: currentPart?.rules }}
                            />
                        </div>
                    </div>

                    {/* Правая часть - Вопросы */}
                    <div className={`md:w-1/2 rounded-lg shadow-sm overflow-y-auto h-[550px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        {currentPart?.description && (
                            <div className={`border-b px-6 py-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                <h3
                                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                                    dangerouslySetInnerHTML={{ __html: currentPart.description }}
                                />
                            </div>
                        )}

                        {currentQuestions.length > 0 ? (
                            <div className="p-6 space-y-8">
                                {currentQuestions.map((question) => (
                                    <div
                                        key={question.id}
                                        className={`border-b pb-6 last:border-b-0 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    {userAnswers[question.id] && (
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    )}
                                                </div>
                                                <QuestionRenderer
                                                    question={question}
                                                    onAnswer={(answer) => {
                                                        setUserAnswers(prev => ({
                                                            ...prev,
                                                            [question.id]: answer
                                                        }));
                                                    }}
                                                    userAnswer={userAnswers[question.id]}
                                                    theme={theme}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                No questions in this section
                            </div>
                        )}
                    </div>
                </div>
            ) : SectionType === 'Writing' ? (
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Левая часть - Задание и вопрос */}
                    <div className={`md:w-1/2 rounded-lg shadow-sm overflow-y-auto h-[550px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                Writing Task {parts.findIndex(p => p.id === currentPart.id) + 1}
                            </h3>

                            {/* Отображение вопроса и изображения */}
                            {currentQuestions.length > 0 && (
                                <div className="mb-6">
                                    <div className={`prose max-w-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                        dangerouslySetInnerHTML={{ __html: currentQuestions[0]?.question_text }}
                                    />
                                    {currentQuestions[0]?.image_url && (
                                        <img
                                            src={CONFIG.API_URL + currentQuestions[0].image_url}
                                            alt="Question visual"
                                            className="max-w-[400px] h-auto mt-4 rounded-lg border"
                                        />
                                    )}
                                </div>
                            )}

                            <div className={`prose max-w-none mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                dangerouslySetInnerHTML={{ __html: currentPart?.rules }}
                            />

                            {currentPart?.description && (
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Task Requirements:
                                    </h4>
                                    <div className={`prose max-w-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                        dangerouslySetInnerHTML={{ __html: currentPart.description }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Правая часть - Поле для ввода */}
                    <div className={`md:w-1/2 rounded-lg shadow-sm overflow-y-auto h-[550px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-6">
                            <div className="relative mb-4">
                                <textarea
                                    value={writingTexts[currentPart.id] || ""}
                                    onChange={(e) => handleWritingChange(e, currentPart.id)}
                                    className={`w-full min-h-[400px] p-4 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500'
                                        : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
                                        } focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors`}
                                    placeholder="Write your essay here..."
                                />
                                <label className={`absolute -top-3 left-3 px-1 text-xs ${theme === 'dark'
                                    ? 'bg-gray-800 text-gray-300'
                                    : 'bg-white text-gray-600'
                                    }`}>
                                    Your essay for Part {parts.findIndex(p => p.id === currentPart.id) + 1}
                                </label>
                            </div>

                            <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Word count: <strong>{wordCounts[currentPart.id] || 0}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`rounded-lg shadow-sm border mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {currentPart?.description && (
                        <div className={`border-b px-6 py-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3
                                className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                                dangerouslySetInnerHTML={{ __html: currentPart.description }}
                            />
                        </div>
                    )}

                    {currentQuestions.length > 0 ? (
                        <div className="p-6 space-y-8">
                            {currentQuestions.map((question) => (
                                <div
                                    key={question.id}
                                    className={`border-b pb-6 last:border-b-0 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                {userAnswers[question.id] && (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                )}
                                            </div>
                                            <QuestionRenderer
                                                examResultId={examData?.exam_result?.id}
                                                question={question}
                                                onAnswer={(answer) => {
                                                    setUserAnswers(prev => ({
                                                        ...prev,
                                                        [question.id]: answer
                                                    }));
                                                }}
                                                userAnswer={userAnswers[question.id]}
                                                theme={theme}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            No questions in this section
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}