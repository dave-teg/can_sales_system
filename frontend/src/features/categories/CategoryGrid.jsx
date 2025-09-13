import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip} from "@mui/material";
import {
  useGetAllCategoriesQuery,
} from "./categoryApiSlice";

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

const CategoryGrid = () => {
  const {
    data: categoryRows,
    isLoading,
  } = useGetAllCategoriesQuery();

  const navigate = useNavigate();

  const editCategory = useCallback(
    (id) => () => {
      navigate(`/dashboard/categories/${id}`);
    },
    [navigate]
  );



  const columns = useMemo(
    () => [
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
        flex: 1.5,
        minWidth: 200,
      },
      {
        field: "productCount",
        headerName: "Product Count",
        type: "number",
        headerAlign: "left",
        align: "left",
        headerClassName: "column-header",
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
              <Tooltip title="Edit Category">
                <EditIcon />
              </Tooltip>
            }
            label="Edit"
            onClick={editCategory(params.id)}
          />,
        ],
      },
    ],
    [editCategory]
  );

  return (
    <Box sx={{ width: "100%", height: 500, mb: 4 }}>
      <DataGrid
        rows={categoryRows}
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

export default CategoryGrid;
