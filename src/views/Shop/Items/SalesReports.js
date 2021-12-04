import { Grid, Input } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import DataTable from "../../../Components/DataTable";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";

const columns = [
  {
    id: "name",
    label: "Name",
    minWidth: 200,
  },
  {
    id: "qty",
    label: "total qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
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
];

function SalesReports() {
  const [rows, setRows] = useState([]);
  const [sDate, setSDate] = useState("");

  const { fetchSales } = useContext(ShopDataContext);

  useEffect(() => {}, [rows]);

  return (
    <Grid container direction="column">
      <Grid item xs={2}>
        <Input
          type="date"
          value={sDate}
          onChange={async (e) => {
            setSDate(e.target.value);
            setRows(await fetchSales(e.target.value));
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
    </Grid>
  );
}

export default SalesReports;
