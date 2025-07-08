import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, FileText, CheckCircle, XCircle, AlertCircle, Moon, Sun } from 'lucide-react';
import CONFIG from '../../../../utils/Config';
import parse, { domToReact } from 'html-react-parser';

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
    const handleInputChange = (e) => {
        onAnswer(e.target.value);
    };

    const parsedContent = parse(question.question_text || "", {
        replace: (domNode) => {
            if (domNode.type === "text" && domNode.data.includes("{textinput}")) {
                const parts = domNode.data.split("{textinput}");
                return (
                    <>
                        {parts.map((part, index) => (
                            <span key={index} className={theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}>
                                {part}
                                {index < parts.length - 1 && (
                                    <input
                                        type="text"
                                        value={userAnswer || ""}
                                        onChange={handleInputChange}
                                        className={`inline-block border rounded px-2 py-1 mx-2 ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300'
                                            }`}
                                    />
                                )}
                            </span>
                        ))}
                    </>
                );
            }
        },
    });

    return (
        <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {parsedContent}
            </h3>
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

const SpeakingQuestion = ({ question, onAnswer, userAnswer, theme }) => {
    const [recording, setRecording] = useState(false);

    const handleRecord = () => {
        setRecording(!recording);
        // Implement actual recording logic here
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
                <button
                    onClick={handleRecord}
                    className={`flex items-center px-4 py-2 rounded-md ${recording
                        ? 'bg-red-500 text-white'
                        : theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                >
                    {recording ? (
                        <>
                            <span className="mr-2">To'xtatish</span>
                            <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
                        </>
                    ) : (
                        <span>Javob yozishni boshlash</span>
                    )}
                </button>
                {userAnswer && (
                    <div className={`mt-4 p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>Audio javob yozilgan</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Question type renderer
const QuestionRenderer = ({ question, onAnswer, userAnswer, theme }) => {
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
        />
    );
};

export default function ExamSolutionBody({ examData, setAnswers }) {
    const [activePart, setActivePart] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [theme, setTheme] = useState('light');

    const parts = examData?.section?.parts || [];
    const currentPart = parts.find(part => part.id === activePart);

    const currentQuestions = currentPart?.questions || [];

    const checkAndApplyTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme !== theme) {
            setTheme(currentTheme);
            document.documentElement.classList.toggle('dark', currentTheme === 'dark');
        }
    };

    // Инициализация темы и подписка на изменения
    useEffect(() => {
        // Применяем тему при загрузке
        checkAndApplyTheme();

        // Функция для обработки изменений в localStorage
        const handleStorageChange = () => {
            checkAndApplyTheme();
        };

        // Подписываемся на событие storage
        window.addEventListener('storage', handleStorageChange);

        // Также проверяем тему каждые 500мс на случай, если изменения были в этой же вкладке
        const intervalId = setInterval(checkAndApplyTheme, 500);

        // Очистка при размонтировании
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [theme]); // Добавляем theme в зависимости, чтобы избежать замыкания



    // Initialize active part
    useEffect(() => {
        if (parts.length > 0 && !activePart) {
            setActivePart(parts[0].id);
        }
    }, [parts, activePart]);
    useEffect(() => {
        const formattedParts = parts.map(part => ({
            id: part.id,
            part_type: part.part_type,
            answers: part.questions.map(q => {
                const userAnswer = userAnswers[q.id];
                const questionType = parseInt(q.question_type_id);

                // Базовый объект ответа
                const answerObj = {
                    question_id: q.id,
                    question_type_id: q.question_type_id,
                    answer_id: null,
                    answers: null,
                    file_path: null,
                    answer_text: null
                };

                // Обработка разных типов вопросов
                if ([1, 5].includes(questionType)) {
                    // Для вопросов с одним ответом (типы 1 и 5)
                    if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
                        const numericAnswer = Number(userAnswer);
                        if (!isNaN(numericAnswer)) {
                            answerObj.answer_id = numericAnswer;
                        }
                    }
                }
                else if (questionType === 2) {
                    // Для вопросов с множественным выбором (тип 2) - используем answer_id с массивом
                    if (Array.isArray(userAnswer)) {
                        if (userAnswer.length > 0) {
                            answerObj.answer_id = userAnswer
                                .filter(id => id !== undefined && id !== null && id !== '')
                                .map(id => Number(id))
                                .filter(id => !isNaN(id));
                        } else {
                            answerObj.answer_id = [];
                        }
                    } else if (userAnswer !== undefined && userAnswer !== null) {
                        // Если это не массив, но есть значение - конвертируем в массив
                        const numericAnswer = Number(userAnswer);
                        if (!isNaN(numericAnswer)) {
                            answerObj.answer_id = [numericAnswer];
                        } else {
                            answerObj.answer_id = [];
                        }
                    } else {
                        answerObj.answer_id = [];
                    }
                }
                else if ([3, 4, 6].includes(questionType)) {
                    // Для текстовых ответов
                    if (userAnswer !== undefined && userAnswer !== null) {
                        answerObj.answer_text = String(userAnswer).trim();
                    }
                }
                else if (questionType === 7) {
                    // Для аудиоответов
                    if (userAnswer) {
                        answerObj.file_path = userAnswer.file_path || null;
                        answerObj.answer_text = userAnswer.answer_text || null;
                    }
                }

                return answerObj;
            })
        }));

        console.log('Отправляемые ответы:', formattedParts);
        setAnswers(formattedParts);
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
                        return (
                            <button
                                key={part.id}
                                onClick={() => handlePartChange(part.id)}
                                className={`relative px-4 py-3 rounded-lg border transition-all duration-200 font-medium
                                        ${activePart === part.id
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
            <div className={`rounded-lg shadow-sm border mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                {currentPart?.rules && (
                    <div className={`border-b px-6 py-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <h3
                            className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                                }`}
                            dangerouslySetInnerHTML={{ __html: currentPart.rules }}
                        />
                    </div>
                )}

                {currentQuestions.length > 0 ? (
                    <div className="p-6 space-y-8">
                        {currentQuestions.map((question, index) => (
                            <div
                                key={question.id}
                                className={`border-b pb-6 last:border-b-0 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                                    }`}
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
                    <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        Bu bo'limda savollar mavjud emas
                    </div>
                )}
            </div>
        </div>
    );
}