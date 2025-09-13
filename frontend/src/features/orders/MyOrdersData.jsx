import { Visibility } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import { Tooltip } from "@mui/material";

const capitalizeWords = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


export const columns = [
  {
    field: "invoiceNo",
    type: 'number',
    headerName: "Ref No",
    headerClassName: "column-header",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 120
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
    minWidth: 150,
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
    field: "totalItems",
    type: "number",
    headerName: "Total Items",
    headerClassName: "column-header",
    headerAlign: "left",
    align: "left",
    flex: 1,
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
    field: "actions",
    type: "actions",
    headerClassName: "column-header",
    flex: 1,
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

export const rows = [
  {
    id: 1,
    handledBy: "Abebe",
    role: "admin",
    totalItems: 5,
    price: 300,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 2,
    handledBy: "Kebede",
    role: "user",
    totalItems: 10,
    price: 1200,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 3,
    handledBy: "Sam",
    role: "admin",
    totalItems: 2,
    price: 1000,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 4,
    handledBy: "Kyle",
    role: "user",
    totalItems: 10,
    price: 1400,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 5,
    handledBy: "Bereket",
    role: "admin",
    totalItems: 5,
    price: 300,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 6,
    handledBy: "Abebe",
    role: "admin",
    totalItems: 5,
    price: 300,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 7,
    handledBy: "Kebede",
    role: "user",
    totalItems: 5,
    price: 300,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 8,
    handledBy: "abel",
    role: "user",
    totalItems: 5,
    price: 60,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 9,
    handledBy: "Abebe",
    role: "admin",
    totalItems: 5,
    price: 300,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
  {
    id: 10,
    handledBy: "Selam",
    role: "user",
    totalItems: 7,
    price: 500,
    dateCreated: "2025-07-05T05:04:44.463Z",
  },
];
