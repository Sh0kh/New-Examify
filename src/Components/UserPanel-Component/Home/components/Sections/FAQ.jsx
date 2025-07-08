import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";

const faqData = [
    {
        question: "How closely does your mock exam resemble the actual IELTS test?",
        answer:
            "Our mock exam is designed to mimic the actual IELTS test as closely as possible. From the format and structure to the types of questions, we strive to provide an authentic experience. This means you’ll encounter a variety of tasks that reflect what you’ll face on test day, helping you become familiar with the exam’s nuances!",
    },
    {
        question: "Are there separate mock exams for Academic and General Training modules?",
        answer: "Yes, we offer separate mock exams tailored to both Academic and General Training modules.",
    },
    {
        question: "How long does it take to receive my results after completing the mock exam?",
        answer: "Results are typically available within 48 hours after completing the mock exam.",
    },
    {
        question: "Can I take the mock exam multiple times?",
        answer: "Yes, you can take the mock exam multiple times to track your progress.",
    },
    {
        question: "Is there a time limit for each section of the mock exam, similar to the real IELTS test?",
        answer: "Yes, each section of our mock exam follows the same time constraints as the real IELTS test.",
    },
    {
        question: "Do you provide detailed feedback on my performance, especially for the Writing and Speaking sections?",
        answer: "Yes, we provide detailed feedback on your Writing and Speaking sections to help you improve.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqData.map((faq, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="flex justify-between w-full text-left px-4 py-3  hover:bg-gray-200 transition-colors duration-500"
                        >
                            <span className="text-lg font-medium">{faq.question}</span>
                            <span>
                                {openIndex === index ? (
                                    <CiCircleMinus className="text-xl font-black mx-3" />
                                ) : (
                                    <CiCirclePlus className="text-xl font-black mx-3" />
                                )}
                            </span>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <p className="px-4 py-3 text-gray-700">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}