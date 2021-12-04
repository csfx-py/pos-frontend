import { Grid, Input } from "@material-ui/core";
import { useContext, useState } from "react";
import DataTable from "../../../Components/DataTable";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";

const columns = [
  {
    id: "name",
    label: "Name",
    minWidth: 200,
  },
  {
    id: "price",
    label: "Price",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty_case",
    label: "Case Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty_item",
    label: "Item Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
];

function PurchaseReports() {
  const [rows, setRows] = useState([]);
  const [pDate, setPDate] = useState("");

  const { fetchPurchases } = useContext(ShopDataContext);

  return (
    <Grid container direction="column">
      <Grid item xs={2}>
        <Input
          type="date"
          value={pDate}
          onChange={async (e) => {
            setPDate(e.target.value);
            setRows(await fetchPurchases(e.target.value));
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
    </Grid>
  );
}

export default PurchaseReports;
