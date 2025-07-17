import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ReactLoading from 'react-loading';
import PersonFoto from '../../../../../Images/FotoPerson.jpg';
import { $api } from '../../../../../utils';

function Result() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getResult = async () => {
        setLoading(true);
        try {
            const response = await $api.get(`/user/rating`);
            setData(response.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getResult();
    }, []);

    const handleScrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    return (
        <section className='Result pb-[50px] mt-[80px] px-4'>
            <div className='Container'>
                <h2 className="text-2xl sm:text-3xl text-center font-bold text-gray-900">Our Leaderboard</h2>
                <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">Best results of the last 3 months</p>

                <div className='Result__wrapper relative flex items-center flex-col gap-[10px] w-full max-w-[1000px] mt-[20px] mx-auto'>
                    {loading ? (
                        <div className='flex items-center justify-center h-screen'>
                            <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
                        </div>
                    ) : (
                        <>
                            {data.length > 0 ? (
                                data.map((i) => (
                                    <div
                                        key={i.examId || i.id}
                                        className='Result__Card bg-[#0A0D120D] w-full px-4 sm:px-6 py-4 sm:py-5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer transition duration-500 hover:bg-[#0a0d1216]'
                                    >
                                        <div className='flex items-center gap-3 mb-2 sm:mb-0'>
                                            <img className='w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] rounded-full' src={PersonFoto} alt="foto" />
                                            <span className='text-base sm:text-lg font-medium'>{i?.user?.name || "Unknown"}</span>
                                        </div>

                                        <span className='font-semibold text-[#181D27] text-sm sm:text-base mb-1 sm:mb-0'>
                                            Score: {i.score}
                                        </span>

                                        <div className='text-sm sm:text-base font-semibold text-gray-700'>
                                            {formatDateTime(i.created_at)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-center text-gray-500'>No results found.</p>
                            )}

                        </>
                    )}
                    <div className='Result__over'></div>
                </div>

                <NavLink to={`/rating`}>
                    <button
                        onClick={handleScrollUp}
                        className="mt-10 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto block text-sm sm:text-base"
                    >
                        View all results
                    </button>
                </NavLink>
            </div>
        </section>
    );
}

export default Result;
