import { useContext, useEffect, useState } from "react";
import { MasterDataContext } from "../../../Contexts/MasterDataContext";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import DataTable from "../../../Components/DataTable";
import FilterSelect from "../../../Components/FilterSelect";
import printRows from "../../../utils/printRows";

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
    id: "categories_name",
    label: "Category",
    minWidth: 50,
  },
  {
    id: "size",
    label: "Size",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "brands_name",
    label: "Brand",
    minWidth: 60,
  },
  {
    id: "mrp",
    label: "MRP",
    minWidth: 80,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "stock",
    label: "Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
];

function ItemsTable() {
  const classes = useStyles();

  const { brands, categories, sizes } = useContext(MasterDataContext);
  const { shopItems } = useContext(ShopDataContext);

  const [rows, setRows] = useState(shopItems);
  const [filter, setFilter] = useState({
    category: "",
    size: "",
    brand: "",
    keyword: "",
  });

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    const filteredData = shopItems.filter((item) => {
      const { category, size, brand, keyword } = filter;
      return (
        (category === "" || item.categories_name === category) &&
        (size === "" || item.size === size) &&
        (brand === "" || item.brands_name === brand) &&
        (keyword === "" ||
          item.products_name.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
    setRows(filteredData);
  }, [shopItems, filter]);

  return (
    <Grid container direction="column">
      <Grid item xs={12}>
        <Paper elevation={2} className={classes.paper}>
          <Typography variant="h5" component="h2">
            Filter
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <FilterSelect
              value={filter.category}
              handleFilter={handleFilter}
              data={categories}
              name="category"
            />
            <FilterSelect
              value={filter.size}
              handleFilter={handleFilter}
              data={sizes}
              name="size"
            />
            <FilterSelect
              value={filter.brand}
              handleFilter={handleFilter}
              data={brands}
              name="brand"
            />
            <TextField
              value={filter.keyword}
              onChange={handleFilter}
              name="keyword"
              label="Item Name"
            />
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
      <iframe
        title="invoice"
        id="dsr-print"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
      <Grid item xs={2}>
        <Button variant="contained" color="primary" onClick={async (e) => {
          if (rows.length > 0) {
            printRows(rows)
          }
        }}>
          Print Report
        </Button>
      </Grid>
    </Grid>
  );
}

export default ItemsTable;
