import React from "react";
import { Box, Alert, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Unauthorized = () => {
  return (
    <Box>
      <Alert severity="error">
        <span>You don't have the permission to access this page</span>
        <MuiLink
          component={RouterLink}
          to="/dashboard"
          sx={{
            ml: 1,
          }}
        >
          Go to dashboard
        </MuiLink>
      </Alert>
    </Box>
  );
};

export default Unauthorized;
