const printDsr = async (rows, date, shopDetails) => {
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
    
        th:first-child {
          width: 50%;
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
    <p>${shopDetails.name} || Date: ${date}</p>
      <table>
        <thead>
          <tr>
              <th>Particular</th>
              <th>Open Qty</th>
              <th>Purc Qty</th>
              <th>Sale Qty</th>
              <th>Cash</th>
              <th>Card</th>
              <th>UPI</th>
              <th>Amt</th>
          </tr>
        </thead>
        <tbody>
          ${splitRows
            .map(
              (row) =>
                `<tr>
              <td>${row.name}</td>
              <td>${row.openingStock}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
  });

  pri.document.close();
  pri.focus();
  pri.print();
};

export default printDsr;
