import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';

export const drawerWidth = 260;

export const SidebarContainer = styled('nav')(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    position: 'fixed',
    top: '5%',
    left: 0,
    height: '100%',
}));

export const DrawerContent = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        padding: theme.spacing(2),
        borderRadius: '16px',
        margin: theme.spacing(2),
        marginTop: '15px',
        marginBottom: '16px',
        backgroundColor: theme.palette.mode === 'dark'
            ? '#1e1e2f'
            : 'linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%)',
        backgroundImage: theme.palette.mode === 'dark'
            ? 'none'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(240, 240, 255, 0.6))',
        backdropFilter: theme.palette.mode === 'dark' ? 'none' : 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: 'none',
        overflowX: 'hidden',
        transition: 'all 0.3s ease-in-out',
        height: '100%',
        maxHeight: '95%',
    },
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: '12px',
    marginBottom: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.primary.main,
        },
    },
    '&.Mui-selected:hover': {
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.1)',
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.text.secondary,
        minWidth: '40px',
    },
    '& .MuiListItemText-primary': {
        fontWeight: 600,
        color: theme.palette.text.primary,
    },
}));