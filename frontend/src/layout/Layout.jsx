import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router";

const defaultTheme = createTheme();

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },

  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: defaultTheme.typography.pxToRem(48),
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: defaultTheme.typography.pxToRem(36),
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: defaultTheme.typography.pxToRem(30),
      lineHeight: 1.2,
    },
    h4: {
      fontSize: defaultTheme.typography.pxToRem(24),
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: defaultTheme.typography.pxToRem(20),
      fontWeight: 600,
    },
    h6: {
      fontSize: defaultTheme.typography.pxToRem(18),
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: defaultTheme.typography.pxToRem(18),
    },
    subtitle2: {
      fontSize: defaultTheme.typography.pxToRem(14),
      fontWeight: 500,
    },
    body1: {
      fontSize: defaultTheme.typography.pxToRem(14),
    },
    body2: {
      fontSize: defaultTheme.typography.pxToRem(14),
      fontWeight: 400,
    },
    caption: {
      fontSize: defaultTheme.typography.pxToRem(12),
      fontWeight: 400,
    },
  },

  shape: {
    borderRadius: 8,
  },
  components: {
    /* MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px",
          "&:last-child": {
            paddingBottom: "16px",
          },
        },
      },
    }, */
    MuiButton: {
      variants: [
        {
          props: { variant: "contrast" },
          style: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.common.black,
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.black
                : theme.palette.common.white,
            boxShadow: "none",
            transition: theme.transitions.create(
              ["background-color", "box-shadow", "transform"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              boxShadow: theme.shadows[4], // Elevation on hover (level 4)
            },
            "&:active": {
              boxShadow: theme.shadows[8], // Deeper shadow when clicked
              transform: "scale(0.98)", // Subtle press effect
            },
            "&.Mui-focusVisible": {
              boxShadow: theme.shadows[6], // Focus state elevation
            },
          }),
        },
      ],
      
    },
  },
});

const Layout = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  );
};

export default Layout;
