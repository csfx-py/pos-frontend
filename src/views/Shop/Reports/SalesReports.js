import { Button, Grid, Input, InputLabel, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import DataTable from "../../../Components/DataTable";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";
import printSales from "../../../utils/printSales";

const columns = [
  {
    id: "name",
    label: "Name",
    minWidth: 200,
  },
  {
    id: "qty_cash",
    label: "Cash Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty_card",
    label: "Card Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty_upi",
    label: "Upi Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty",
    label: "Total qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "mrp",
    label: "MRP",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "total",
    label: "Amount",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
];

function SalesReports() {
  const [rows, setRows] = useState([]);
  const [sDate, setSDate] = useState("");
  const [eDate, setEDate] = useState("");

  const { fetchSales } = useContext(ShopDataContext);
  const { toast } = useContext(UtilityContext);

  return (
    <Grid container direction="column">
      <Grid container>
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
            onClick={async (e) => {
              if (sDate && eDate) {
                setRows(await fetchSales(sDate, eDate));
              } else {
                toast("Please select start and end date", "error");
              }
            }}
          >
            Generate Report
          </Button>
        </Grid>
        {console.log(rows)}
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={async (e) => {
              if (rows.length) {
                printSales(rows);
              }
            }}
          >
            Print Report
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
      <Typography variant="h5" align="right">
        Total Amount:{" "}
        {parseFloat(
          rows.reduce((a, b) => parseFloat(a) + parseFloat(b.total), 0)
        ).toFixed(2)}
      </Typography>
      <iframe
        title="invoice"
        id="dsr-print"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
    </Grid>
  );
}

export default SalesReports;
