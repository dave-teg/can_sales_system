import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

function getLast30Days() {
  const days = [];
  const today = new Date();

  for (let i = 30; i >= 1; i--) {
    // Start from 30 days ago up to yesterday
    const date = new Date();
    date.setDate(today.getDate() - i);

    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();

    days.push(`${monthName} ${day}`);
  }

  return days;
}

function renderSparkLineCell(params) {
  const data = getLast30Days();
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        color="hsl(210, 98%, 42%)"
        xAxis={{
          scaleType: "band",
          data,
        }}
      />
    </div>
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
    field: "productName",
    headerName: "Product Name",
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
    field: "price",
    type: "number",
    headerName: "Price",
    headerClassName: "column-header",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 80,
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
    field: "totalUnitsSold",
     type: "number",
    headerName: "Total Units Sold",
    description: "Total units of the product sold in the past 30 days.",
    headerClassName: "column-header",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 100,
    valueFormatter: (value) => {
      if (value == null) {
        return "";
      }
      const formattedValue = value.toLocaleString()
      return formattedValue;
    },
  },
  {
    field: "revenue",
    type: "number",
    headerName: "Total Revenue",
    description: "Total revenue of the product for the past 30 days",
    headerClassName: "column-header",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 120,
    valueFormatter: (value) => {
      if (value == null) {
        return "";
      }
      const formattedValue = value.toLocaleString()
      return `$${formattedValue}`;
    },
  },
  {
    field: "dailyRevenue",
    headerName: "Daily Revenue",
    description: "Daily revenue of the product for the past 30 days",
    headerClassName: "column-header",
    flex: 1,
    minWidth: 150,
    renderCell: renderSparkLineCell,
  },
];

