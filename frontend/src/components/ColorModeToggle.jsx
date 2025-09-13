import {
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { useColorScheme } from "@mui/material/styles";
import { IconButton, Tooltip } from "@mui/material";

const ColorModeToggle = () => {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }


  const toggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <Tooltip title='Toggle Theme'>
      <IconButton color="inherit" onClick={toggleTheme}>
        {mode === "dark" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ColorModeToggle;
