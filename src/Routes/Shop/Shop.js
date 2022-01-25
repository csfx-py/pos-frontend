import {
  Button,
  Grid,
  Input,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useContext, useRef, useState } from "react";
import { UtilityContext } from "../../Contexts/UtilityContext";
import { ShopDataContext } from "../../Contexts/ShopDataContext";
import ShopNav from "../../Components/Shop/ShopNav";
import EditTable from "../../Components/EditTable";
import printInvoice from "../../utils/printInvoice";

const columns = [
  {
    id: "products_name",
    label: "Name",
    minWidth: 200,
  },
  {
    id: "mrp",
    label: "MRP",
    minWidth: 50,
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "stock",
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
    priviledged: true,
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

  const { activeItems, qSell, fetchInvoices, shopDetails } =
    useContext(ShopDataContext);
  const { toast, setIsLoading } = useContext(UtilityContext);

  const [rows, setRows] = useState([]);
  const [txnType, setTxnType] = useState("Cash");
  const [sDate, setSDate] = useState("");
  const [stock, setStock] = useState({ name: "", qty: 0, price: 0 });

  const ACRef = useRef();
  const StockRef = useRef();

  //   add items to active invoice
  const handleAdd = async (row) => {
    if (row)
      try {
        const newRows = [...rows];
        // check if item exists
        const item = newRows.find((i) => i.products_id === row.products_id);
        if (item) {
          item.sellQty += 1;
          item.total += parseFloat(row.mrp) - parseFloat(row.discount);
        } else {
          newRows.unshift({
            products_id: row.products_id,
            products_name: row.products_name,
            sellQty: 1,
            discount: parseFloat(row.discount),
            stock: parseInt(row.stock),
            mrp: parseFloat(row.mrp),
            total: parseFloat(row.mrp),
          });
        }
        setRows(newRows);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    return false;
  };

  const handleQtyChange = (row, colName, newVal) => {
    try {
      // change quantity in invoice
      const newRows = [...rows];
      const item = rows.find((i) => i.products_id === row.products_id);
      item[colName] = parseFloat(newVal);
      if (item.sellQty > item.stock) {
        toast("Quantity cannot be greater than available quantity", "error");
        item.sellQty = item.stock;
      }
      item.total = item.sellQty * (item.mrp - item.discount);
      setRows(newRows);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (row) => {
    try {
      const newRows = rows.filter((i) => i.products_id !== row.products_id);
      setRows(newRows);
    } catch (error) {
      console.log(error);
    }
  };

  const checkStock = async (_) => {
    if (_)
      setStock({
        name: _.products_name,
        qty: _.stock,
        price: _.mrp,
      });
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
            <Grid
              container
              spacing={1}
              alignItems="flex-end"
              justifyContent="space-between"
              style={{ marginBottom: "1rem" }}
            >
              <Grid item xs={2}>
                <Input
                  type="date"
                  label="Date"
                  onChange={async (event) => {
                    setSDate(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
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
            </Grid>
            <Autocomplete
              ref={ACRef}
              size="small"
              autoHighlight
              options={activeItems}
              onChange={async (event, value) => {
                await handleAdd(value);
                const ele = ACRef.current.getElementsByClassName(
                  "MuiAutocomplete-clearIndicator"
                )[0];
                if (ele) ele.click();
              }}
              getOptionLabel={(option) =>
                `${option.products_name}${
                  option.barcode ? `(${option.barcode})` : ""
                }`
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
                <Typography variant="h4" color="secondary">
                  Total :
                  {rows
                    ?.reduce((acc, i) => acc + parseFloat(i.total), 0)
                    .toLocaleString("en-IN") || 0}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={async (e) => {
                    if (rows.length) {
                      // confirm
                      const res = window.confirm(
                        "Are you sure you want to sell these items?"
                      );
                      if (res) {
                        setIsLoading(true);
                        const { sales_no } = await qSell(rows, txnType, sDate);
                        // set invoice items to empty
                        setRows([]);
                        setTxnType("Cash");

                        if (sales_no) {
                          // print invoices
                          const { invoices } = await fetchInvoices(
                            new Date(),
                            new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                          );
                          const sold_invoices = invoices.filter(
                            (inv) => inv.sales_no === sales_no
                          );
                          // from sold_invoices put all rows with same invoice_number in one array
                          let grouped = [];
                          sold_invoices.forEach((inv) => {
                            const item = grouped.find(
                              (i) => i.invoice_number === inv.invoice_number
                            );
                            if (item) {
                              item.rows.push(inv);
                            } else {
                              grouped.push({
                                invoice_number: inv.invoice_number,
                                rows: [inv],
                              });
                            }
                          });

                          printInvoice(grouped, shopDetails);
                        }
                        setIsLoading(false);
                        return;
                      }
                      return;
                    }
                    toast("form incomplete", "error");
                  }}
                >
                  Save and Print
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  onClick={async (e) => {
                    if (rows.length) {
                      // confirm
                      const res = window.confirm(
                        "Are you sure you want to sell these items?"
                      );
                      if (res) {
                        setIsLoading(true);
                        await qSell(rows, txnType, sDate);
                        // set invoice items to empty
                        setRows([]);
                        setTxnType("Cash");
                        setIsLoading(false);
                        return;
                      }
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
              ref={StockRef}
              options={activeItems}
              onChange={async (event, value) => {
                await checkStock(value);
                const ele = StockRef.current.getElementsByClassName(
                  "MuiAutocomplete-clearIndicator"
                )[0];
                if (ele) ele.click();
              }}
              getOptionLabel={(option) =>
                `${option.products_name}${
                  option.barcode ? `(${option.barcode})` : ""
                }`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item Name or Qr Code"
                  variant="outlined"
                />
              )}
            />
            <Typography
              variant="h4"
              component="h4"
              gutterBottom
              style={{ marginTop: "1rem" }}
            >
              Name : {stock.name}
            </Typography>
            <Typography variant="h4" component="h4" gutterBottom>
              Stock : {stock.qty}
            </Typography>
            <Typography variant="h4" component="h4" gutterBottom>
              Price : Rs {stock.price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <iframe
        title="invoice"
        id="ifmcontentstoprint"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
    </div>
  );
}

export default Shop;
