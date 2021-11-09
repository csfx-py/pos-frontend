import { useContext, useRef, useState } from "react";
import { UtilityContext } from "../../Contexts/UtilityContext";
import { MasterDataContext } from "../../Contexts/MasterDataContext";
import { ShopDataContext } from "../../Contexts/ShopDataContext";
import {
  Button,
  Grid,
  Input,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import ShopNav from "../../Components/Shop/ShopNav";
import EditTable from "../../Components/EditTable";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

const columns = [
  {
    id: "name",
    label: "Name",
    minWidth: 120,
  },
  {
    id: "purchase_price",
    label: "Purchase price",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty_unit",
    label: "Unit Qty",
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
    id: "total",
    label: "Total",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "del",
    label: "Delete",
    minWidth: 20,
    type: "button",
  },
];

function ShopPurchase() {
  const classes = useStyles();

  const { toast } = useContext(UtilityContext);
  const { items } = useContext(MasterDataContext);
  const { purchase } = useContext(ShopDataContext);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState({
    name: "",
    qtyUnit: 0,
    qtyCase: 0,
  });
  const [pDate, setPDate] = useState("");

  const searchRef = useRef();

  const handleDelete = (row) => {
    setRows(rows.filter((item) => item.products_id !== row.products_id));
  };

  return (
    <div className={classes.root}>
      <ShopNav />
      <Grid container direction="column">
        <Paper elevation={2} className={classes.paper}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Purchase
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <InputLabel>Date</InputLabel>
              <Input
                type="date"
                label="Date"
                onChange={(event) => {
                  setPDate(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                size="small"
                options={items}
                ref={searchRef}
                onChange={(event, value) => {
                  setSearch({ ...search, name: value?.name });
                }}
                getOptionLabel={(option) =>
                  option.name +
                  `${option.barcode ? ` (${option.barcode})` : ""}`
                }
                renderInput={(params) => (
                  <TextField {...params} label="Item Name" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Unit Quantity"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={search.qtyUnit}
                onChange={(event) => {
                  setSearch({
                    ...search,
                    qtyUnit: parseInt(event.target.value),
                  });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Case Quantity"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={search.qtyCase}
                onChange={(event) => {
                  setSearch({
                    ...search,
                    qtyCase: parseInt(event.target.value),
                  });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              {console.log(items)}
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={(event) => {
                  if (
                    search.name !== "" &&
                    (search.qtyCase > 0 || search.qtyUnit > 0)
                  ) {
                    const selectedItem = items.find(
                      (item) => item.name === search.name
                    );
                    if (rows.some((item) => item.name === selectedItem.name)) {
                      toast("Item already added", "error");
                    } else {
                      setRows([
                        ...rows,
                        {
                          products_id: selectedItem.id,
                          name: selectedItem.name,
                          purchase_price: selectedItem.purchase_price,
                          qty_case: search.qtyCase,
                          qty_unit: search.qtyUnit,
                          total:
                            search.qtyCase * selectedItem.case_price +
                            search.qtyUnit * selectedItem.purchase_price,
                        },
                      ]);
                    }
                    const ele = searchRef.current.getElementsByClassName(
                      "MuiAutocomplete-clearIndicator"
                    )[0];
                    if (ele) ele.click();
                    setSearch({ ...search, name: "", qtyCase: 0, qtyUnit: 0 });
                    return;
                  }
                  toast("Fill correct details", "error");
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <EditTable
              rows={rows}
              columns={columns}
              handleDelete={handleDelete}
            />
          </Grid>
          <Grid container spacing={2} style={{ marginTop: "1rem" }}>
            <Grid item xs={8}></Grid>
            <Grid item xs={3}>
              <Typography variant="h4" component="h2" gutterBottom>
                Total:
                {rows
                  .reduce((acc, curr) => acc + curr.total, 0)
                  .toLocaleString("en-IN")}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={async (event) => {
                  if (rows.length > 0 && pDate !== "") {
                    const res = await purchase(rows, pDate);
                    if (res) {
                      setRows([]);
                    }
                    return;
                  }
                  toast("Form Incomplete", "error");
                  return;
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}

export default ShopPurchase;
