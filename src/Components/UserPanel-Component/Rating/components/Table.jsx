import React from 'react'
import PersonFoto from '@/Images/FotoPerson.jpg'
import CONFIG from '../../../../utils/Config'

function Table({ data }) {

    return (
        <div className='RatingTable pb-[80px]'>
            <div className='container'>
                <div className='Result__wrapper relative flex items-center flex-col gap-[10px] mt-[20px] mx-auto'>
                    <>
                        {data.length > 0 ? (
                            data.map((i, index) => (
                                <div
                                    key={i.examId} // Use a unique key to avoid duplicates
                                    className='Result__Card bg-[#0A0D120D] w-full px-[24px] py-[16px] rounded-[8px] flex items-center justify-between cursor-pointer transition duration-500 hover:bg-[#0a0d1216]'
                                >
                                    <div className='flex items-center gap-[5px]'>
                                        <div>
                                            <img className='w-[40px] sm:w-[50px] h-[40px] object-cover sm:h-[50px] rounded-full' src={ i?.user?.photo ? CONFIG?.API_URL + i?.user?.photo : PersonFoto} alt="foto" />
                                        </div>
                                        <span className='text-[18px] font-semibold w-[300px]'>{i?.user?.name || "Unknown"} {i?.user?.surname || "Unknown"}</span>
                                    </div>
                                    <span className='font-semibold text-[#181D27]'>
                                        Score: {i.score}
                                    </span>
                                    <div className='flex items-center gap-[5px] font-semibold'>
                                        <span >{i.created_at.split('T')[0]}</span>
                                        <span >
                                            {i.created_at.slice(11, 16)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No results found.</p>
                        )}
                    </>
                    <div className='Result__over'></div>
                </div>
            </div>
        </div>
    )
}

export default Table