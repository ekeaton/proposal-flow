import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
      disabled: "#9CA3AF",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    divider: "#E5E7EB",
  },
  typography: {
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#111827",
          boxShadow: "none",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "1rem",
          paddingTop: "14px",
          paddingBottom: "14px",
          "&:hover": {
            backgroundColor: "#1F2937",
            boxShadow: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#F9FAFB",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#111827",
        },
      },
    },
  },
});

export default theme;
