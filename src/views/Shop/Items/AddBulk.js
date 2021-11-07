import {
  Button,
  Grid,
  Input,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { useContext, useRef, useState } from "react";
import XLSX from "xlsx";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

function AddBulk() {
  const classes = useStyles();

  const { setIsLoading } = useContext(UtilityContext);
  const { addBulk } = useContext(ShopDataContext);

  const [isProcessBtn, setIsProcessBtn] = useState(false);
  const [isSubmitBtn, setIsSubmitBtn] = useState(false);

  const inputRef = useRef();

  const [fileData, setFileData] = useState(null);
  const [bulkRows, setBulkRows] = useState([]);

  const handleInput = (e) => {
    setFileData(e.target.files[0]);
    setIsProcessBtn(true);
  };

  const handleProcess = (e) => {
    setIsProcessBtn(false);
    setIsLoading(true);

    const reader = new FileReader();

    reader.onload = async (_) => {
      const binStr = _.target.result;
      const workbook = XLSX.read(binStr, { type: "binary" });

      const workSheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[workSheetName];

      const data = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      data.splice(0, 1);
      let dataRows = [];
      dataRows.push(
        data.map((datum) => {
          const newRow = {};
          newRow.product = datum[0];
          newRow.stock = datum[1];
          return newRow;
        })
      );
      setBulkRows(...dataRows);
    };

    reader.readAsBinaryString(fileData);
    setIsLoading(false);
    setIsSubmitBtn(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await addBulk(bulkRows);
    setIsProcessBtn(true);
    setIsSubmitBtn(false);
    setIsLoading(false);
  };

  return (
    <Paper elevation={2} className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add Opening stock in bulk
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Input
              type="file"
              inputProps={{
                accept: ".xlsx",
              }}
              onChange={handleInput}
              ref={inputRef}
              required
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              disabled={!isProcessBtn}
              onClick={handleProcess}
            >
              Process
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isSubmitBtn}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default AddBulk;
