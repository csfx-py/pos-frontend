import {
  Button,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useContext, useRef, useState } from "react";
import { UtilityContext } from "../Contexts/UtilityContext";
import { ShopDataContext } from "../Contexts/ShopDataContext";
import ShopNav from "../Components/Shop/ShopNav";
import EditTable from "../Components/EditTable";

const columns = [
  {
    id: "item",
    label: "Name",
    minWidth: 200,
  },
  {
    id: "price",
    label: "MRP",
    minWidth: 50,
  },
  {
    id: "qty",
    label: "Available Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "sellQty",
    label: "Qty",
    minWidth: 50,
    align: "right",
    type: "input",
  },

  {
    id: "discount",
    label: "Discount",
    minWidth: 50,
    align: "right",
    type: "input",
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    padding: theme.spacing(2),
  },
  scrollContainer: {
    maxHeight: "50vh",
    padding: theme.spacing(0, 2),
    overflowY: "auto",
  },
  btn: {
    margin: theme.spacing(0, 0, 1, 0),
  },
  delBtn: {
    color: theme.palette.error.main,
    fontSize: "1.2rem",
    margin: theme.spacing(1),
  },
}));

function Shop() {
  const classes = useStyles();

  const { activeItems, qSell } = useContext(ShopDataContext);
  const { toast } = useContext(UtilityContext);

  const [rows, setRows] = useState([]);
  const [txnType, setTxnType] = useState("Cash");
  const [stock, setStock] = useState({ name: "", qty: 0, price: 0 });

  const ACRef = useRef();
  const StockRef = useRef();

  //   add items to active invoice
  const handleAdd = async (row) => {
    try {
      const newRows = [...rows];
      console.log(row, newRows);
      // check if item exists
      const item = newRows.find((i) => i.item === row.item);
      if (item) {
        item.sellQty += row.sellQty;
        // item.discount += row.discount;
        item.total += row.total;
      } else {
        newRows.push({
          item: row.item,
          sellQty: 1,
          discount: parseFloat(row.discount),
          qty: parseInt(row.qty),
          price: parseFloat(row.mrp),
          total: parseFloat(row.mrp),
        });
      }
      setRows(newRows);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const handleQtyChange = (row, colName, newVal) => {
    try {
      // change quantity in invoice
      const newRows = [...rows];
      const item = rows.find((i) => i.item === row.item);
      item[colName] = parseFloat(newVal);
      if (item.sellQty > item.qty) {
        toast("Quantity cannot be greater than available quantity", "error");
        item.sellQty = item.qty;
      }
      item.total = item.sellQty * (item.price - item.discount);
      setRows(newRows);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (index) => {
    try {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <ShopNav />
      <Grid container className={classes.container}>
        <Grid item xs={8}>
          <Typography variant="h4" component="h4">
            Sell
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" component="h4">
            Check Stock
          </Typography>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Autocomplete
              ref={ACRef}
              size="small"
              autoHighlight
              options={[]}
              // options={activeItems}
              onChange={async (event, value) => {
                await handleAdd(value);
                const ele = ACRef.current.getElementsByClassName(
                  "MuiAutocomplete-clearIndicator"
                )[0];
                if (ele) ele.click();
              }}
              getOptionLabel={(option) =>
                `${option.item}${option.barcode ? `(${option.barcode})` : ""}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item Name or Qr Code"
                  variant="outlined"
                />
              )}
            />
            <EditTable
              rows={rows}
              columns={columns}
              handleChange={handleQtyChange}
              handleDelete={handleDelete}
            />
            <Grid
              container
              style={{ marginTop: "1rem" }}
              spacing={1}
              alignItems="flex-end"
              justifyContent="space-between"
            >
              <Grid item xs={3}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={txnType}
                  onChange={(event) => {
                    setTxnType(event.target.value);
                  }}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  {["Card", "UPI"].map((datum, index) => (
                    <MenuItem key={index} value={datum}>
                      {datum}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h4" color="secondary">
                  Total :
                  {rows
                    ?.reduce((acc, i) => acc + parseFloat(i.total), 0)
                    .toLocaleString("en-IN") || 0}
                </Typography>
              </Grid>
              {/* <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={async (e) => {
                  if (rows.length > 0 && txnType !== "") {
                    if (
                      rows.reduce((acc, i) => acc + parseFloat(i.total), 0) >
                        4000 &&
                      (rows.length > 1 || rows[0].sellQty > 1)
                    ) {
                      // const invoices = await splitInvoices(rows);
                      toast("placeholder: split invoice");
                      toast("placeholder: saved split", "success");
                      setRows([]);
                      setTxnType("");
                      return;
                    }
                    // await qSell(rows, txnType);
                    toast("placeholder: saved", "success");
                    // set invoice items to empty
                    setRows([]);
                    setTxnType("");
                    return;
                  }
                  toast("form incomplete", "error");
                }}
              >
                Save and Print
              </Button>
            </Grid> */}
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  onClick={async (e) => {
                    if (rows.length) {
                      // await qSell(rows, txnType);
                      // set invoice items to empty
                      setRows([]);
                      setTxnType("Cash");
                      return;
                    }
                    toast("form incomplete", "error");
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              size="small"
              autoHighlight
              options={[]}
              ref={StockRef}
              // options={activeItems}
              onChange={async (event, value) => {
                // await checkStock(value);
                const ele = StockRef.current.getElementsByClassName(
                  "MuiAutocomplete-clearIndicator"
                )[0];
                if (ele) ele.click();
              }}
              getOptionLabel={(option) =>
                `${option.item}${option.barcode ? `(${option.barcode})` : ""}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item Name or Qr Code"
                  variant="outlined"
                />
              )}
            />
            <Typography variant="h4" component="h4" gutterBottom>
              Name : {stock.name}
            </Typography>
            <Typography variant="h4" component="h4" gutterBottom>
              stock : {stock.qty}
            </Typography>
            <Typography variant="h4" component="h4" gutterBottom>
              Price : {stock.price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Shop;
