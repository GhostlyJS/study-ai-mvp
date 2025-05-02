// src/components/NavBar.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };
  
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  const navItems = [
    { text: 'Tableau de bord', path: '/dashboard', icon: <DashboardIcon /> },
    // src/components/NavBar.js (suite)
    { text: 'Ajouter un document', path: '/upload', icon: <AddIcon /> },
  ];
  
  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleMobileDrawer}
      >
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
  
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/dashboard"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1,
            }}
          >
            Study AI
          </Typography>
          
          {!isMobile && (
            <Box sx={{ mr: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{
                    mx: 1,
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          <Box>
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
              edge="end"
            >
              <Avatar
                sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
              >
                {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                component={RouterLink}
                to="/profile"
                onClick={handleProfileMenuClose}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                Mon Profil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {isMobile && renderMobileDrawer()}
    </>
  );
};

export default NavBar;