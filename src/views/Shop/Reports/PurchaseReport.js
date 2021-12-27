import { Button, Grid, Input, InputLabel } from "@material-ui/core";
import { useContext, useState } from "react";
import DataTable from "../../../Components/DataTable";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";

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
  const [sDate, setSDate] = useState("");
  const [eDate, setEDate] = useState("");

  const { fetchPurchases } = useContext(ShopDataContext);
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
                setRows(await fetchPurchases(sDate, eDate));
              } else {
                toast("Please select start and end date", "error");
              }
            }}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
    </Grid>
  );
}

export default PurchaseReports;
