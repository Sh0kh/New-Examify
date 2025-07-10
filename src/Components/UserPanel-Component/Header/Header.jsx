import React, { useState } from 'react';
import logo from '../../../Images/examifyNew.png';
import { NavLink } from 'react-router-dom';
import HeaderMenu from './components/HeaderMenu';
import { Spin as Hamburger } from 'hamburger-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchData } from '../../Redux/MyInformation';
import ManualModal from './components/ManualModal';
import PersonFoto from '../../../Images/FotoPerson.jpg'

function Header() {
    const [active, setActive] = useState(false);
    const toggleMenu = () => setActive(!active);
    const closeMenu = () => setActive(false);
    const token = localStorage.getItem('token');
    const [manualModal, setManualModal] = useState(false);





    const handleScrollUp = () => {
        const currentScroll = window.pageYOffset;
        const windowHeight = window.innerHeight;
        window.scrollTo({
            top: currentScroll - windowHeight,
            behavior: 'smooth',
        });
    };


    const openManualModal = () => {
        setManualModal(true);
    };

    const closeManualModal = () => {
        setManualModal(false);
    };

    return (
        <div className='w-full px-4 sm:px-6 flex justify-center '>
            <header className="fixed top-[20px] w-full max-w-[1200px] z-[20] px-4 sm:px-6 py-3 bg-white rounded-xl shadow-md">
                <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-2 sm:gap-[30px]'>
                        <NavLink onClick={handleScrollUp} to={`/`}>
                            <div className="flex items-center gap-2">
                                <img src={logo} alt="Logo" className="w-[100px] sm:w-[121px] h-auto sm:h-[34px]" />
                            </div>
                        </NavLink>
                        <nav className='hidden md:flex items-center gap-[20px] text-[#535862]'>
                            <NavLink onClick={handleScrollUp} to={`/study-center`} className="hover:text-black font-[600]">
                                Study Center
                            </NavLink>
                            {token && (
                                <NavLink onClick={handleScrollUp} to={`/my-result`} className="hover:text-black font-[600]">
                                    My Result
                                </NavLink>
                            )}
                            <NavLink onClick={handleScrollUp} to={`/contact`} className="hover:text-black font-[600]">
                                Contact
                            </NavLink>
                            <NavLink onClick={handleScrollUp} to={`/bonus`} className="hover:text-black font-[600]">
                                Bonus
                            </NavLink>
                            <button
                                onClick={openManualModal}
                                className="hover:text-black font-[600]">
                                Manual
                            </button>
                            <a className='hover:text-black font-[600]' href="https://itliveacademy.uz/" target="_blank" rel="noopener noreferrer">
                                IT LIVE Academy
                            </a>
                        </nav>
                    </div>
                    <div className='flex items-center gap-[5px]'>
                        {token ? (
                            <NavLink to={`/profil`}>
                                <button className='header__login__btn' >
                                    <img className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-[50%] border-[1px] border-[black]' src={PersonFoto} alt="Foto" />
                                </button>
                            </NavLink>
                        ) : (
                            <NavLink onClick={handleScrollUp} to='/login'>
                                <button
                                    className="px-3 py-1 sm:px-4 sm:py-2 text-white bg-[#2970ff] font-[600] normal-case rounded-md"
                                >
                                    Login
                                </button>
                            </NavLink>
                        )}
                        <button onClick={toggleMenu} className='header__burger relative z-20 block md:hidden'>
                            <Hamburger size={24} color={`${active ? 'white' : '#1B2A3D'}`} toggled={active} toggle={setActive} />
                        </button>
                    </div>
                </div>
                <HeaderMenu isOpen={active} onClose={closeMenu} />
                <ManualModal isOpen={manualModal} onClose={closeManualModal} />
            </header>
        </div>
    );
}

export default Header;