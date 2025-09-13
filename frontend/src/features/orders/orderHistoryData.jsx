import Chip from "@mui/material/Chip";
import { Visibility } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import { Tooltip } from "@mui/material";

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
        fontSize: "0.65rem",
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
        fontSize: "0.65rem",
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

export const columns = [
  {
    field: "invoiceNo",
    type: "number",
    headerName: "Ref No",
    headerClassName: "column-header",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "handledBy",
    headerName: "Handled By",
    headerClassName: "column-header",
    valueFormatter: (value) => {
      if (value == null) {
        return "";
      }
      const formattedValue = capitalizeWords(value);
      return formattedValue;
    },
    flex: 1,
    minWidth: 150,
  },
  {
    field: "waiter",
    headerName: "Waiter",
    headerClassName: "column-header",
    valueFormatter: (value) => {
      if (value == null) {
        return "None";
      }
      const formattedValue = capitalizeWords(value);
      return formattedValue;
    },
    flex: 1,
    minWidth: 100,
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
    field: "totalItems",
    type: "number",
    headerName: "Total Items",
    headerClassName: "column-header",
    headerAlign: "left",
    align: "left",
    flex: 0.7,
    minWidth: 80,
  },
  {
    field: "price",
    type: "number",
    headerName: "Total Price",
    headerAlign: "left",
    align: "left",
    headerClassName: "column-header",
    flex: 1,
    minWidth: 120,
    valueFormatter: (value) => {
      if (value == null) {
        return "";
      }
      const formattedValue = value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `$${formattedValue}`;
    },
  },
  {
    field: "dateCreated",
    type: "dateTime",
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
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(date);

      return formatted;
    },
  },
  {
    field: "actions",
    type: "actions",
    headerClassName: "column-header",
    flex: 0.6,
    minWidth: 80,
    getActions: (params) => [
      <GridActionsCellItem
        icon={
          <Tooltip title="View Order Details">
            <Visibility />
          </Tooltip>
        }
        label="View"
        component={RouterLink}
        to={`/dashboard/order/${params.id}`}
      />,
    ],
  },
];

