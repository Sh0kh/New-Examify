import React from "react";
import {
    Headphones,
    Pencil,
    Mic,
    MessageCircle,
    Command,
    List,
} from "lucide-react";

const services = [
    {
        icon: Headphones,
        title: "Listening",
        desc: "Professional and high-quality audio transcripts",
    },
    { icon: Pencil, title: "Writing", desc: "In-depth review of your answers" },
    { icon: Mic, title: "Speaking", desc: "Speaking assistance with AI" },
    {
        icon: MessageCircle,
        title: "Writing Assessment",
        desc: "Evaluation of your writing skills",
    },
    {
        icon: Command,
        title: "Speaking Practice",
        desc: "Get practice for your speaking skills",
    },
    { icon: List, title: "Mock Tests", desc: "Practice with full mock exams" },
];

export default function Service() {
    return (
        <section className="container mx-auto py-16 px-6 text-center mt-[40px]">
            {/* Section Title */}
            <p className="text-blue-600 font-medium">Our services</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                We can offer you several services
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                To date, many of our customers have been satisfied with our services
            </p>

            {/* Services Grid */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300
            hover:shadow-lg hover:scale-105 bg-white border border-gray-200"
                    >
                        <button
                            className="border-2 p-3 rounded-[5px] border-gray-200 transition-all duration-300
  hover:bg-blue-600 hover:border-blue-600 group"
                        >
                            <service.icon className="text-xl text-gray-700 transition-all duration-300 group-hover:text-white" />
                        </button>

                        <h3 className="text-lg font-semibold mt-4">{service.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{service.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
