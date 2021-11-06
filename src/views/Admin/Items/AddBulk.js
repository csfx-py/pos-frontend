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
import { MasterDataContext } from "../../../Contexts/MasterDataContext";
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
  const { addBulk } = useContext(MasterDataContext);

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
          newRow.name = datum[0];
          newRow.category = datum[1];
          newRow.brand = datum[2] || null;
          newRow.barcode = datum[3] || null;
          newRow.size = datum[4];
          newRow.purchase_price = datum[5];
          newRow.case_qty = datum[6];
          newRow.case_price = datum[7];
          newRow.mrp = datum[8];
          newRow.mrp1 = datum[9] || null;
          newRow.mrp2 = datum[10] || null;
          newRow.mrp3 = datum[11] || null;
          newRow.mrp4 = datum[12] || null;
          return newRow;
        })
      );
      setBulkRows(...dataRows);
    };

    reader.readAsBinaryString(fileData);
    setIsSubmitBtn(true);
    setIsLoading(false);
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
          Add a Brand
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
