import { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  ListItemIcon,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Person,
  Logout,
  ArrowDropDown,
  MenuOpen,
  Dashboard,
  ShoppingCart,
  Inventory2,
  Man,
  Category,
  History,
} from "@mui/icons-material";

import ColorModeToggle from "../components/ColorModeToggle";
import { useTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BreadcrumbsBar from "../components/BreadCrumbs";
import useAuth from "../hooks/useAuth";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(10)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DashboardLayout = () => {
  const { fullname, role, isAdmin } = useAuth();

  const NAVIGATION = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      location: "/dashboard",
    },
    {
      text: "Place Order",
      icon: <ShoppingCart />,
      location: "/dashboard/order/new",
    },
    {
      text: "Order History",
      icon: <History />,
      location: "/dashboard/order",
    },
    {
      text: "Products",
      icon: <Inventory2 />,
      location: "/dashboard/products",
    },
    {
      text: "Categories",
      icon: <Category />,
      location: "/dashboard/categories",
    },
    {
      text: "Waiters",
      icon: <Man/>,
      location: "/dashboard/waiters",
    },
  ];

  if (isAdmin) {
    NAVIGATION.push({
      text: "Users",
      icon: <Person />,
      location: "/dashboard/users",
    });
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation()

  const [sendLogout] = useSendLogoutMutation();

  const accountOpen = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleListItemClick = (item) => {
    navigate(item.location);
  };

  const capitalizeWords = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      navigate("/");
    } catch (err) {
      if (import.meta.env.DEV) {
        console.log(err);
      }
    }
  };

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        open={open}
        elevation={0}
        sx={{
          borderBottom: isDark ? "1px solid #616161" : "1px solid #e0e0e0",
          backgroundColor: isDark ? theme.palette.background.paper : "#f8f8f8",
          color: isDark ? "white" : "black",
        }}
      >
        <Toolbar>
          <Tooltip title={open ? "Collapse menu" : "Expand menu"}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              {open ? <MenuOpen /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600, color: "primary.main" }}
          >
            Can Sales System
          </Typography>
          <ColorModeToggle />
          {/* Account  */}
          <Box
            onClick={handleAvatarClick}
            sx={{ display: "flex", gap: 1, mr: 2, cursor: "pointer" }}
          >
            <IconButton
              size="small"
              sx={{ ml: 2 }}
              aria-controls={accountOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={accountOpen ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }} />
            </IconButton>
            <Stack>
              <Typography variant="body2">
                {fullname && capitalizeWords(fullname)}
                <ArrowDropDown />
              </Typography>
              <Typography variant="caption">
                {role === "user" ? "Cashier" : "Admin"}
              </Typography>
            </Stack>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={accountOpen}
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
            <MenuItem
              onClick={() => {
                handleAvatarClose();
                handleLogout();
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <Divider />
        <List disablePadding>
          {NAVIGATION.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={location.pathname === item.location}
                onClick={() => handleListItemClick(item, index)}
                sx={{
                  minHeight: 52,
                  px: 2.5,
                  flexDirection: open ? "row" : "column",
                  alignItems: "center",
                  justifyContent: open ? "initial" : "center",
                  textAlign: open ? "initial" : "center",
                  ...(location.pathname === item.location && {
                    bgcolor: blue[400],
                    "&:hover": {
                      bgcolor: blue[200],
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    mr: open ? 1.5 : 0,
                    mb: open ? 0 : 0.25,
                    ...(location.pathname === item.location && {
                      color: blue[500],
                    }),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: 1,
                    "& .MuiTypography-root": {
                      fontSize: open ? "15px" : "11px",
                    },
                    ...(location.pathname === item.location && {
                      color: blue[500],
                    }),
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          overflowX: 'hidden',
          px: 3,
          py: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? theme.palette.grey[900] : "#fcfcfc",
        }}
      >
        <DrawerHeader />
        <BreadcrumbsBar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
