import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useContext, useState } from "react";
import { MasterDataContext } from "../../../Contexts/MasterDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

function AddItem() {
  const classes = useStyles();

  const { setIsLoading } = useContext(UtilityContext);
  const { addItem, categories, sizes, brands } = useContext(MasterDataContext);
  const [formControlState, setFormControlState] = useState({
    name: "",
    categories_id: categories[0].id,
    sizes_id: sizes[0].id,
    brands_id: "",
    barcode: "",
    purchase_price: 0,
    case_qty: 0,
    case_price: 0,
    mrp: 0,
    mrp1: 0,
    mrp2: 0,
    mrp3: 0,
    mrp4: 0,
  });

  const handleChange = async (event) => {
    setFormControlState({
      ...formControlState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await addItem(formControlState);
    setFormControlState({
      name: "",
      categories_id: categories[0].id,
      sizes_id: sizes[0].id,
      brands_id: "",
      barcode: "",
      purchase_price: 0,
      case_qty: 0,
      case_price: 0,
      mrp: 0,
      mrp1: 0,
      mrp2: 0,
      mrp3: 0,
      mrp4: 0,
    });
    setIsLoading(false);
  };

  return (
    <Paper className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add a Size
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <TextField
              label="Item Name"
              value={formControlState.name}
              name="name"
              onChange={handleChange}
              color="secondary"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={2}>
            <InputLabel color="secondary">Category</InputLabel>
            <Select
              color="secondary"
              name="category"
              value={formControlState.categories_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select category</FormHelperText>
          </Grid>
          <Grid item xs={2}>
            <InputLabel color="secondary">Size</InputLabel>
            <Select
              color="secondary"
              name="sizes_id"
              value={formControlState.sizes_id}
              onChange={handleChange}
              fullWidth
              required
            >
              {sizes.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.size}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select size</FormHelperText>
          </Grid>
          <Grid item xs={2}>
            <InputLabel color="secondary">Brand</InputLabel>
            <Select
              color="secondary"
              value={formControlState.brands_id}
              name="brands_id"
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select brand</FormHelperText>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Purchase price"
              value={formControlState.purchase_price}
              name="purchase_price"
              type="number"
              onChange={handleChange}
              color="secondary"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Case qty"
              value={formControlState.case_qty}
              name="case_qty"
              type="number"
              onChange={handleChange}
              color="secondary"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Case price"
              value={formControlState.case_price}
              name="case_price"
              type="number"
              onChange={handleChange}
              color="secondary"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="MRP"
              value={formControlState.mrp}
              name="mrp"
              type="number"
              onChange={handleChange}
              color="secondary"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="MRP1"
              value={formControlState.mrp1}
              name="mrp1"
              type="number"
              onChange={handleChange}
              fullWidth
              color="secondary"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="MRP2"
              value={formControlState.mrp2}
              name="mrp2"
              type="number"
              onChange={handleChange}
              fullWidth
              color="secondary"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="MRP3"
              value={formControlState.mrp3}
              name="mrp3"
              type="number"
              onChange={handleChange}
              fullWidth
              color="secondary"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="MRP4"
              value={formControlState.mrp4}
              name="mrp4"
              type="number"
              onChange={handleChange}
              fullWidth
              color="secondary"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Barcode"
              value={formControlState.barcode}
              name="barcode"
              onChange={handleChange}
              fullWidth
              color="secondary"
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              type="submit"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>

    //       <FormControl className={classes.formControl}>
    //
    //         <FormHelperText>Select size</FormHelperText>
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <InputLabel color="secondary">Brand</InputLabel>
    //         <Select
    //           color="secondary"
    //           name="brand"
    //           value={formControlState.brand}
    //           onChange={handleChange}
    //           required
    //         >
    //           {brands.map((brand) => (
    //             <MenuItem key={brand} value={brand}>
    //               {brand}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //         <FormHelperText>Select brand</FormHelperText>
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="Barcode"
    //           value={formControlState.barcode}
    //           name="barcode"
    //           onChange={handleChange}
    //           color="secondary"
    //         />
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="Purchase price"
    //           value={formControlState.purchase_price}
    //           name="purchase_price"
    //           type="number"
    //           onChange={handleChange}
    //           color="secondary"
    //           required
    //         />
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="Case qty"
    //           value={formControlState.case_qty}
    //           name="case_qty"
    //           type="number"
    //           onChange={handleChange}
    //           color="secondary"
    //           required
    //         />
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="Case price"
    //           value={formControlState.case_price}
    //           name="case_price"
    //           type="number"
    //           onChange={handleChange}
    //           color="secondary"
    //           required
    //         />
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="MRP"
    //           value={formControlState.mrp}
    //           name="mrp"
    //           type="number"
    //           onChange={handleChange}
    //           color="secondary"
    //           required
    //         />
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="MRP1"
    //           value={formControlState.mrp1}
    //           name="mrp1"
    //           type="number"
    //           onChange={handleChange}
    //           color="secondary"
    //         />
    //         <FormHelperText>Leave 0 for empty value</FormHelperText>
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="MRP2"
    //           value={formControlState.mrp2}
    //           name="mrp2"
    //           type="number"
    //           onChange={handleChange}
    //           color="secondary"
    //         />
    //         <FormHelperText>Leave 0 for empty value</FormHelperText>
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="MRP3"
    //           value={formControlState.mrp3}
    //           name="mrp3"
    //           type="number"
    //           onChange={handleChange}
    //           color="secondary"
    //         />
    //         <FormHelperText>Leave 0 for empty value</FormHelperText>
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextField
    //           label="MRP4"
    //           value={formControlState.mrp4}
    //           name="mrp4"
    //           type="number"
    //           onChange={handleChange}
    //           color="secondary"
    //         />
    //         <FormHelperText>Leave 0 for empty value</FormHelperText>
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <Button
    //           variant="contained"
    //           color="secondary"
    //           size="large"
    //           type="submit"
    //         >
    //           Submit
    //         </Button>
    //       </FormControl>
    //     </form>
    //   </Paper>
    // </Grid>
  );
}

export default AddItem;
