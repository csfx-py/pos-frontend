import {
  Button,
  Grid,
  makeStyles,
  Paper,
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

function AddBrand() {
  const classes = useStyles();

  const { setIsLoading } = useContext(UtilityContext);
  const { addBrand } = useContext(MasterDataContext);

  const [brand, setBrand] = useState("");

  const handleChange = async (event) => {
    setBrand(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await addBrand(brand);
    setBrand("");
    setIsLoading(false);
  };
  return (
    <Paper elevation={2} className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add a Brand
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <TextField
              label="Brand Name"
              value={brand}
              onChange={handleChange}
              color="secondary"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default AddBrand;
