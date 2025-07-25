import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StyledAppBar, NavBarContent, ProfileContainer } from "./components/NavbarStyle";
import Avatar from "@mui/material/Avatar";
import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import { UserCircleIcon, PowerIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    let pathName = location.pathname.split("/").filter(Boolean).pop() || "Home";
    pathName = decodeURIComponent(pathName);
    const cleanedPathName = pathName.replace(/`/g, "'").replace(/_/g, " ");
    const formattedTitle = cleanedPathName.charAt(0).toUpperCase() + cleanedPathName.slice(1);

    const Exit = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <StyledAppBar>
            <NavBarContent>
                {/* Кнопка Назад */}
                <Button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    
                </Button>

                {/* Профиль пользователя с выпадающим меню */}
                <Menu placement="bottom">
                    <MenuHandler>
                        <ProfileContainer className="cursor-pointer">
                            <Avatar
                                alt="A"
                                src="/static/images/avatar/1.jpg"
                                sx={{ width: 36, height: 36 }}
                            />
                        </ProfileContainer>
                    </MenuHandler>
                    <MenuList className="w-48 mt-2 rounded-md shadow-lg bg-[#ffffff] z-50">
                        <MenuItem onClick={() => navigate('/admin/profile')} className="flex items-center gap-2 p-3 hover:bg-gray-100">
                            <UserCircleIcon className="h-5 w-5 text-blue-500" />
                            <span>Profil</span>
                        </MenuItem>
                        <MenuItem onClick={Exit} className="flex items-center gap-2 p-3 hover:bg-red-50 text-red-600">
                            <PowerIcon className="h-5 w-5 text-red-500" />
                            <span>Chiqish</span>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </NavBarContent>
        </StyledAppBar>
    );
}
