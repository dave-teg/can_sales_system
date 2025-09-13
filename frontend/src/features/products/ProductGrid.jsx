import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useGetAllProductsQuery } from "./productApiSlice";

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

const ProductGrid = () => {
  const { data: productRows, isLoading } = useGetAllProductsQuery();

  const navigate = useNavigate();

  const editProduct = useCallback(
    (id) => () => {
      navigate(`/dashboard/products/${id}`);
    },
    [navigate]
  );

  const columns = useMemo(
    () => [
      {
        field: "productName",
        headerName: "Product Name",
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
        field: "categoryName",
        headerName: "Category Name",
        headerClassName: "column-header",
        valueFormatter: (value) => {
          if (value == null) {
            return "";
          }
          const formattedValue = capitalizeWords(value);
          return formattedValue;
        },
        flex: 1,
        minWidth: 120,
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
        field: "price",
        type: "number",
        headerName: "Price",
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
              <Tooltip title="Edit Product">
                <EditIcon />
              </Tooltip>
            }
            label="Edit"
            onClick={editProduct(params.id)}
          />,
        ],
      },
    ],
    [editProduct]
  );

  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <DataGrid
        rows={productRows}
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
    </Box>
  );
};

export default ProductGrid;
