/* import React from "react";

  const capitalizeWords = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

const ThermalReceipt = React.forwardRef(({ cart, total, cashier, totalQuantity }, ref) => (
  <div
    ref={ref}
    style={{
      width: "280px",
      fontSize: "12px",
      padding: "10px",
      fontFamily: "monospace",
      whiteSpace: "pre-wrap",
      overflow: 'hidden',
      color: 'black',
      backgroundColor: 'white'
    }}
  >
    ==============================================================
    <div style={{ textAlign: "center", lineHeight: "1.4" }}>
      <div>MK HOTEL AND LOUNGE</div>
      <div>A.A S.C K/KERANIYO</div>
      <div>W06 H. NO. NEW</div>
      <div>AROUND BETEL</div>
      <div>TEL. 0911529223</div>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "8px",
      }}
    >
      <div>{new Date().toLocaleDateString()}</div>
      <div>{new Date().toLocaleTimeString()}</div>
    </div>
    <div>Cashier name : {cashier}</div>
    <div style={{ margin: "3px 0" }}>
      ---------------------------------------
    </div>
    <div style={{ textAlign: "center", fontWeight: "bold" }}>
        CASH Invoice
    </div>
      <div>Invoice No. : 00022726</div>
    --------------------------------------
 
    {cart.map((product) => (
      <div key={product.product_id} style={{ marginBottom: "2px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{capitalizeWords(product.productName)} <span style={{marginLeft: '2px'}}>x{product.quantity}</span></div>
          <span>*{(product.price * product.quantity).toFixed(2)}</span>
        </div>
      </div>
    ))}
    <div style={{textAlign: 'center'}}>
      --------------------------------
    </div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>NOTAXBL</div>
      <span>*{total.toFixed(2)}</span>
    </div>
 <div style={{textAlign: 'center'}}>
      --------------------------------
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: "bold",
        fontSize: "14px",
        margin: '0'
      }}
    >
      <span>TOTAL:</span>
      <span>*{total.toFixed(2)}</span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: '0'
      }}
    >
      <span>CASH Birr:</span>
      <span>*{total.toFixed(2)}</span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: '0',
        fontSize: '11px'
      }}
    >
      <span>ITEM #</span>
      <span>{totalQuantity}</span>
    </div>

    ===========================================================

  </div>
));

export default ThermalReceipt;
 */

/* import React from "react";

const ThermalReceipt = ({ cart, total, cashier, totalQuantity }) => {
  // Format one line with wrapping for product name
  const formatLine = (name, qty, price, itemTotal) => {
    const colWidths = { name: 14, qty: 4, price: 8, total: 9 };
    const lines = [];
    const chunks = [];

    // Break product name into chunks of 14 characters
    for (let i = 0; i < name.length; i += colWidths.name) {
      chunks.push(name.slice(i, i + colWidths.name));
    }

    // First line with all columns
    lines.push(
      chunks[0].padEnd(colWidths.name) +
        qty.toString().padEnd(colWidths.qty) +
        price.toFixed(2).padStart(colWidths.price) +
        itemTotal.toFixed(2).padStart(colWidths.total)
    );

    // Remaining lines with only product name
    for (let i = 1; i < chunks.length; i++) {
      lines.push(chunks[i].padEnd(colWidths.name));
    }

    return lines.join("\n");
  };

  const formatTotal = (label, amount, width = 40) => {
    const line = `${label}${amount.toFixed(2)}`;
    return line.padStart(width);
  };

  const formattedDate = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).replace(",", "");

  return (
    <pre
      style={{
        width: "280px",
        fontSize: "12px",
        padding: "10px",
        fontFamily: "monospace",
        backgroundColor: "white",
        color: "black",
        whiteSpace: "pre-wrap",
      }}
    >
{`                Surprise Club
                Order Reciept

Casher : ${cashier}
Waiter : N/A
Ref No: INV-000123
Date   : ${formattedDate}
-----------------------------------

Product        Qty   Price  Tot Price
${cart.map(item =>
  formatLine(item.productName, item.quantity, item.price, item.price * item.quantity)
).join("\n")}
-----------------------------------
${formatTotal("Total: ", total)}
-----------------------------------`}
    </pre>
  );
};

export default ThermalReceipt; */

import React from "react";

const ThermalReceipt = ({orderMeta, orderItems}) => {
  const capitalizeWords = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  console.log('order items', orderItems)

  const formatLine = (name, qty, price, total) => {
    const colWidths = { name: 17 , qty: 5, price: 9, total: 9 };
    const lines = [];
    const chunks = [];

    // break product name into chunks of 14 chars
    for (let i = 0; i < name.length; i += colWidths.name) {
      chunks.push(name.slice(i, i + colWidths.name));
    }

    // first line with all columns
    lines.push(
      capitalizeWords(chunks[0]).padEnd(colWidths.name + 3) +
        qty.toString().padEnd(colWidths.qty) +
        price.toFixed(2).padEnd(colWidths.price) +
        total.toFixed(2).padEnd(colWidths.total)
    );

    // remaining chunks only product name
    for (let i = 1; i < chunks.length; i++) {
      lines.push(chunks[i].padEnd(colWidths.name));
    }

    return lines.join("\n");
  };

  const formatTotal = (label, amount, width = 38) => {
    const line = `${label}$${amount.toFixed(2)}`;
    return line.padStart(width);
  };

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

  return (
    <div
      style={{
        width: "320px",
        fontSize: "12px",
        padding: "10px",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        color: "black",
        backgroundColor: "white",
      }}
    >
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: '14px' }}>
        CAN CLUB
      </div>
      <div style={{ textAlign: "center" }}>Order Receipt</div>

      <pre style={{ margin: 0, padding: 0 }}>
        {`           
Casher : ${capitalizeWords(orderMeta.cashier_name)}
Waiter : ${capitalizeWords(orderMeta.waiter_name)}
Ref No : ${orderMeta.invoice_number}
Date   : ${formattedDate}
-----------------------------------------
Product            Qty   Price   Tot Price
${orderItems
  .map((item) =>
    formatLine(
      item.product_name,
      item.quantity,
      Number(item.unit_price),
      Number(item.item_total)
    )
  )
  .join("\n")}
-----------------------------------------
`}
      </pre>
      <div style={{ fontWeight: "bold", marginTop: "4px", fontSize: '13px' }}>
        {formatTotal("Total: ", Number(orderMeta.total_price))}
      </div>
      <div>-----------------------------------------</div>
    </div>
  );
};

export default ThermalReceipt;
