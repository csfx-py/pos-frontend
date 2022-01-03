const printInvoice = async (rowsToPrint) => {
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
        }
        
        .page, .page * {
            visibility: visible;
        }
    }
    </style>
    </head>
    <body>
    </body>
    </html>`
  );
  // split rows to print into 6 rows each
  const rowsToPrintSplit = [];
  for (let i = 0; i < rowsToPrint.length; i += 6) {
    rowsToPrintSplit.push(rowsToPrint.slice(i, i + 6));
  }
  console.log(rowsToPrintSplit);
  // append pages to body
  for (let i = 0; i < rowsToPrintSplit.length; i++) {
    pri.document.body.innerHTML += `<div class="page">
        <p>Liquor Town</p>
        <p>R.P.D cross, Tilakwadi, Belgaum-590006</p>
        <p class="type-number">Invoice number ${
          rowsToPrint[0].invoice_number
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
                  <td>${row.price}</td>
                  <td>${row.total}</td>
                </tr>
                `
                  )
                  .join("")}
               <tr>
                <td colspan="3" style="text-align: right;">Total</td>
                <td>${rowsToPrintSplit[i].reduce(
                  (a, b) => parseFloat(a) + parseFloat(b.total),
                  0
                )}</td>
                  </td>
              </tr>
            </tbody>
          </table>
          </div>`;
  }
  pri.document.close();
  pri.focus();
  pri.print();
};

export default printInvoice;
