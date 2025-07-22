import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, FileText, CheckCircle, XCircle, AlertCircle, Moon, Sun } from 'lucide-react';
import CONFIG from '../../../../utils/Config';
import parse, { domToReact } from 'html-react-parser';
import { $api } from '../../../../utils';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button
} from "@material-tailwind/react";
import QuestionRenderer from './QuestionType/QuestionRenderer';
import SelectableText from './SelectText';




export default function ExamSolutionBody({ examData, setAnswers }) {
    const [userAnswers, setUserAnswers] = useState({});
    const [activePart, setActivePart] = useState(() => {
        const savedPart = localStorage.getItem('lastActivePart');
        return savedPart || null;
    });
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [theme, setTheme] = useState('light');
    const [writingTexts, setWritingTexts] = useState({});
    const [wordCounts, setWordCounts] = useState({});
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState("");

    const SectionType = examData?.next_section?.type;
    const parts = examData?.section?.parts || examData?.next_section?.parts || [];
    const currentPart = parts.find(part => part.id === activePart) || parts[0];
    const currentQuestions = currentPart?.questions || [];

    const openImageModal = (url) => {
        setModalImageUrl(url);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setModalImageUrl("");
    };

    useEffect(() => {
        const disableContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        document.addEventListener('contextmenu', disableContextMenu);
        return () => document.removeEventListener('contextmenu', disableContextMenu);
    }, []);

    useEffect(() => {
        if (parts.length > 0) {
            const savedPart = localStorage.getItem('lastActivePart');
            const isValidPart = savedPart && parts.some(p => p.id === savedPart);

            if (!activePart || !isValidPart) {
                const newActivePart = isValidPart ? savedPart : parts[0].id;
                setActivePart(newActivePart);
                localStorage.setItem('lastActivePart', newActivePart);
            }

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
    }, [parts]);

    const handleWritingChange = (e, partId) => {
        const text = e.target.value;
        setWritingTexts(prev => ({ ...prev, [partId]: text }));

        const words = text.trim() ? text.trim().split(/\s+/) : [];
        setWordCounts(prev => ({ ...prev, [partId]: words.length }));

        const question = parts.find(p => p.id === partId)?.questions?.[0];
        if (question) {
            setUserAnswers(prev => ({ ...prev, [question.id]: text }));
        }
    };

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

    const formattedParts = useMemo(() => {
        const result = parts.map(part => ({
            id: part.id,
            part_type: part.part_type,
            answers: part.questions.flatMap(q => {
                const userAnswer = userAnswers[q.id];
                const questionType = parseInt(q.question_type_id);

                if (questionType === 7) {
                    return [{
                        question_id: q.id,
                        question_type_id: q.question_type_id,
                        answer_id: userAnswer?.answer_id || null,
                        answer_text: userAnswer?.file_path ? null : "unanswered",
                        selected_answers: null,
                        file_path: userAnswer?.file_path || null
                    }];
                }

                switch (questionType) {
                    case 1: case 5:
                        if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '' && !isNaN(Number(userAnswer))) {
                            return [{
                                question_id: q.id,
                                question_type_id: q.question_type_id,
                                answer_id: Number(userAnswer),
                                answer_text: null,
                                selected_answers: null,
                                file_path: null
                            }];
                        }
                        break;

                    case 2:
                        if (Array.isArray(userAnswer)) {
                            const validAnswers = userAnswer
                                .filter(id => id !== undefined && id !== null && id !== '')
                                .map(Number)
                                .filter(id => !isNaN(id));

                            if (validAnswers.length > 0) {
                                return [{
                                    question_id: q.id,
                                    question_type_id: q.question_type_id,
                                    answer_id: null,
                                    answer_text: null,
                                    selected_answers: validAnswers,
                                    file_path: null
                                }];
                            }
                        }
                        break;

                    case 3: case 4:
                        if (Array.isArray(userAnswer)) {
                            return userAnswer
                                .map(answer => String(answer).trim())
                                .filter(answerText => answerText !== '')
                                .map(answerText => ({
                                    question_id: q.id,
                                    question_type_id: q.question_type_id,
                                    answer_id: null,
                                    answer_text: answerText,
                                    selected_answers: null,
                                    file_path: null
                                }));
                        }
                        break;

                    case 6:
                        const answerText = String(userAnswer || '').trim();
                        return [{
                            question_id: q.id,
                            question_type_id: q.question_type_id,
                            answer_id: null,
                            answer_text: answerText,
                            selected_answers: null,
                            file_path: null
                        }];
                }

                return [];
            }).filter(answer => answer !== null)
        }));

        return result.filter(part => part.answers.length > 0);
    }, [parts, userAnswers]);

    const updateAnswers = useCallback((newAnswers) => {
        setAnswers(newAnswers);
    }, []);

    useEffect(() => {
        if (formattedParts.length > 0) {
            updateAnswers(formattedParts);
        }
    }, [formattedParts, updateAnswers]);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    useEffect(() => {
        if (parts.length > 0 && activePart === null) {
            setActivePart(parts[0].id);
        }
    }, [parts, activePart]);

    const handlePartChange = (partId) => {
        setActivePart(partId);
        localStorage.setItem('lastActivePart', partId);
    };

    useEffect(() => {
        return () => {
            localStorage.removeItem('lastActivePart');
        };
    }, []);

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
                        Loading data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen Exam__test pt-[90px] p-2 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-[#FAFAFA] text-gray-800'}`}>
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {parts.length > 0 && parts.map((part, index) => {
                        const answeredCount = getAnsweredQuestionsCount(part.id);
                        const totalQuestions = part.questions.length;
                        const isActive = activePart === part.id || (index === 0 && activePart === null);

                        return (
                            <button
                                key={part.id}
                                onClick={() => handlePartChange(part.id)}
                                onContextMenu={(e) => e.preventDefault()}
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

            {SectionType === 'Reading' ? (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className={`md:w-1/2 rounded-lg shadow-sm overflow-y-auto h-[680px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                Reading Passage
                            </h3>
                            <SelectableText theme={theme}>
                                <div
                                    className={`prose max-w-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                    dangerouslySetInnerHTML={{ __html: currentPart?.rules }}
                                />
                            </SelectableText>
                        </div>
                    </div>

                    <div className={`md:w-1/2 rounded-lg shadow-sm overflow-y-auto h-[680px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        {currentPart?.description && (
                            <div className={`border-b px-6 py-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                <SelectableText theme={theme}>
                                    <h3
                                        className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                                        dangerouslySetInnerHTML={{ __html: currentPart.description }}
                                    />
                                </SelectableText>
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
                    <div className={`md:w-1/2 rounded-lg shadow-sm overflow-y-auto h-[680px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-6">
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                Writing Task {parts.findIndex(p => p.id === currentPart.id) + 1}
                            </h3>

                            {currentQuestions.length > 0 && (
                                <div className="mb-6">
                                    <SelectableText theme={theme}>
                                        <div className={`prose max-w-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                            dangerouslySetInnerHTML={{ __html: currentQuestions[0]?.question_text }}
                                        />
                                    </SelectableText>
                                    {currentQuestions[0]?.image_url && (
                                        <img
                                            src={CONFIG.API_URL + currentQuestions[0].image_url}
                                            alt="Question visual"
                                            className="max-w-[400px] h-auto mt-4 rounded-lg border cursor-pointer hover:opacity-90 transition"
                                            onClick={() => openImageModal(CONFIG.API_URL + currentQuestions[0].image_url)}
                                            onContextMenu={(e) => e.preventDefault()}
                                        />
                                    )}
                                    <Dialog open={isImageModalOpen} handler={closeImageModal} size="xl">
                                        <DialogBody className="p-4 flex items-center justify-center bg-black">
                                            <img
                                                src={modalImageUrl}
                                                alt="Full view"
                                                className="max-h-[80vh] w-auto rounded-lg"
                                            />
                                        </DialogBody>
                                    </Dialog>
                                </div>
                            )}

                            <SelectableText theme={theme}>
                                <div className={`prose max-w-none mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                    dangerouslySetInnerHTML={{ __html: currentPart?.rules }}
                                />
                            </SelectableText>

                            {currentPart?.description && (
                                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Task Requirements:
                                    </h4>
                                    <SelectableText theme={theme}>
                                        <div className={`prose max-w-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                            dangerouslySetInnerHTML={{ __html: currentPart.description }}
                                        />
                                    </SelectableText>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`md:w-1/2 rounded-lg shadow-sm overflow-y-auto h-[680px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="p-6">
                            <div className="relative mb-4">
                                <textarea
                                    spellCheck={false}
                                    value={writingTexts[currentPart.id] || ""}
                                    onChange={(e) => handleWritingChange(e, currentPart.id)}
                                    onContextMenu={(e) => e.preventDefault()}
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
                            <SelectableText theme={theme}>
                                <h3
                                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                                    dangerouslySetInnerHTML={{ __html: currentPart.description }}
                                />
                            </SelectableText>
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