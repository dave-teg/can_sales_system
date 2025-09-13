import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "./BestSellingProductGridData";
import { Box } from "@mui/material";
import { useGetBestSellingProductsQuery } from "./analyticsApiSlice";

export default function BestSellingProductGrid() {
  const { data: productRows, isLoading } = useGetBestSellingProductsQuery();

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
        showToolbar
        density="compact"
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
}
