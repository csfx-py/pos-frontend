const printInvoice = async (sales_rows) => {
  const pri = document.getElementById("ifmcontentstoprint").contentWindow;
  pri.document.open();
  pri.document.write(
    `<html>
      <head>
      <style>
      *,
      *::after,
      *::before {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
        Arial, sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
        
    .page {
      padding: 10px;
      width: 21cm;
      height: 9.9cm;
      display: flex;
      flex-direction: column;
      overflow: auto;
      background: white;
    }
    
    p {
      text-align: center;
    }
    
    .type-number {
      text-align: right;
    }
    
    table {
      width: 100%;
      height: 80%;
      table-layout: fixed;
    }
    
    table,
    th,
    td {
      border: 1px solid black;
      border-collapse: collapse;
    }
    
    th {
      text-align: center;
    }
    
    th:first-child {
      width: 70%;
    }
    
    tr:last-child {
      text-align: right;
      font-weight: bold;
    }
    
    td {
      padding: 0 5px;
    }
    
    td:not(:first-child) {
      text-align: right;
    }
    
    @media print {
      @page {
        margin: 0;
        width:100%;
      }
      
      .page, .page * {
        visibility: visible;
      }

      .page {
        clear: both;
        page-break-after: always;
      }
    }
    </style>
    </head>
    <body>
    </body>
    </html>`
  );
  console.log(sales_rows);
  sales_rows.forEach((row) => {
    const rowsToPrintSplit = [];
    // get 6 rows per page
    for (let i = 0; i < row.rows.length; i += 6) {
      rowsToPrintSplit.push(row.rows.slice(i, i + 6));
    }
    // append pages to body
    for (let i = 0; i < rowsToPrintSplit.length; i++) {
      pri.document.body.innerHTML += `<div class="page">
        <p>Liquor Town</p>
        <p>R.P.D cross, Tilakwadi, Belgaum-590006</p>
        <p class="type-number">Invoice number ${
          rowsToPrintSplit[0].invoice_number
        }</p>
            <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
                ${rowsToPrintSplit[i]
                  .map(
                    (row) => `
                <tr>
                  <td>${row.name}</td>
                  <td>${row.qty}</td>
                  <td>${parseFloat(row.price).toFixed(2)}</td>
                  <td>${parseFloat(row.total).toFixed(2)}</td>
                </tr>
                `
                  )
                  .join("")}
               <tr>
                <td colspan="3" style="text-align: right;">Total</td>
                <td>${rowsToPrintSplit[i]
                  .reduce((a, b) => parseFloat(a) + parseFloat(b.total), 0)
                  .toFixed(2)}</td>
                  </td>
              </tr>
            </tbody>
          </table>
          </div>
          <div class="pagebreak"></div>`;
    }
  });
  pri.document.close();
  pri.focus();
  console.log(pri.document);
  pri.print();
};

export default printInvoice;
