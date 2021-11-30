import { AppBar, makeStyles, Tab, Tabs } from "@material-ui/core";
import TabPanel from "../../Components/TabPanel";
import { useState } from "react";
import ShopNav from "../../Components/Shop/ShopNav";
import SalesReports from "../../views/Shop/Items/SalesReports";
import PurchaseReports from "../../views/Shop/Items/PurchaseReport";

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
          <Tab label="Sales" />
          <Tab label="Purchases" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <SalesReports />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PurchaseReports />
      </TabPanel>
    </div>
  );
}

export default Reports;
