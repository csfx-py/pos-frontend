import { useContext, useEffect, useState } from "react";
import { MasterDataContext } from "../../../Contexts/MasterDataContext";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import DataTable from "../../../Components/DataTable";
import FilterSelect from "../../../Components/FilterSelect";

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
    id: "name",
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
    id: "purchase_price",
    label: "Purchase",
    minWidth: 80,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "mrp",
    label: "MRP",
    minWidth: 80,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "mrp1",
    label: "MRP1",
    minWidth: 80,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "mrp2",
    label: "MRP2",
    minWidth: 80,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "mrp3",
    label: "MRP3",
    minWidth: 80,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "mrp4",
    label: "MRP4",
    minWidth: 80,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
];

function ItemsTable() {
  const classes = useStyles();

  const { brands, categories, items, sizes } = useContext(MasterDataContext);

  const [rows, setRows] = useState(items);
  const [filter, setFilter] = useState({ category: "", size: "", brand: "" });

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    const filteredData = items.filter((item) => {
      const { category, size, brand } = filter;
      return (
        (category === "" || item.categories_name === category) &&
        (size === "" || item.size === size) &&
        (brand === "" || item.brands_name === brand)
      );
    });
    setRows(filteredData);
  }, [items, filter]);

  return (
    <Grid container direction="column">
      <Grid item xs={12}>
        {console.log(items)}
        <Paper elevation={2} className={classes.paper}>
          <Typography variant="h5" component="h2">
            Filter
          </Typography>
          <Grid container spacing={4}>
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
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
    </Grid>
  );
}

export default ItemsTable;
