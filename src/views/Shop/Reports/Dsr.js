import { Button, Grid, Input, InputLabel } from "@material-ui/core";
import { useContext, useState } from "react";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";
import printDsr from "../../../utils/printDsr";

function Dsr() {
  const [sDate, setSDate] = useState("");

  const { fetchDsr, shopDetails } = useContext(ShopDataContext);
  const { toast } = useContext(UtilityContext);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <InputLabel>Date</InputLabel>
            <Input
              type="date"
              value={sDate}
              onChange={async (e) => {
                setSDate(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={async (e) => {
                if (sDate) {
                  const res = await fetchDsr(sDate);
                  if (res.length > 0) {
                   return printDsr(res, sDate, shopDetails);
                  }
                  return toast("No data found", "info");
                }
                toast("Please select a date", "error");
              }}
            >
              Print Report
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <iframe
        title="invoice"
        id="dsr-print"
        style={{ height: "0px", width: "0px", position: "absolute" }}
      ></iframe>
    </Grid>
  );
}

export default Dsr;
