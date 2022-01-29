const printSales = async (rows) => {
    const rowsToPrintSplit = [];
    for (let i = 0; i < rows.length; i += 35) {
      rowsToPrintSplit.push(rows.slice(i, i + 35));
    }
    const pri = document.getElementById("dsr-print").contentWindow;
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
      
              p {
                text-align: right;
              }
                
              .page {
                padding: 20px;
                width: 21cm;
                height: 295mm;
                display: flex;
                flex-direction: column;
                overflow: auto;
                background: white;
              }
              
              table {
                width: 100%;
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
                width: 45%;
              }

              th:nth-child(2) {
                width: 7%;
              }

              th:nth-child(3) {
                width: 7%;
              }
              
              th:nth-child(4) {
                width: 7%;
              }

              th:nth-child(5) {
                width: 7%;
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
                  page-break-before: always;
                }
              }
            </style>
            </head>
            <body>
            </body>
            </html>`
    );
    rowsToPrintSplit.forEach((splitRows) => {
      pri.document.body.innerHTML += `
          <div class="page">
            <table>
              <thead>
                <tr>
                    <th>Name</th>
                    <th>Cash Qty</th>
                    <th>Card Qty</th>
                    <th>UPI Qty</th>
                    <th>Total Qty</th>
                    <th>Price</th>
                    <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${splitRows
                  .map(
                    (row) =>
                      `<tr>
                    <td>${row.name}</td>
                    <td>${row.qty_cash}</td>
                    <td>${row.qty_card}</td>
                    <td>${row.qty_upi}</td>
                    <td>${row.qty}</td>
                    <td>${parseFloat(row.mrp).toFixed(2)}</td>
                    <td>${parseFloat(row.total).toFixed(2)}</td>
                    </tr>`
                  )
                  .join("")}
                  <tr>
                    <td colspan="6" style="text-align: right;">Total</td>
                    <td>${parseFloat(
                      splitRows.reduce(
                        (acc, row) => parseFloat(acc) + parseFloat(row.total),
                        0
                      )
                    ).toFixed(2)}</td>
                  </tr>
              </tbody>
            </table>
          </div>`;
    });
  
    pri.document.close();
    pri.focus();
    pri.print();
  };
  
  export default printSales;
  