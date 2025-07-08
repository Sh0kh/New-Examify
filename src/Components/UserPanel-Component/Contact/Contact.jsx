import React, { useState } from "react";
// import { axiosAPI2 } from "../Service/axios";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";


export default function Contact() {

    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [Email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate('')
    const SendMessage = async (e) => {
        e.preventDefault()
        try {
            const Data = {
                message: message,
                first_name: firstName,
                last_name: lastName,
                email: Email,
                phone_number: phoneNumber
            }
            await axiosAPI2.post('/user/send-message', Data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            setEmail('')
            setFirstName('')
            setLastName('')
            setMessage('')
            setPhoneNumber('')
            Swal.fire({
                title: 'Successful!',
                icon: 'success',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
        } catch (error) {
            if (error.status === 401) {
                navigate('/')
                localStorage.clear()
            }
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Error.',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
        }
    }

    return (
        <>
            <Header />
            <main>
                <section className="mt-[200px] mb-[50px]">
                    <div className="container">
                        {/* Contact Info */}
                        <div className="text-center">
                            <h2 className="text-blue-600 font-semibold">Contact us</h2>
                            <h1 className="text-3xl font-bold mt-2">We’d love to hear from you</h1>
                            <p className="text-gray-600 mt-2">Our friendly team is always here to chat.</p>
                        </div>
                        <div className="flex flex-wrap justify-around gap-10 mt-8">
                            <div className="text-center">
                                <div className="p-[12px] rounded-[50%] bg-[#F5F5F5] w-[48px] mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" stroke="#155EEF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold my-[20px]">Email</h3>
                                <p className="text-gray-600">info@examify.uz</p>
                            </div>
                            <div className="text-center">
                                <div className="p-[12px] rounded-[50%] bg-[#F5F5F5] w-[48px] mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 12.5C13.6569 12.5 15 11.1569 15 9.5C15 7.84315 13.6569 6.5 12 6.5C10.3431 6.5 9 7.84315 9 9.5C9 11.1569 10.3431 12.5 12 12.5Z" stroke="#155EEF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z" stroke="#155EEF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold my-[20px]">Office</h3>
                                <p className="text-gray-600">
                                    Gulistan city, Saihun street, building 28B, <br /> 2nd floor
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="p-[12px] rounded-[50%] bg-[#F5F5F5] w-[48px] mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M8.38028 8.85323C9.07627 10.3028 10.0251 11.6615 11.2266 12.8631C12.4282 14.0646 13.7869 15.0134 15.2365 15.7094C15.3612 15.7693 15.4235 15.7992 15.5024 15.8222C15.7828 15.904 16.127 15.8453 16.3644 15.6752C16.4313 15.6274 16.4884 15.5702 16.6027 15.4559C16.9523 15.1063 17.1271 14.9315 17.3029 14.8172C17.9658 14.3862 18.8204 14.3862 19.4833 14.8172C19.6591 14.9315 19.8339 15.1063 20.1835 15.4559L20.3783 15.6508C20.9098 16.1822 21.1755 16.448 21.3198 16.7333C21.6069 17.3009 21.6069 17.9712 21.3198 18.5387C21.1755 18.8241 20.9098 19.0898 20.3783 19.6213L20.2207 19.7789C19.6911 20.3085 19.4263 20.5733 19.0662 20.7756C18.6667 21 18.0462 21.1614 17.588 21.16C17.1751 21.1588 16.8928 21.0787 16.3284 20.9185C13.295 20.0575 10.4326 18.433 8.04466 16.045C5.65668 13.6571 4.03221 10.7947 3.17124 7.76131C3.01103 7.19687 2.93092 6.91464 2.9297 6.5017C2.92833 6.04347 3.08969 5.42298 3.31411 5.02348C3.51636 4.66345 3.78117 4.39863 4.3108 3.86901L4.46843 3.71138C4.99987 3.17993 5.2656 2.91421 5.55098 2.76987C6.11854 2.4828 6.7888 2.4828 7.35636 2.76987C7.64174 2.91421 7.90747 3.17993 8.43891 3.71138L8.63378 3.90625C8.98338 4.25585 9.15819 4.43065 9.27247 4.60643C9.70347 5.26932 9.70347 6.1239 9.27247 6.78679C9.15819 6.96257 8.98338 7.13738 8.63378 7.48698C8.51947 7.60129 8.46231 7.65845 8.41447 7.72526C8.24446 7.96269 8.18576 8.30695 8.26748 8.5873C8.29048 8.6662 8.32041 8.72854 8.38028 8.85323Z" stroke="#155EEF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold my-[20px]">Phone</h3>
                                <a className="text-gray-600" href="tel:+998 88 266 99 66">+998 88 266 99 66</a>
                            </div>
                        </div>
                        {/* Contact Form */}
                        <div className="mt-[120px] text-center">
                            <h2 className="text-blue-600 font-semibold">Contact us</h2>
                            <h1 className="text-2xl font-bold mt-2">Get in touch</h1>
                            <p className="text-gray-600 mt-2">We’d love to hear from you. Please fill out this form.</p>

                            <form onSubmit={SendMessage} className="mt-8 space-y-4 max-w-lg mx-auto">
                                <div className="flex gap-4">
                                    <input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        type="text" placeholder="First name" className="border p-2 w-1/2 rounded" required />
                                    <input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        type="text" placeholder="Last name" className="border p-2 w-1/2 rounded" required />
                                </div>
                                <input
                                    value={Email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email" placeholder="Email" className="border p-2 w-full rounded" required />
                                <input
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    type="tel" placeholder="Phone number" className="border p-2 w-full rounded" />
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Leave us a message..." className="border p-2 w-full h-28 rounded" required></textarea>

                                <div className="flex items-center justify-start">
                                    <input type="checkbox" id="privacy" className="mr-2" required />
                                    <label htmlFor="privacy" className="text-gray-600 text-sm">
                                        You agree to our friendly <a href="https://itliveacademy.uz/" className="text-blue-600 underline">privacy policy</a>.
                                    </label>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                    Send message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
