import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: "250px",
  },
  menuPaper: {
    maxHeight: 300,
  },
}));

function FilterSelect({ value, handleFilter, data, name }) {
  const classes = useStyles();

  return (
    <Grid item>
      <InputLabel>{name}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={handleFilter}
        className={classes.select}
        MenuProps={{ classes: { paper: classes.menuPaper } }}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {data.length > 0 &&
          data.map((datum, index) => (
            <MenuItem key={index} value={datum.name || datum.size}>
              {datum.name || datum.size}
            </MenuItem>
          ))}
      </Select>
    </Grid>
  );
}

export default FilterSelect;
