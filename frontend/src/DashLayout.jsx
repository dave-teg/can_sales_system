// src/Layout.jsx
import {useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Avatar
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import Brightness4Icon from '@mui/icons-material/Brightness4'

const drawerWidth = 240



export default function DashLayout() {
  const theme = useTheme()
  const navigate = useNavigate()

  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(prev => !prev)
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }} >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            My Dashboard App
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <Brightness4Icon />
            </IconButton>
            <Avatar sx={{ bgcolor: 'primary.main' }}>D</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor='left'
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => navigate('/')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => navigate('/orders')}>
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
        </List>
      </Drawer>

      {/* Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
