import { Button, Grid, Input, InputLabel, TextField } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import DataTable from "../../../Components/DataTable";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";
import printInvoice from "../../../utils/printInvoice";

const columns = [
  {
    id: "invoice_date",
    label: "Invoice Date",
    minWidth: 170,
    align: "left",
  },
  {
    id: "sales_no",
    label: "Sales number",
    minWidth: 200,
  },
  {
    id: "invoice_number",
    label: "Invoice number",
    minWidth: 200,
  },
  {
    id: "name",
    label: "Name",
    minWidth: 200,
  },
  {
    id: "price",
    label: "Price",
    minWidth: 200,
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty",
    label: "qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "discount",
    label: "discount/unit",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "total",
    label: "Total",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
];

function Invoices() {
  const [rows, setRows] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [salesNum, setSalesNum] = useState("");
  const [sDate, setSDate] = useState("");
  const [eDate, setEDate] = useState("");

  const { fetchInvoices } = useContext(ShopDataContext);
  const { toast } = useContext(UtilityContext);

  const handlePrint = async (e) => {
    // get all rows with invoice number
    const sold_invoices = invoices.filter((inv) => inv.sales_no === salesNum);
    // from sold_invoices put all rows with same invoice_number in one array
    let grouped = [];
    sold_invoices.forEach((inv) => {
      const item = grouped.find((i) => i.invoice_number === inv.invoice_number);
      if (item) {
        item.rows.push(inv);
      } else {
        grouped.push({
          invoice_number: inv.invoice_number,
          rows: [inv],
        });
      }
    });

    // sort grouped array by getting last digits of invoice_number
    grouped.sort((a, b) => {
      const inm = a.invoice_number.split("-");
      const inb = b.invoice_number.split("-");
      return parseInt(inm[inm.length - 1]) - parseInt(inb[inb.length - 1]);
    });

    console.log(grouped);

    printInvoice(grouped);
  };

  const handlePrintGen = async (e) => {
    // get all rows
    const sold_invoices = invoices;
    // from sold_invoices put all rows with same invoice_number in one array
    let grouped = [];
    sold_invoices.forEach((inv) => {
      const item = grouped.find((i) => i.invoice_number === inv.invoice_number);
      if (item) {
        item.rows.push(inv);
      } else {
        grouped.push({
          invoice_number: inv.invoice_number,
          rows: [inv],
        });
      }
    });

    // sort grouped array by getting last digits of invoice_number
    grouped.sort((a, b) => {
      const inm = a.invoice_number.split("-");
      const inb = b.invoice_number.split("-");
      return parseInt(inm[inm.length - 1]) - parseInt(inb[inb.length - 1]);
    });

    console.log(grouped);

    printInvoice(grouped);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <InputLabel>Start Date</InputLabel>
            <Input
              type="date"
              value={sDate}
              onChange={async (e) => {
                setSDate(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <InputLabel>End Date</InputLabel>
            <Input
              type="date"
              value={eDate}
              onChange={async (e) => {
                setEDate(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={async (e) => {
                // check if sDate and eDate are not empty
                if (sDate && eDate) {
                  // fetch invoices
                  const invoices = await fetchInvoices(sDate, eDate);
                  // set rows
                  setRows(invoices);
                  // set invoices
                  setInvoices(invoices);
                }
              }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {rows.length > 0 && <DataTable rows={rows} columns={columns} />}
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <TextField
              id="invNum"
              label="Sales Number"
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => {
                setSalesNum(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={async (e) => {
                if (salesNum) {
                  return await handlePrint(e);
                }
                toast("Please enter sales number", "error");
              }}
              fullWidth
            >
              Print
            </Button>
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={async (e) => {
                if (rows.length > 0) {
                  return await handlePrintGen(e);
                }
                toast("No invoices to print", "error");
              }}
              fullWidth
            >
              Print Generated
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <iframe
        title="invoice"
        id="ifmcontentstoprint"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
    </Grid>
  );
}

export default Invoices;
