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

function AddCategory() {
  const classes = useStyles();

  const { setIsLoading } = useContext(UtilityContext);
  const { addCategory } = useContext(MasterDataContext);

  const [category, setCategory] = useState("");

  const handleChange = async (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await addCategory(category);
    setCategory("");
    setIsLoading(false);
  };
  return (
    <Paper elevation={2} className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add a Category
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <TextField
              label="Category Name"
              value={category}
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

export default AddCategory;
