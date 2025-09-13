import {useState, useMemo, useRef} from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "./MyOrdersData";
import { Box } from "@mui/material";
import { useGetMyOrdersQuery } from "./ordersApiSlice";


const MyOrdersGrid = () => {
   const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
   const queryOptions = useMemo(
    () => ({ page: paginationModel.page + 1, limit: paginationModel.pageSize}),
    [paginationModel],
  );

  const {data: orderData, isLoading} = useGetMyOrdersQuery(queryOptions)

   const rowCountRef = useRef(orderData?.pageInfo?.totalRowCount || 0);

  const rowCount = useMemo(() => {
    if (orderData?.pageInfo?.totalRowCount !== undefined) {
      rowCountRef.current = orderData.pageInfo.totalRowCount;
    }
    return rowCountRef.current;
  }, [orderData?.pageInfo?.totalRowCount]);


  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <DataGrid
        rows={orderData?.orderRows}
        columns={columns}
        rowCount={rowCount}
        loading={isLoading}
        pageSizeOptions={[10, 25]}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnResize
        disableRowSelectionOnClick
        onPaginationModelChange={setPaginationModel}
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

export default MyOrdersGrid;
