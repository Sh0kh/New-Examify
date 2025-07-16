import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, FileText, CheckCircle, XCircle, AlertCircle, Moon, Sun } from 'lucide-react';
import CONFIG from '../../../../../utils/Config';
import parse, { domToReact } from 'html-react-parser';
import { $api } from '../../../../../utils';



export default function MultipleSelectQuestion({ question, onAnswer, userAnswer, theme }) {

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
}