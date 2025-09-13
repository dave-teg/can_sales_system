import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "./recentOrdersData";
import { Box } from "@mui/material";
import { useGetRecentOrdersQuery } from "./ordersApiSlice";

const RecentOrderGrid = () => {
  const {data: orderRows, isLoading} = useGetRecentOrdersQuery()
  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <DataGrid
        rows={orderRows}
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

export default RecentOrderGrid;
