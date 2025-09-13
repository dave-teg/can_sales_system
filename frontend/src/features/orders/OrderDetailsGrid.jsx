import {useEffect,useMemo} from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns, getCellClassName } from "./OrderDetailsData";
import { Box } from "@mui/material";
import { useGetOrderItemsQuery } from "./ordersApiSlice";

const OrderDetailsGrid = ({id}) => {
  const {data: orderItemsData, isLoading, isSuccess} = useGetOrderItemsQuery(id)

  useEffect(() => {
    if(isSuccess) {
      const items = orderItemsData?.orderItemsRow
       const rows = [...items, { id: 'TOTAL', label: 'Grand Total', total: parseInt(orderItemsData?.totalPrice) },]
      console.log(rows)
    }
  }, [isSuccess, orderItemsData])

  const orderRows = useMemo(() => {
    const items = orderItemsData?.orderItemsRow || []
    const rows = [...items, { id: 'TOTAL', label: 'Grand Total', total: parseInt(orderItemsData?.totalPrice) },]
    return rows
  }, [orderItemsData?.orderItemsRow, orderItemsData?.totalPrice])


  return (
    <Box
      sx={{
        width: "100%",
        "& .bold": {
          fontWeight: 600,
        },
        "& .right-align": {
          textAlign: 'end !important'
        }
      }}
    >
      <DataGrid
        rows={orderRows}
        columns={columns}
        loading={isLoading}
        disableColumnResize
        disableRowSelectionOnClick
        disableColumnFilter
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        getCellClassName={getCellClassName}
       
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

export default OrderDetailsGrid;
