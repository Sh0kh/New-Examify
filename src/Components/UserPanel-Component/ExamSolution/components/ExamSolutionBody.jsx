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

    // Таймер записи
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
                console.error("Mikrofon ruxsati rad etildi:", error);
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
                                To'xtatish
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                Javob yozishni boshlash
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
                            Audio yuklanmoqda...
                        </span>
                    </div>
                )}

                {userAnswer && !uploading && (
                    <div className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/30 border border-green-800' : 'bg-green-100 border border-green-200'}`}>
                        <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={theme === 'dark' ? 'text-green-300' : 'text-green-700'}>
                            Audio javob muvaffaqiyatli yuklandi
                        </span>
                        <button
                            onClick={handleRecord}
                            className="ml-auto text-sm px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Qayta yozish
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

export default function ExamSolutionBody({ examData, setAnswers }) {
    const [activePart, setActivePart] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [theme, setTheme] = useState('light');
    const SectionType = examData?.next_section?.type;


    const parts = examData?.section?.parts || examData?.next_section?.parts || [];
    const currentPart = parts.find(part => part.id === activePart) || parts[0];
    const currentQuestions = currentPart?.questions || [];

    // Инициализация активной части после загрузки данных
    useEffect(() => {
        if (parts.length > 0 && !activePart) {
            setActivePart(parts[0].id);
        }
    }, [parts, activePart]); // Добавляем activePart в зависимости

    const checkAndApplyTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme !== theme) {
            setTheme(currentTheme);
            document.documentElement.classList.toggle('dark', currentTheme === 'dark');
        }
    };

    useEffect(() => {
        checkAndApplyTheme();
        const handleStorageChange = () => {
            checkAndApplyTheme();
        };
        window.addEventListener('storage', handleStorageChange);
        const intervalId = setInterval(checkAndApplyTheme, 500);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [theme]);

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

                if (questionType === 4) {
                    if (Array.isArray(userAnswer)) {
                        userAnswer.forEach((answer, index) => {
                            if (answer !== undefined && answer !== null && answer.trim() !== '') {
                                acc.push({
                                    question_id: q.id,
                                    question_type_id: q.question_type_id,
                                    answer_id: null,
                                    answers: null,
                                    file_path: null,
                                    answer_text: answer.trim(),
                                    field_index: index
                                });
                            }
                        });
                    } else if (userAnswer !== undefined && userAnswer !== null && userAnswer.trim() !== '') {
                        acc.push({
                            question_id: q.id,
                            question_type_id: q.question_type_id,
                            answer_id: null,
                            answers: null,
                            file_path: null,
                            answer_text: String(userAnswer).trim(),
                            field_index: 0
                        });
                    }
                } else {
                    const answerObj = {
                        question_id: q.id,
                        question_type_id: q.question_type_id,
                        answer_id: null,
                        answers: null,
                        file_path: null,
                        answer_text: null
                    };

                    let hasAnswer = false;

                    if ([1, 5].includes(questionType)) {
                        if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
                            const numericAnswer = Number(userAnswer);
                            if (!isNaN(numericAnswer)) {
                                answerObj.answer_id = numericAnswer;
                                hasAnswer = true;
                            }
                        }
                    }
                    else if (questionType === 2) {
                        if (Array.isArray(userAnswer)) {
                            const validAnswers = userAnswer
                                .filter(id => id !== undefined && id !== null && id !== '')
                                .map(id => Number(id))
                                .filter(id => !isNaN(id));

                            if (validAnswers.length > 0) {
                                answerObj.selected_answers = validAnswers;
                                hasAnswer = true;
                            }
                        } else if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
                            const numericAnswer = Number(userAnswer);
                            if (!isNaN(numericAnswer)) {
                                answerObj.selected_answers = [numericAnswer];
                                hasAnswer = true;
                            }
                        }
                    }
                    else if ([3, 6].includes(questionType)) {
                        if (userAnswer !== undefined && userAnswer !== null && userAnswer.trim() !== '') {
                            answerObj.answer_text = String(userAnswer).trim();
                            hasAnswer = true;
                        }
                    }
                    else if (questionType === 7) {
                        if (userAnswer && (userAnswer.file_path || userAnswer.answer_id)) {
                            const answerObj = {
                                question_id: q.id,
                                question_type_id: q.question_type_id,
                                answer_id: userAnswer.answer_id || null, // Используем answer_id из ответа
                                answers: null,
                                file_path: userAnswer.file_path || null,
                                answer_text: null
                            };
                            acc.push(answerObj);
                        }
                    }
                    if (hasAnswer) {
                        acc.push(answerObj);
                    }
                }

                return acc;
            }, [])
        }));

        const filteredParts = formattedParts.filter(part => part.answers.length > 0);
        setAnswers(filteredParts);
    }, [userAnswers, parts, setAnswers]);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    const handlePartChange = (partId) => {
        setActivePart(partId);
    };

    const getAnsweredQuestionsCount = (partId) => {
        const part = parts.find(p => p.id === partId);
        if (!part) return 0;
        return part.questions.filter(q => userAnswers[q.id] !== undefined).length;
    };

    if (!examData) {
        return (
            <div className={`flex items-center justify-center h-64 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#FAFAFA]'}`}>
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Ma'lumotlar yuklanmoqda...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-[#FAFAFA] text-gray-800'}`}>
            {/* Part navigation */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {parts.map((part, index) => {
                        const answeredCount = getAnsweredQuestionsCount(part.id);
                        const totalQuestions = part.questions.length;
                        // Исправляем логику определения активной части
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

            {/* Main content */}
            {SectionType === 'Reading' ? (
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side - Reading text */}
                    <div className={`md:w-1/2 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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

                    {/* Right side - Questions */}
                    <div className={`md:w-1/2 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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
                                {currentQuestions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className={`border-b pb-6 last:border-b-0 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                                    ${userAnswers[question.id]
                                                    ? theme === 'dark'
                                                        ? 'bg-green-900 text-green-200'
                                                        : 'bg-green-100 text-green-700'
                                                    : theme === 'dark'
                                                        ? 'bg-gray-700 text-gray-300'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {index + 1}
                                            </div>
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
                                Bu bo'limda savollar mavjud emas
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className={`rounded-lg shadow-sm border mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {currentPart?.rules && (
                        <div className={`border-b px-6 py-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3
                                className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                                dangerouslySetInnerHTML={{ __html: currentPart.rules }}
                            />
                        </div>
                    )}

                    {currentQuestions.length > 0 ? (
                        <div className="p-6 space-y-8">
                            {currentQuestions.map((question, index) => (
                                <div
                                    key={question.id}
                                    className={`border-b pb-6 last:border-b-0 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                                ${userAnswers[question.id]
                                                ? theme === 'dark'
                                                    ? 'bg-green-900 text-green-200'
                                                    : 'bg-green-100 text-green-700'
                                                : theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {index + 1}
                                        </div>
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
                            Bu bo'limda savollar mavjud emas
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}