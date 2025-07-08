import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    SidebarContainer,
    DrawerContent,
    StyledListItem,
} from './components/SidebarStyle';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';

import logo from '../../../Images/examifyNew.png';
import { FindInPage, Key, Money, MoneySharp, Person } from '@mui/icons-material';

const LogoContainer = ({ children }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            mb: 3,
            mt: 2,
        }}
    >
        {children}
    </Box>
);

// Меню для обычных пользователей
const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: `O'quv markaz`, icon: <SchoolIcon />, path: `/o'quv_markazlar` },
    { text: `To'lovlar`, icon: <Money />, path: `/o'quv_markaz/tolovlar` },
    { text: `Moliya`, icon: <DashboardIcon />, path: `/o'quv_markaz/moliya` },
    { text: `Narxlar`, icon: <Money />, path: `/o'quv_markaz/narx` },
    { text: 'Kalit narxi', icon: <DashboardIcon />, path: `/o'quv_markaz/kalit-narxi` },

];

// Меню для ST_ADMIN
const StMenu = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/o'quv_markaz` },
    { text: `Imtihonlar`, icon: <SchoolIcon />, path: `/o'quv_markaz/imtihon` },
    { text: `Imtihon kaliti`, icon: <Key />, path: `/o'quv_markaz/imtihon/kalit` },
    { text: `Reyting`, icon: <Person />, path: `/o'quv_markaz/imtihon/reyting` },
    { text: `Tk Imtihonlar`, icon: < SchoolIcon />, path: `/o'quv_markaz/imtihon/tekshirilmagan_imtihonlar` },
];

const CustomNavLink = React.forwardRef(({ to, icon, label }, ref) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className={({ isActive }) => isActive ? 'active-link' : ''}
        >
            <StyledListItem
                className={isActive ? 'Mui-selected' : ''}
                ref={ref}
            >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
            </StyledListItem>
        </NavLink>
    );
});

export default function SideBar() {
    const role = localStorage.getItem('role');
    const activeMenu = role === 'ST_ADMIN' ? StMenu : menuItems;

    return (
        <SidebarContainer>
            <DrawerContent variant="permanent">
                <LogoContainer>
                    <img src={logo} alt="Логотип" style={{ height: 45 }} />
                </LogoContainer>
                <List sx={{ pt: 0 }}>
                    {activeMenu.map((item, index) => (
                        <CustomNavLink
                            key={index}
                            to={item.path}
                            icon={item.icon}
                            label={item.text}
                        />
                    ))}
                </List>
            </DrawerContent>
        </SidebarContainer>
    );
}
