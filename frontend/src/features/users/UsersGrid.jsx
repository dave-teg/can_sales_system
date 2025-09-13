import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useGetAllUsersQuery } from "./userApiSlice";
// import { useDeactivateUsrMutation } from "./userApiSlice";


function renderRole(role) {
  const colors = {
    admin: "success",
    user: "default",
  };
  const label = {
    admin: "Admin",
    user: "Cashier",
  };

  return (
    <Chip
      label={label[role]}
      color={colors[role]}
      size="small"
      sx={{
        height: "15px",
        fontSize: "0.75rem",
        padding: "0 8px",
        "& .MuiChip-label": {
          padding: "0 2px",
        },
      }}
    />
  );
}

function renderStatus(active) {
  const colors = {
    true: "success",
    false: "error",
  };
  const label = {
    true: "Active",
    false: "Inactive",
  };

  return (
    <Chip
      label={label[active]}
      color={colors[active]}
      size="small"
      sx={{
        height: "15px",
        fontSize: "0.75rem",
        padding: "0 8px",
        "& .MuiChip-label": {
          padding: "0 2px",
        },
      }}
    />
  );
}

const capitalizeWords = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


const UsersGrid = () => {
  const { data: userRows, isLoading } = useGetAllUsersQuery();
  // const [deactivateUser] = useDeactivateUsrMutation()

  const navigate = useNavigate();
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [selectedId, setSelectedId] = useState(null);

  const editUser = useCallback(
    (id) => () => {
      navigate(`/dashboard/users/${id}`);
    },
    [navigate]
  );

/*   const handleDeleteClick = useCallback(
    (id) => () => {
      setSelectedId(id);
      setDialogOpen(true);
    },
    []
  ); */

  // const handleDialogClose = () => setDialogOpen(false);

/*   const handleConfirmDelete = async () => {
     try {
      await deactivateUser(selectedId).unwrap();
      setSelectedId(null);
      setDialogOpen(false);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.log(err);
      }
    }
  }; */

  const columns = useMemo(
    () => [
      {
        field: "fullname",
        headerName: "Full Name",
        headerClassName: "column-header",
        valueFormatter: (value) => {
          if (value == null) {
            return "";
          }
          const formattedValue = capitalizeWords(value);
          return formattedValue;
        },
        flex: 1.5,
        minWidth: 200,
      },
      {
        field: "username",
        headerName: "Username",
        headerClassName: "column-header",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "role",
        type: "singleSelect",
        headerName: "Role",
        headerClassName: "column-header",
        valueOptions: ["admin", "user"],
        flex: 0.7,
        minWidth: 80,
        renderCell: (params) => renderRole(params.value),
      },
      {
        field: "active",
        type: "singleSelect",
        headerName: "Status",
        headerClassName: "column-header",
        valueOptions: ["true", "false"],
        flex: 0.7,
        minWidth: 80,
        renderCell: (params) => renderStatus(params.value),
      },
      {
        field: "dateCreated",
        type: "date",
        headerName: "Date Created",
        headerClassName: "column-header",
        flex: 1,
        minWidth: 120,
        valueFormatter: (value) => {
          if (value == null) {
            return "";
          }
          const date = new Date(value);
          const formatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(date);

          return formatted;
        },
      },
      {
        field: "actions",
        type: "actions",
        headerClassName: "column-header",
        flex: 0.8,
        minWidth: 100,
        getActions: (params) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="Edit User">
                <EditIcon />
              </Tooltip>
            }
            label="Edit"
            onClick={editUser(params.id)}
          />,
         /*  <GridActionsCellItem
            icon={
              <Tooltip title="Deactivate User">
                <DeleteIcon />
              </Tooltip>
            }
            label="Deactivate"
            onClick={handleDeleteClick(params.id)}
          />, */
        ],
      },
    ],
    [editUser]
  );

  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <DataGrid
        rows={userRows}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10]}
        disableColumnResize
        disableRowSelectionOnClick
        density="compact"
        showToolbar
        sx={(theme) => ({
          "& .column-header": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.grey[200],
            color: theme.palette.text.primary,
            fontWeight: "bold",
          },
        })}
      />
      {/* <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth={true}
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Deactivate user?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you wish to deactivate this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete} autoFocus>
            Deactivate
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default UsersGrid;
