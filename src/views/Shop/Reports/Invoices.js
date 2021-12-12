import { Grid } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import DataTable from "../../../Components/DataTable";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";

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
  },
  {
    id: "qty",
    label: "qty",
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

  const { fetchInvoices } = useContext(ShopDataContext);

  useEffect(() => {
    fetchInvoices().then((_) => {
      setInvoices(_);
      setRows(_);
    });
  }, []);

  useEffect(() => {}, [rows]);
  return (
    <Grid container spacing={3} direction="column">
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={2}></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {rows.length > 0 && <DataTable rows={rows} columns={columns} />}
      </Grid>
    </Grid>
  );
}

export default Invoices;
