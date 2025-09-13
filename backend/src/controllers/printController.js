import asyncHandler from "express-async-handler";
import escpos from "escpos";
import escposUSB from "escpos-usb";
import { getOrderByIdService } from "../models/orderModel.js";

/* function formatLine(name, qty, price, total) {
    return (
      name.padEnd(14) +  // product column
      qty.toString().padEnd(4) + // qty column
      price.toFixed(2).padStart(8) + // price column
      total.toFixed(2).padStart(9)  // total column
    );
  } */

function capitalizeWords(string) {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
};

//format line with word wrap for long product names
function formatLine(name, qty, price, total) {

  const colWidths = { name: 14, qty: 4, price: 8, total: 8 };

  const lines = [];
  const productChunks = [];

  // Break product name into chunks of 14 characters
  for (let i = 0; i < name.length; i += colWidths.name) {
    productChunks.push(name.slice(i, i + colWidths.name));
  }

  // First line → product + qty + price + total
  lines.push(
    capitalizeWords(productChunks[0]).padEnd(colWidths.name + 2) +
      qty.toString().padEnd(colWidths.qty) +
      price.toFixed(2).padStart(colWidths.price) +
      total.toFixed(2).padStart(colWidths.total)
  );

  // Remaining chunks → just product name (indented)
  for (let i = 1; i < productChunks.length; i++) {
    lines.push(productChunks[i].padEnd(colWidths.name));
  }

  return lines.join("\n");
}

function formatTotal(label, amount, width = 35) {
  const line = label + amount.toFixed(2);
  return line.padStart(width);
}



//@desc Print reciept for an order
//@route POST /api/print/:orderId
//access Private
export const printReciept = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  // Tell escpos to use USB adapter
  escpos.USB = escposUSB;

  const device = new escpos.USB(); // Your thermal printer
  const printer = new escpos.Printer(device);

  // Fetch order details from the database
  const { orderItems, orderMeta } = await getOrderByIdService(orderId);

  if (!orderItems.length || !orderMeta) {
    return res.status(404).json({ message: "Order not found" });
  }

  const formattedDate = new Date(orderMeta.created_at)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(",", "");

  device.open((err) => {
    if (err) {
      console.error("Error opening printer device:", err);
      return res.status(500).json({ message: "Failed to connect to printer" });
    }

    // Start printing
    printer
      .feed(4)
      .align("CT")
      .style("B")
      .size(1, 1)
      .text("Surprise Club")
      .style("NORMAL")
      .size(0, 0)
      .text("Order Reciept")
      .newLine()

      .align("LT")
      .text(`Casher : ${orderMeta.cashier_name}`)
      .text(`Waiter : ${orderMeta.waiter_name}`)
      .text(`Ref No: ${orderMeta.invoice_number}`)
      .text(`Date   : ${formattedDate}`)
      .drawLine()

      .text(formatLine("Product", "Qty", "Price", "Tot Price"));

    // print each product line
    orderItems.forEach((item) => {
      printer.text(
        formatLine(
          item.product_name,
          item.quantity,
          item.unit_price,
          item.item_total
        )
      );
    });

    printer
      .drawLine()
      .style("B")
      .size(1, 1)
      .text(formatTotal("Total: ", orderMeta.total_price))
      .drawLine()
      .newLine()
      .feed(3)
      .cut()
      .close(() => {
        res.json({ message: "Printed successfully", data: orderMeta });
      });
  });
});
