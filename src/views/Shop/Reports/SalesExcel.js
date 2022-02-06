import { Button, Grid, Input, InputLabel, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import DataTable from "../../../Components/DataTable";
import { ShopDataContext } from "../../../Contexts/ShopDataContext";
import { UtilityContext } from "../../../Contexts/UtilityContext";
import XLSX from "xlsx";

const columns = [
  {
    id: "range",
    label: "Vch No.",
    minWidth: 100,
    align: "left",
  },
  {
    id: "name",
    label: "Name",
    minWidth: 200,
  },
  {
    id: "qty",
    label: "Qty",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "mrp",
    label: "MRP",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
  {
    id: "total",
    label: "Amount",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-IN"),
  },
];

const SalesExcel = () => {
  const [sDate, setSDate] = useState("");
  const [rows, setRows] = useState([]);

  const [sheetData, setSheetData] = useState({
    data: [],
    cols: [
      "Vch No.",
      "Vch Type",
      "Date",
      "cope",
      "Name",
      "Address1",
      "Address2",
      "State",
      "Pin Code",
      "Regn Type",
      "GST No.",
      "Party Type",
      "Ecom merce",
      "Item Name",
      "Godown Name",
      "Unit",
      "Qty",
      "Rate",
      "Amt",
      "Tax Type",
      "TaxRate",
      "IGST",
      "CGST",
      "SGST",
      "Round off",
      "other Charges",
    ],
  });

  const { fetchExcel } = useContext(ShopDataContext);
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
              onClick={async (e) => {
                console.log("trig");
                if (sDate) {
                  const res = await fetchExcel(sDate);
                  setRows(res);
                  const data = res.map((item) => {
                    return [
                      item.range,
                      "Sales",
                      sDate,
                      "",
                      "Cash",
                      "",
                      "",
                      "Karnataka",
                      "590001",
                      "Regular",
                      "",
                      "",
                      "",
                      item.name,
                      item.category,
                      "Nos",
                      item.qty,
                      item.mrp,
                      item.total,
                      "LOC",
                      "0",
                      "0",
                      "0",
                      "0",
                      "0",
                      "0",
                    ];
                  });
                  setSheetData({ ...sheetData, data });
                } else {
                  toast("Please select date", "error");
                }
              }}
            >
              Generate Report
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={async (e) => {
                if (sheetData.data.length > 0) {
                  const wb = XLSX.utils.book_new();
                  const ws = XLSX.utils.aoa_to_sheet([
                    sheetData.cols,
                    ...sheetData.data,
                  ]);
                  XLSX.utils.book_append_sheet(wb, ws, "Sales");
                  XLSX.writeFile(wb, "Sales.xlsx", {
                    bookType: "xlsx",
                    type: "binary",
                  });
                } else {
                  toast("No data to download", "error");
                }
              }}
            >
              Save Report
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataTable rows={rows} columns={columns} />
      </Grid>
      <Grid item xs={10}></Grid>
      <Grid item xs={2}>
        <Typography variant="h6" gutterBottom>
          Total:{" "}
          {rows
            .reduce((a, b) => parseFloat(a) + parseFloat(b.total), 0)
            .toFixed(2)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SalesExcel;
