import Chip from "@mui/material/Chip";
import { Visibility } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import { Tooltip } from "@mui/material";

const items = [
  { id: 1, productName: 'Paperclip', categoryName: 'Stationary', quantity: 100, unit_price: 1.99, total: 199 },
  { id: 2, productName: 'Paper', categoryName: 'Stationary', quantity: 10, unit_price: 30, total: 300 },
  { id: 3, productName: 'Pencil', categoryName: 'Stationary', quantity: 100, unit_price: 1.25, total: 125 },
];

export const rows = [
  ...items,
  { id: 'TOTAL', label: 'Grand Total', total: 686.4 },
];

const baseColumnOptions = {
  sortable: false,
  pinnable: false,
  hideable: false,
};

const capitalizeWords = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


export const columns = [
  {
    field: "productName",
    headerName: "Product Name",
    headerClassName: "column-header",
    ...baseColumnOptions,
    flex: 1.5,
    minWidth: 200,
    valueFormatter: (value) => {
      if (value == null) {
        return "";
      }
      const formattedValue = capitalizeWords(value)
      return formattedValue;
    },
    colSpan: (value, row) => {
      if (row.id === 'TOTAL') {
        return 4;
      }
      return undefined;
    },
    valueGetter: (value, row) => {
      if (row.id === 'TOTAL') {
        return row.label;
      }
      return value;
    },
  },
  {
    field: "categoryName",
    headerName: "Category Name",
    headerClassName: "column-header",
    valueFormatter: (value) => {
      if (value == null) {
        return "";
      }
      const formattedValue = capitalizeWords(value)
      return formattedValue;
    },
    ...baseColumnOptions,
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: "unit_price",
    headerName: "Price",
    headerClassName: "column-header",
    ...baseColumnOptions,
    flex: 1,
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
    field: "quantity",
    headerName: "Quantity",
    headerClassName: "column-header",
    ...baseColumnOptions,
    flex: 1,
  },
 
  {
    field: "total",
    headerName: "Total Price",
    headerClassName: "column-header",
    ...baseColumnOptions,
    flex: 1,
    valueGetter: (value, row) => {
      if (row.id === 'TOTAL') {
        return row.total;
      }
      return value;
    },
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
  }
];

export const getCellClassName = ({ row, field }) => {
  if ( row.id === 'TOTAL') {
    if (field === 'productName') {
      return 'bold right-align';
    }
  }
  return '';
};

