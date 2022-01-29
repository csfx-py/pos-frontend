const printInvoice = async (sales_rows, shopDetails) => {
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
      padding: 20px;
      width: 21cm;
      height: calc(297mm / 3);
      display: flex;
      flex-direction: column;
      overflow: auto;
      background: white;
    }
    
    p {
      text-align: center;
    }

    .info {
      display: flex;
      justify-content: space-between;
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
      width: 3%;
    }
    
    th:nth-child(2) {
      width: 55%;
    }
    
    tr:last-child {
      text-align: right;
      font-weight: bold;
    }
    
    td {
      padding: 0 5px;
    }
    
    td:not(nth-child(2)) {
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
    }
    </style>
    </head>
    <body>
    </body>
    </html>`
  );
  sales_rows.forEach((row) => {
    const rowsToPrintSplit = [];
    // get 6 rows per page
    for (let i = 0; i < row.rows.length; i += 6) {
      rowsToPrintSplit.push(row.rows.slice(i, i + 6));
    }
    // append pages to body
    for (let i = 0; i < rowsToPrintSplit.length; i++) {
      pri.document.body.innerHTML += `
      <div class="page">
      <div class="info">
        <p><b>${shopDetails.name}</b></p>
        <p>|| <b>Veerabhadra Prasanna</b> ||</p>
      </div>
      <div class="info">
        <p><b>${shopDetails.address}</b></p>
        <p>${rowsToPrintSplit[i][0].transaction_type + " Memo"}</p>
      </div>
      <div class="info">
        <p>${rowsToPrintSplit[i][0].invoice_date}</p>
        <p >Invoice number: ${rowsToPrintSplit[i][0].invoice_number}</p>
        <p>${shopDetails.phone}</p>
        </div>
            <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Discount/<br />item</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
                ${rowsToPrintSplit[i]
                  .map(
                    (row, index) => `
                <tr>
                  <td>${index}</td>
                  <td>${row.name}</td>
                  <td>${parseFloat(row.price).toFixed(2)}</td>
                  <td>${row.qty}</td>
                  <td>${parseFloat(row.discount).toFixed(2)}</td>
                  <td>${parseFloat(row.total).toFixed(2)}</td>
                </tr>
                `
                  )
                  .join("")}
               <tr>
                <td colspan="3" style="text-align: right;">Total</td>
                <td>${rowsToPrintSplit[i].reduce(
                  (a, b) => parseFloat(a) + parseInt(b.qty),
                  0
                )}</td>
                <td >${rowsToPrintSplit[i]
                  .reduce(
                    (a, b) =>
                      parseFloat(a) + parseFloat(b.discount) * parseInt(b.qty),
                    0
                  )
                  .toFixed(2)}</td>
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
  pri.print();
};

export default printInvoice;
