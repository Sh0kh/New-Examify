import React from "react";
import { NavLink } from "react-router-dom";

export default function ChatTeam() {
    return (
        <div className="container">
            <div className="bg-gray-100 p-6 rounded-lg text-center mb-[50px]">
                <h3 className="text-lg font-semibold">Still have questions?</h3>
                <p className="text-gray-600 mt-1">
                    Can’t find the answer you’re looking for? Please chat to our friendly team.
                </p>
                <NavLink to={'/contact'}>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                        Get in touch
                    </button>
                </NavLink>
            </div>
        </div>
    );
}
