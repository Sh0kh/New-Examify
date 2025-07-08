// src/components/NavBar/NavBar.styles.ts
import { styled } from '@mui/material/styles';
import { MenuList, MenuItem } from '@material-tailwind/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'transparent',
    boxShadow: 'none',
    position: 'sticky',
    zIndex: theme.zIndex.drawer + 1,
    padding: theme.spacing(0.5, 2),
    '& .MuiToolbar-root': {
        borderRadius: theme.shape.borderRadius * 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        backgroundImage: theme.palette.mode === 'dark'
            ? 'none'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(240, 240, 255, 0.6))',
        backdropFilter: theme.palette.mode === 'dark' ? 'none' : 'blur(10px)',
        minHeight: 64,
    },
}));

export const NavBarContent = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: 64,
    marginTop: theme.spacing(1.25),
}));

export const ProfileContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

export const UserInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: theme.spacing(1),
}));

export const StyledMenuList = styled(MenuList)(({ theme }) => {
    return {
        width: '12rem',
        mt: 2,
        borderRadius: '0.375rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
        backgroundImage:
            theme.palette.mode === 'dark'
                ? 'none'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(240, 240, 255, 0.6))',
        backdropFilter: 'blur(8px)',
        zIndex: 1300,
    };
});
