// src/components/CustomButton.js
import { Button } from '@mui/material';

const CustomButton = ({ 
  children, 
  startIcon,
  sx = {},
  ...props 
}) => (
  <Button
    variant="contained"
    startIcon={startIcon}
    sx={{
      backgroundColor: (theme) => 
        theme.palette.mode === 'dark' ? 'common.white' : 'common.black',
      color: (theme) => 
        theme.palette.mode === 'dark' ? 'common.black' : 'common.white',
      '&:hover': {
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900',
      },
      boxShadow: 'none',
      '&:active': { boxShadow: 'none' },
      transition: 'background-color 0.2s ease',
      ...sx,// Merge any additional sx props
    }}
    {...props} // Spread all other props
  >
    {children}
  </Button>
);

export default CustomButton;