import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  ListItemIcon,
  Chip,
  Stack,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Person, Logout, ArrowDropDown, Face2 } from "@mui/icons-material";
import ColorModeToggle from "../components/ColorModeToggle";
import { useTheme } from '@mui/material/styles';

const DashboardLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0} sx={{
        borderBottom: isDark ? '1px solid #616161' : '1px solid #e0e0e0',
        backgroundColor:
          isDark ? theme.palette.background.paper : '#f8f8f8',
        color: isDark ? 'white' : 'black',
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: 'primary.main' }}>
            POS System
          </Typography>
          <ColorModeToggle/>
          {/* Account  */}
          <Box onClick={handleAvatarClick} sx={{display: 'flex', gap: 1, mr: 2, cursor: 'pointer'}}>
            <IconButton
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}/>
            </IconButton>
            <Stack >
              <Typography variant="body2">
                Miron Mahmud 
                <ArrowDropDown/>
              </Typography>
              <Typography variant="caption">Cashier</Typography>
             
            </Stack>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleAvatarClose}
            onClick={handleAvatarClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleAvatarClose}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              My account
            </MenuItem>
            <MenuItem onClick={handleAvatarClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DashboardLayout;
