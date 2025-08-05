// import axios from '../Service/axios';
import React, { useState, useRef, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { fetchData } from '../Redux/MyInformation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { $api } from '../../../utils';
// import { axiosAPI1 } from '../Service/axios'


function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState(Array(6).fill(''));
    const [isSubmitted, setIsSubmitted] = useState(false);


    const inputRefs = useRef([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);



    const handleChange = (e, index) => {
        const inputValue = e.target.value;

        if (inputValue.length <= 1 && /^[0-9]*$/.test(inputValue)) {
            const newValues = [...values];
            newValues[index] = inputValue;
            setValues(newValues);

            if (inputValue && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        } else if (inputValue === '') {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e, index) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').split('').slice(0, 6);
        const newValues = [...values];

        for (let i = 0; i < pasteData.length; i++) {
            if (index + i < newValues.length) {
                newValues[index + i] = pasteData[i].match(/^[0-9]$/) ? pasteData[i] : '';
            }
        }

        setValues(newValues);
        inputRefs.current[Math.min(index + pasteData.length, 5)].focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && values[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    useEffect(() => {
        const auth = async () => {
            try {
                const code = values.join('');
                const data = {
                    code: code
                }
                const response = await $api.post(`/login`, data);
                showSuccessToast();
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refresh_token', response.data?.user?.refresh_token);
                localStorage.setItem('user_id', response?.data?.user?.id)
                navigate('/')
            } catch (error) {
                showErrorToast(error.response?.data?.message || 'Xato!');
            }
        };

        if (values.every(value => value !== '') && !isSubmitted) {
            setIsSubmitted(true);
            auth();
        } else if (values.some(value => value === '')) {
            setIsSubmitted(false);
        }
    }, [values, isSubmitted,]);

    // dispatch

    const showSuccessToast = () => {
        toast.success('To`g`ri!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
                backgroundColor: '#1B2A3D',
                color: 'white'
            }
        });
    };

    const showErrorToast = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
                backgroundColor: '#1B2A3D',
                color: 'white'
            }
        });
    };


    return (
        <div className="Login w-full h-screen flex items-center justify-center bg-white relative">
            <div className="Login__wrapper text-center bg-white rounded-lg shadow-lg p-10">
                <h1 className="font-bold text-3xl text-gray-800 mb-4">Login</h1>
                <p className="text-lg text-gray-600 mb-6 max-w-[470px]">
                    You'll need to go to the {''}
                    <a className="text-blue-500  border-blue-500" href="https://t.me/ExamifyCode_bot" target="_blank" rel="noopener noreferrer">
                        ExamifyCode
                    </a> {''}
                    Telegram bot to get a verification code

                </p>

                <form className="flex items-center justify-center gap-2 mb-6">
                    {values.map((value, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            value={value}
                            onChange={(e) => handleChange(e, index)}
                            onPaste={(e) => handlePaste(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            type="text"
                            placeholder='0'
                            className="py-2 shadow-md text-center text-2xl border-[2px] border-gray-300 rounded-lg w-12 transition duration-300 focus:outline-none focus:border-blue-500"
                            pattern="[0-9]*"
                            maxLength="1"
                            inputMode="numeric"
                        />
                    ))}
                </form>

            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
