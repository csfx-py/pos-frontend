import { Grid } from "@material-ui/core";
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

  const { fetchPurchases } = useContext(ShopDataContext);

  const kek = async () => {
    setRows(await fetchPurchases());
  };

  useEffect(() => {
    kek();
  }, []);

  return (
    <Grid container direction="column">
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
    </Grid>
  );
}

export default PurchaseReports;
