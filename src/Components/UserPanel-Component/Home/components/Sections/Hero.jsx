import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Hero() {
    return (
        <div className="Hero mx-auto flex flex-col items-center text-center py-16 px-6 pt-[200px] pb-[100px]">
            <NavLink to={'/multi-level'} className="hidden sm:flex">
                <div className="flex items-center space-x-4 cursor-pointer shadow-sm p-[4px] border border-[#D5D7DA] rounded-lg">
                    <div className="flex items-center space-x-2 border border-[#D5D7DA] px-[8px] py-[2px] rounded-[5px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                            <circle cx="6.5" cy="6" r="4.5" fill="#2970FF" stroke="#D1E0FF" strokeWidth="3" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800">New feature</span>
                    </div>
                    <div className="flex items-center gap-[5px]">
                        <span className="text-sm text-gray-600 font-medium">CEFR level can also be determined</span>
                        <svg className="mb-[3px]" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <path d="M3.8335 8H13.1668M13.1668 8L8.50016 3.33333M13.1668 8L8.50016 12.6667" stroke="#717680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </NavLink>

            {/* Title */}
            <h1 className="text-[36px] sm:text-[48px] md:text-[60px] font-bold text-gray-900 leading-tight">
                Examify to find out your <br />
                <span className="text-blue-600">IELTS</span> and <span className="text-red-600">CEFR</span> levels
            </h1>

            {/* Description */}
            <p className="mt-4 text-[16px] sm:text-[18px] md:text-[20px] text-gray-600 max-w-[768px]">
                This project will perform a very necessary task for you. Try testing
                yourself with the help of artificial intelligence.
            </p>

            {/* Call to Action Button */}
            <Link to="/test" className="mt-6">
                <button className="px-6 py-3 bg-primary normal-case bg-[#2563EB] text-white rounded-lg text-lg font-medium transition hover:bg-blue-700">
                    Try now
                </button>
            </Link>
        </div>
    );
}
