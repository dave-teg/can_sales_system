import Chip from "@mui/material/Chip";

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

  const capitalizeWords = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

export const columns = [
  {
    field: "handledBy",
    headerName: "Handled By",
    headerClassName: "column-header",
    valueFormatter: (value) => {
      if (value == null) {
        return "";
      }
      const formattedValue = capitalizeWords(value)
      return formattedValue;
    },
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: "waiter",
    headerName: "Waiter",
    headerClassName: "column-header",
    valueFormatter: (value) => {
      if (value == null) {
        return "None";
      }
      const formattedValue = capitalizeWords(value)
      return formattedValue;
    },
    flex: 1.5,
    minWidth: 200,
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
];

