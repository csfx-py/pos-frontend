import {
  Button,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useRef } from "react";
import { useContext, useState } from "react";
import { MasterDataContext } from "../../../Contexts/MasterDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

function Modify() {
  const classes = useStyles();

  const ACRef = useRef();
  const [pid, setPid] = useState("");
  const [field, setField] = useState("");
  const [newValue, setNewValue] = useState("");
  const { setIsLoading, toast } = useContext(UtilityContext);
  const { items, updateField } = useContext(MasterDataContext);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <InputLabel>Name</InputLabel>
          <Autocomplete
            ref={ACRef}
            autoHighlight
            options={items}
            onChange={async (event, value) => {
              setPid(value?.id || pid);
              const ele = ACRef.current.getElementsByClassName(
                "MuiAutocomplete-clearIndicator"
              )[0];
              if (ele) ele.click();
            }}
            getOptionLabel={(option) =>
              `${option.name}${option.barcode ? `(${option.barcode})` : ""}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item Name or Qr Code"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <InputLabel>Field to modify</InputLabel>
          <Select
            label="Field to modify"
            value={field}
            onChange={(event) => setField(event.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="purchase_price">Purchase Price</MenuItem>
            <MenuItem value="case_price">Case Price</MenuItem>
            <MenuItem value="mrp">MRP</MenuItem>
            <MenuItem value="mrp1">MRP1</MenuItem>
            <MenuItem value="mrp2">MRP2</MenuItem>
            <MenuItem value="mrp3">MRP3</MenuItem>
            <MenuItem value="mrp4">MRP4</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={3}>
          <InputLabel>New Value</InputLabel>
          <TextField
            label="New Value"
            variant="outlined"
            fullWidth
            onChange={(event) => setNewValue(event.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={async (e) => {
              if (!pid || !field || !newValue)
                return toast("Please fill all fields", "error");
              setIsLoading(true);
              await updateField(pid, field, newValue);
              setIsLoading(false);
            }}
          >
            Modify
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Modify;
