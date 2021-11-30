import { useContext, useEffect, useState } from "react";
import { ShopDataContext } from "../../Contexts/ShopDataContext";
import {
  Button,
  Grid,
  Input,
  InputLabel,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import EditTable from "../../Components/EditTable";
import { UtilityContext } from "../../Contexts/UtilityContext";
import ShopNav from "../../Components/Shop/ShopNav";
import FilterSelect from "../../Components/FilterSelect";
import { MasterDataContext } from "../../Contexts/MasterDataContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  btn: {
    margin: theme.spacing(1),
  },
}));

const columns = [
  {
    id: "products_name",
    label: "Name",
    minWidth: 120,
  },
  {
    id: "stock",
    label: "Available Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qtyCash",
    label: "Cash sales",
    minWidth: 50,
    align: "right",
    type: "input",
  },
  {
    id: "qtyCard",
    label: "Card sales",
    minWidth: 50,
    align: "right",
    type: "input",
  },
  {
    id: "qtyUpi",
    label: "UPI sales",
    minWidth: 50,
    align: "right",
    type: "input",
  },
  {
    id: "sold",
    label: "Sold",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "close",
    label: "Closing",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
];

function ShopBulkSell() {
  const classes = useStyles();

  const { setIsLoading, toast } = useContext(UtilityContext);
  const { categories } = useContext(MasterDataContext);
  const { activeItems, bulkSell, tempSold } = useContext(ShopDataContext);

  const [tempSoldItems, setTempSoldItems] = useState([]);

  const [sDate, setSDate] = useState("");
  const [category, setCategory] = useState("");

  const [rows, setRows] = useState([]);

  const handleFilter = (e) => {
    const { value } = e.target;
    setCategory(value);
  };

  const handleQtyChange = (row, colName, newVal) => {
    try {
      // change quantity in invoice
      const newRows = [...rows];
      const item = rows.find((i) => i.products_id === row.products_id);
      item[colName] = parseFloat(newVal);
      item.close =
        item.stock - item.sold - item.qtyCash - item.qtyCard - item.qtyUpi;
      setRows(newRows);
    } catch (error) {
      console.log(error);
    }
  };

  const reset = async () => {
    const _ = activeItems.map((item) => ({
      ...item,
      qtyCash: 0,
      qtyCard: 0,
      qtyUpi: 0,
      sold: 0,
      close: 0,
    }));
    setRows(_);
    return;
  };

  useEffect(() => {
    if (rows.length > 0) {
      const newData = rows.map((item) => {
        const tempSoldItem = tempSoldItems.find(
          (i) => i.products_id === item.products_id
        );
        if (tempSoldItem) {
          return {
            ...item,
            sold: tempSoldItem.qty,
            close:
              item.stock -
              item.sold -
              item.qtyCash -
              item.qtyCard -
              item.qtyUpi,
          };
        }
        return {
          ...item,
        };
      });

      const filteredData = newData.filter((item) => {
        return category === "" || item.categories_name === category;
      });
      setRows(filteredData);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempSoldItems, category, activeItems]);

  const handleSubmit = async (e) => {
    if (sDate !== "") {
      setIsLoading(true);
      const res = await bulkSell(rows, sDate);
      if (res) {
        setRows(
          activeItems.map((item) => ({
            ...item,
            sellQty: 0,
          }))
        );
      }
      setIsLoading(false);
      return;
    }
    toast("form incomplete", "error");
  };

  return (
    <div className={classes.root}>
      <ShopNav />
      <Grid container direction="column">
        <Paper elevation={2} className={classes.paper}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Bulk Sell
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <InputLabel>Date</InputLabel>
              <Input
                type="date"
                label="Date"
                onChange={async (event) => {
                  setIsLoading(true);
                  setSDate(event.target.value);
                  console.log(event.target.value);
                  const tempData = await tempSold(event.target.value);
                  setTempSoldItems(tempData);
                  setIsLoading(false);
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FilterSelect
                value={category}
                handleFilter={handleFilter}
                data={categories}
                name="category"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <EditTable
              rows={rows}
              columns={columns}
              handleChange={handleQtyChange}
            />
          </Grid>
          <Grid container spacing={2} style={{ marginTop: "1rem" }}>
            <Grid item xs={11}>
              <Grid container spacing={2} direction="column">
                <Grid container>
                  <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom>
                      Cash sold: {""}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom>
                      Card sold: {""}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom>
                      UPI sold: {""}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom>
                      Cash bulk: {""}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom>
                      Card bulk: {""}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom>
                      UPI bulk: {""}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.btn}
                onClick={handleSubmit}
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

export default ShopBulkSell;
