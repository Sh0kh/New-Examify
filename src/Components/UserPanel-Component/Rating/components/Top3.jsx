import React from 'react'
import foto3 from '../../../../Images/f3.png'
import foto2 from '../../../../Images/f2.png'
import foto1 from '../../../../Images/f1.png'
function Top3({ data }) {

    console.log(data)

    return (
        <div className='Top3 pt-[30px] pb-[100px]'>
            <div className='container'>
                <div className='Top3__wrapper flex items-start justify-between  gap-[24px] mx-auto'>
                    <div className='Top3__card text-center bg-[#F5F5F5] px-[20px] cursor-pointer border-[#C5C5C5] border-[2px] shadow-sm w-[100%] pb-[20px] rounded-[8px]'>
                        <div className='flex items-center justify-center'>
                            <img src={foto2} alt="" />
                        </div>
                        <h2 className='text-[black] font-bold text-[28px] text-center mt-[10px]'>
                            {data[1]?.user?.name} {' '}  {data[1]?.user?.surname}
                        </h2>
                        <span className='text-[black] block my-[16px]'>
                            {data[1]?.created_at?.split('T')[0]}
                        </span>
                        <h2 className='text-MainColor py-[5px]  bg-white inline-block px-[16px] mt-[10px] mx-auto text-[16px] rounded-[56px]'>
                            Overall:
                            {data[1]?.score}
                        </h2>
                    </div>
                    <div className='Top3__card1 text-center bg-[#F5F5F5] px-[20px] cursor-pointer border-[#C5C5C5] border-[2px] shadow-sm w-[100%] pb-[20px] rounded-[8px]'>
                        <div className='flex items-center justify-center'>
                            <img src={foto1} alt="" />
                        </div>
                        <h2 className='text-[black] font-bold text-[28px] text-center mt-[10px]'>
                            {data[0]?.user?.name} {' '}  {data[0]?.user?.surname}
                        </h2>
                        <span className='text-[black] block my-[16px]'>
                            {data[0]?.created_at?.split('T')[0]}
                        </span>
                        <h2 className='text-MainColor py-[5px]  bg-white inline-block px-[16px] mt-[10px] mx-auto text-[16px] rounded-[56px]'>
                            Overall:
                            {data[0]?.score}
                        </h2>
                    </div>
                    <div className='Top3__card text-center bg-[#F5F5F5] px-[20px] cursor-pointer border-[#C5C5C5] border-[2px] shadow-sm w-[100%] pb-[20px] rounded-[8px]'>
                        <div className='flex items-center justify-center'>
                            <img src={foto3} alt="" />
                        </div>
                        <h2 className='text-[black] font-bold text-[28px] text-center mt-[10px]'>
                            {data[2]?.user?.name} {' '}  {data[2]?.user?.surname}
                        </h2>
                        <span className='text-[black] block my-[16px]'>
                            {data[2]?.created_at?.split('T')[0]}
                        </span>
                        <h2 className='text-MainColor py-[5px]  bg-white inline-block px-[16px] mt-[10px] mx-auto text-[16px] rounded-[56px]'>
                            Overall:
                            {data[2]?.score}
                        </h2>
                    </div>
                </div>
                <div className='Top3__wrapper__mb hidden'>
                    <div className='Top3__card1 text-center bg-[#F5F5F5] px-[20px] cursor-pointer border-[#C5C5C5] border-[2px] shadow-sm w-[100%] pb-[20px] rounded-[8px]'>
                        <div className='flex items-center justify-center'>
                            <img src={foto1} alt="" />
                        </div>
                        <h2 className='text-[black] font-bold text-[28px] text-center mt-[10px]'>
                            {data[0]?.user?.name} {' '}  {data[0]?.user?.surname}
                        </h2>
                        <span className='text-[black] block my-[16px]'>
                            {data[0]?.created_at?.split('T')[0]}
                        </span>
                        <h2 className='text-MainColor py-[5px]  bg-white inline-block px-[16px] mt-[10px] mx-auto text-[16px] rounded-[56px]'>
                            Overall:
                            {data[0]?.score}
                        </h2>
                    </div>
                    <div className='Top3__card text-center bg-[#F5F5F5] px-[20px] cursor-pointer border-[#C5C5C5] border-[2px] shadow-sm w-[100%] pb-[20px] rounded-[8px]'>
                        <div className='flex items-center justify-center'>
                            <img src={foto2} alt="" />
                        </div>
                        <h2 className='text-[black] font-bold text-[28px] text-center mt-[10px]'>
                            {data[1]?.user?.name} {' '}  {data[1]?.user?.surname}
                        </h2>
                        <span className='text-[black] block my-[16px]'>
                            {data[1]?.created_at?.split('T')[0]}
                        </span>
                        <h2 className='text-MainColor py-[5px]  bg-white inline-block px-[16px] mt-[10px] mx-auto text-[16px] rounded-[56px]'>
                            Overall:
                            {data[1]?.score}
                        </h2>
                    </div>
                    <div className='Top3__card text-center bg-[#F5F5F5] px-[20px] cursor-pointer border-[#C5C5C5] border-[2px] shadow-sm w-[100%] pb-[20px] rounded-[8px]'>
                        <div className='flex items-center justify-center'>
                            <img src={foto3} alt="" />
                        </div>
                        <h2 className='text-[black] font-bold text-[28px] text-center mt-[10px]'>
                            {data[2]?.user?.name} {' '}  {data[2]?.user?.surname}
                        </h2>
                        <span className='text-[black] block my-[16px]'>
                            {data[2]?.created_at?.split('T')[0]}
                        </span>
                        <h2 className='text-MainColor py-[5px]  bg-white inline-block px-[16px] mt-[10px] mx-auto text-[16px] rounded-[56px]'>
                            Overall:
                            {data[2]?.score}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Top3