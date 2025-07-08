import Logo from '../../../Images/LogoLightMode.png'
import { FaInstagram, FaTelegram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 px-4">

                <div className="flex space-x-4">
                    <FaInstagram className="text-xl hover:text-gray-400 transition cursor-pointer" />
                    <a href="https://t.me/mock_examify" target="_blank" rel="noopener noreferrer">
                        <FaTelegram className="text-xl hover:text-gray-400 transition cursor-pointer" />
                    </a>
                    <FaFacebook className="text-xl hover:text-gray-400 transition cursor-pointer" />
                    <FaTwitter className="text-xl hover:text-gray-400 transition cursor-pointer" />
                    <FaLinkedin className="text-xl hover:text-gray-400 transition cursor-pointer" />
                </div>
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img src={Logo} alt="logo" className="" />
                </div>
                {/* Copyright */}
                <p className="text-gray-400 text-sm text-center md:text-right">Examify © 2025.</p>
            </div>
        </footer>
    );
}
