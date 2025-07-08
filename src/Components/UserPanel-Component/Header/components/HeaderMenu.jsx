import React, { useState } from 'react'
import logo from '../../../../images/LogoLightMode.png'
import { NavLink } from 'react-router-dom'
// import { useSelector } from 'react-redux';
import ManualModal from './ManualModal';



function HeaderMenu({ isOpen, onClose }) {
    // const { data } = useSelector((state) => state.data)
    const [manualModal, setManualModal] = useState(false);

    const handleScrollUp = () => {
        const currentScroll = window.pageYOffset;
        const windowHeight = window.innerHeight;
        window.scrollTo({
            top: currentScroll - windowHeight,
            behavior: 'smooth',
        });
    };

    const ScrollandClose = () => {
        onClose();
        handleScrollUp();
    }

    const token = localStorage.getItem('token');
    const exit = () => {
        localStorage.clear();
        window.location.reload();
    }


    const openManualModal = () => {
        setManualModal(true); // Открытие модала
    };

    const closeManualModal = () => {
        setManualModal(false); // Закрытие модала
    };


    return (
        <>
            <div className={`HeaderMenuShadow ${isOpen ? 'HeaderMenuShadowActive' : ''}`}>
            </div>
            <div className={`HeaderMenu ${isOpen ? 'HeaderMenuActive' : ''}`}>
                <NavLink onClick={onClose} to='/'>
                    <div className='w-full mb-[30px]'>
                        <img className='w-[150px]' src={logo} alt="Examify Logo" />
                    </div>
                </NavLink>
                <nav className='flex items-start flex-col gap-[20px]'>
                    {/* {token && (
                        <div className=''>
                            <h2 className='font-bold text-[white]'>
                                {data?.name}
                            </h2>
                            <h2 className='text-[white]'>
                                {data?.phoneNumber}
                            </h2>
                            <h3 className='font-bold text-[white]'>
                                IELTS Exam limit: {data?.todayExamCount}
                            </h3>
                            <h3 className='font-bold text-[white]'>
                                Balance: {data?.balance?.toLocaleString("ru-RU")}
                            </h3>
                            <div className='w-full h-[2px] bg-[white] mt-[20px]'></div>
                        </div>
                    )} */}
                    <NavLink onClick={ScrollandClose} to={`/`} className="text-white font-bold text-[20px] transition-all duration-500 hover:tracking-widest">
                        Home
                    </NavLink>
                    <NavLink onClick={ScrollandClose} to={`/multi-level`} className="text-white font-bold text-[20px] transition-all duration-500 hover:tracking-[8px]">
                        CEFR
                    </NavLink>
                    <NavLink onClick={ScrollandClose} to={`/test`} className="text-white font-bold text-[20px] transition-all duration-500 hover:tracking-[8px]">
                        IELTS
                    </NavLink>
                    {token && (
                        <NavLink onClick={ScrollandClose} to={`/myResult`} className="font-bold text-[white] text-[20px] transition-all duration-500 hover:tracking-[10px]">
                            My Result
                        </NavLink>
                    )}
                    <NavLink onClick={ScrollandClose} to={`/contact`} className="text-white font-bold text-[20px] transition-all duration-500 hover:tracking-widest">
                        Contact
                    </NavLink>
                    <NavLink onClick={ScrollandClose} to={`/bonus`} className="font-bold text-[white] text-[20px] transition-all duration-500 hover:tracking-widest">
                        Bonus
                    </NavLink>
                    <button
                        onClick={openManualModal} // Открытие модала
                        className='font-bold text-[20px] transition-all text-[white] duration-500 hover:tracking-widest'>
                        Manual
                    </button>
                    {token ? (
                        <button onClick={exit} className='flex items-center gap-[5px] font-bold text-[20px] text-MainColor border-[3px] border-white pl-[10px] pr-[25px] py-[5px] transition-colors duration-[0.6s] rounded-[8px] bg-white hover:bg-transparent hover:text-white'>
                            Logout
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9m6-9l-4-4m4 4l-4 4m4-4H5"></path>
                            </svg>
                        </button>
                    ) : (
                        <NavLink onClick={ScrollandClose} to={`/login`}>
                            <button className='flex items-center gap-[5px] font-bold text-[20px] text-MainColor border-[3px] border-white pl-[10px] pr-[25px] py-[5px] transition-colors duration-[0.6s] rounded-[8px] bg-white hover:bg-transparent hover:text-white'>
                                Login
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9m6-9l-4-4m4 4l-4 4m4-4H5"></path>
                                </svg>
                            </button>
                        </NavLink>
                    )}
                </nav>
            </div>
            <ManualModal isOpen={manualModal} onClose={closeManualModal} />
        </>
    )
}

export default HeaderMenu;
