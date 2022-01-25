const printInvoiceReport = async (rows, shopDetails) => {
  const rowsToPrintSplit = [];
  for (let i = 0; i < rows.length; i += 40) {
    rowsToPrintSplit.push(rows.slice(i, i + 40));
  }
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
  
          p {
            text-align: right;
          }
            
          .page {
            padding: 10px;
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
          
          td {
            padding: 0 5px;
          }
          
          td:last-child {
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
                <th>Date</th>
                <th>Invoice number Qty</th>
                <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${splitRows
              .map(
                (row) =>
                  `<tr>
                <td>${row.invoice_date}</td>
                <td>${row.invoice_number}</td>
                <td>${row.amt}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <p>Total: ${parseFloat(
          splitRows.reduce(
            (acc, row) => parseFloat(acc) + parseFloat(row.amt),
            0
          )
        ).toFixed(2)}</p>
      </div>`;
  });

  pri.document.close();
  pri.focus();
  pri.print();
};

export default printInvoiceReport;
