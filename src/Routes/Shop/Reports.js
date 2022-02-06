import { AppBar, makeStyles, Tab, Tabs } from "@material-ui/core";
import TabPanel from "../../Components/TabPanel";
import { useState } from "react";
import ShopNav from "../../Components/Shop/ShopNav";
import SalesReports from "../../views/Shop/Reports/SalesReports";
import PurchaseReports from "../../views/Shop/Reports/PurchaseReport";
import Invoices from "../../views/Shop/Reports/Invoices";
import Item from "../../views/Shop/Reports/Item";
import Dsr from "../../views/Shop/Reports/Dsr";
import SalesExcel from "../../views/Shop/Reports/SalesExcel";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function Reports() {
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <ShopNav />
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Invoices" />
          <Tab label="Sales" />
          <Tab label="Purchases" />
          <Tab label="Item" />
          <Tab label="DSR" />
          <Tab label="Tally Export" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Invoices />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SalesReports />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PurchaseReports />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Item />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Dsr />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <SalesExcel />
      </TabPanel>
    </div>
  );
}

export default Reports;
