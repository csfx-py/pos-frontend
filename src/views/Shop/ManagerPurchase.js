import { useContext, useRef, useState } from "react";
import { UtilityContext } from "../../Contexts/UtilityContext";
import { MasterDataContext } from "../../Contexts/MasterDataContext";
import { ShopDataContext } from "../../Contexts/ShopDataContext";
import {
  Button,
  Grid,
  Input,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import ShopNav from "../../Components/Shop/ShopNav";
import DataTable from "../../Components/DataTable";

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
    id: "item",
    label: "Name",
    minWidth: 120,
  },
  {
    id: "open_qty",
    label: "Opening qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "price",
    label: "Purchase price",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty",
    label: "Qty",
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
    minWidth: 50,
  },
];

function ManagerPurchase() {
  const classes = useStyles();

  const { toast } = useContext(UtilityContext);
  const { items } = useContext(MasterDataContext);
  const { purchase } = useContext(ShopDataContext);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState({
    name: "",
    qty: "",
  });
  const [pDate, setPDate] = useState("");

  const searchRef = useRef();

  const handleDelete = (index) => {
    setRows(rows.filter((item, i) => i !== index));
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
              <Input
                type="date"
                label="Date"
                onChange={(event) => {
                  setPDate(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                size="small"
                options={items}
                ref={searchRef}
                onChange={(event, value) => {
                  setSearch({ ...search, name: value?.item_name });
                }}
                getOptionLabel={(option) =>
                  option.item_name +
                  `${option.barcode ? ` (${option.barcode})` : ""}`
                }
                renderInput={(params) => (
                  <TextField {...params} label="Item Name" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                size="small"
                fullWidth
                value={search.qty}
                onChange={(event) => {
                  setSearch({ ...search, qty: event.target.value });
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={(event) => {
                  if (search.name !== "" && search.qty !== "") {
                    const selectedItem = items.find(
                      (item) => item.item_name === search.name
                    );
                    if (
                      rows.some((item) => item.item === selectedItem.item_name)
                    ) {
                      toast("Item already added", "error");
                    } else {
                      setRows([
                        ...rows,
                        {
                          item: selectedItem.item_name,
                          price: selectedItem.purchase_price,
                          qty: search.qty,
                          total: search.qty * selectedItem.purchase_price,
                        },
                      ]);
                    }
                    const ele = searchRef.current.getElementsByClassName(
                      "MuiAutocomplete-clearIndicator"
                    )[0];
                    if (ele) ele.click();
                    setSearch({ ...search, name: "", qty: "" });
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
            <DataTable
              rows={rows}
              columns={columns}
              handleDelete={handleDelete}
            />
          </Grid>
          <Grid container spacing={2} style={{ marginTop: "1rem" }}>
            <Grid item xs={7}></Grid>
            <Grid item xs={3}>
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
            <Grid item xs={2}>
              <Typography variant="h4" component="h2" gutterBottom>
                Total:
                {rows
                  .reduce((acc, curr) => acc + curr.total, 0)
                  .toLocaleString("en-IN")}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}

export default ManagerPurchase;
