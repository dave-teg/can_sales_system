import { Box, Typography, Grid } from "@mui/material";
import UsersGrid from "./UsersGrid";


const Users = () => {

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Users
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={12}>
          <UsersGrid />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Users;
