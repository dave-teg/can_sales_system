import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { MenuOpen, Dashboard, ShoppingCart, Inventory2, Category } from "@mui/icons-material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { blue } from "@mui/material/colors";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const NAVIGATION = [
  {
    text: "Dashboard",
    icon: <Dashboard/>,
    location: "/dashboard",
  },
  {
    text: "Order",
    icon: <ShoppingCart/>,
    location: "/dashboard/order",
  },
  {
    text: "Products",
    icon: <Inventory2/>,
    location: "/dashboard/products",
  },
  {
    text: "Categories",
    icon: <Category/>,
    location: "/dashboard/categories",
  },
]

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
    width: `calc(${theme.spacing(8)} + 1px)`,
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

export default function ClippedMiniDrawer() {
  const [open, setOpen] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const navigate = useNavigate()


  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleListItemClick = (item, index) => {
    setSelectedIndex(index)
    navigate(item.location)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Tooltip title={open ? "Collapse menu" : "Expand menu"}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ marginRight: 5 }}
            >
              {open ? <MenuOpen /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
          <Typography variant="h6" noWrap component="div">
            Clipped Mini Drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <Divider />
        <List>
          {NAVIGATION.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(item, index)}
                sx={{
                  minHeight: 64,
                  px: 2.5,
                  flexDirection: open ? "row" : "column",
                  alignItems: "center",
                  justifyContent: open ? "initial" : "center",
                  textAlign: open ? "initial" : "center",
                  ...(selectedIndex === index && {
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
                    ...(selectedIndex === index && {
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
                      fontSize: open ? "1rem" : "11px",
                    },
                    ...(selectedIndex === index && {
                      color: blue[500],
                    }),
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography paragraph>
          This drawer is clipped under the AppBar and can be toggled open or
          closed.
        </Typography>
        <Typography paragraph>
          You now have a combined version of the Clipped Drawer and Mini Variant
          Drawer.
        </Typography>
      </Box>
    </Box>
  );
}
