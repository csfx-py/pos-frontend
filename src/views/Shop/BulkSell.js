import { useContext, useEffect, useState } from "react";
import { ShopDataContext } from "../../Contexts/ShopDataContext";
import {
  Button,
  Grid,
  Input,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import SellTable from "../../Components/Shop/SellTable";
import { UtilityContext } from "../../Contexts/UtilityContext";
import ShopNav from "../../Components/Shop/ShopNav";

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
    id: "item",
    label: "Name",
    minWidth: 120,
  },
  {
    id: "mrp",
    label: "MRP",
    minWidth: 80,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "open",
    label: "Opening Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "purchase",
    label: "Purchase Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "qty",
    label: "Available Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "sold",
    label: "Sold Today",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "sellQty",
    label: "Sold Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
    type: "input",
  },
];

function BulkSell() {
  const classes = useStyles();

  const { setIsLoading, toast } = useContext(UtilityContext);
  const { activeItems, bulkSell } = useContext(ShopDataContext);

  const [sDate, setSDate] = useState("");

  const [rows, setRows] = useState(
    activeItems.map((item) => ({
      ...item,
      sellQty: 0,
    }))
  );

  const handleChange = (row, newSellQty) => {
    newSellQty = parseInt(newSellQty);
    setRows(
      rows.map((item) => {
        if (item.item === row.item) {
          if (newSellQty > parseInt(item.qty))
            toast("Sell Quantity more than available quantity", "error");
          return {
            ...item,
            sellQty: newSellQty,
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    setRows(activeItems);
  }, [activeItems]);

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
          <Grid item xs={2}>
            <Input
              type="date"
              label="Date"
              onChange={(event) => {
                setSDate(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <SellTable
              rows={rows}
              columns={columns}
              handleChange={handleChange}
            />
          </Grid>
          <Grid container spacing={2} style={{ marginTop: "1rem" }}>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
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

export default BulkSell;
