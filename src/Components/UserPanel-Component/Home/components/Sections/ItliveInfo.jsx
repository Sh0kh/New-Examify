import React from "react";
import Logo from '../../../../../Images/logo-dark.svg'
import Ovner from '../../../../../Images/Avatar.svg'
export default function ItliveInfo() {
  return (
    <section className=" mx-auto text-center py-16 px-6">
      <div className="container">
        {/* Logo */}
        <div className=" flex justify-center">
          <img
            src={Logo}
            alt="Itlive Logo"
            className="w-24 h-24"
          />
        </div>

        {/* Text */}
        <p className="text-4xl text-gray-900 mt-4 mx-auto">
          Hello, everyone. I'm glad this platform can provide you with the necessary assistance.
        </p>

        {/* CEO Info */}
        <div className="mt-6 flex flex-col items-center">
          <img
            src={Ovner}
            alt="CEO"
            className="w-20 h-20 rounded-full border border-gray-300 shadow-sm"
          />
          <h3 className="text-lg font-semibold mt-3">Abdulla Ergashev</h3>
          <p className="text-gray-500 text-sm">CEO</p>
        </div>
      </div>
    </section>
  );
}
