import {
  Button,
  Grid,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useContext, useRef, useState } from "react";
import DataTable from "../../../Components/DataTable";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";

const columns = [
  {
    id: "date",
    label: "Date",
    minWidth: 170,
    align: "left",
  },
  {
    id: "type",
    label: "Tracnsaction type",
    minWidth: 170,
    align: "left",
  },
  {
    id: "qty",
    label: "Qty",
    minWidth: 170,
    align: "right",
  },
  {
    id: "close",
    label: "Closing",
    minWidth: 170,
    align: "right",
  },
];

function Item() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState({
    purchases: 0,
    sales: 0,
  });
  const [pid, setPid] = useState("");
  const [sDate, setSDate] = useState("");
  const [eDate, setEDate] = useState("");

  const ACRef = useRef();

  const { shopItems, fetchItemReport } = useContext(ShopDataContext);
  const { toast } = useContext(UtilityContext);

  return (
    <Grid container direction="column">
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Autocomplete
            ref={ACRef}
            size="small"
            autoHighlight
            options={shopItems}
            onChange={async (event, value) => {
              setPid(value?.products_id || pid);
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
        </Grid>
        <Grid item xs={2}>
          <InputLabel>Start Date</InputLabel>
          <Input
            type="date"
            value={sDate}
            onChange={async (e) => {
              setSDate(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <InputLabel>End Date</InputLabel>
          <Input
            type="date"
            value={eDate}
            onChange={async (e) => {
              setEDate(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={async (e) => {
              if (sDate && eDate) {
                const { txns, purchases, sales } = await fetchItemReport(
                  pid,
                  sDate,
                  eDate
                );
                setRows(txns);
                setTotal({ purchases, sales });
                const ele = ACRef.current.getElementsByClassName(
                  "MuiAutocomplete-clearIndicator"
                )[0];
                if (ele) ele.click();
              } else {
                toast("Please select start and end date", "error");
              }
            }}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
      <Typography variant="h6" gutterBottom>
        Total Purchase: {total.purchases}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Total Sales: {total.sales}
      </Typography>
    </Grid>
  );
}

export default Item;
