import { AppBar, makeStyles, Tab, Tabs } from "@material-ui/core";
import TabPanel from "../../Components/TabPanel";
import { useState } from "react";
import AdminNav from "../../Components/Admin/AdminNav";
import ItemsTable from "../../views/Admin/Items/ItemsTable";
import AddBrand from "../../views/Admin/Items/AddBrand";
import AddCategory from "../../views/Admin/Items/AddCategory";
import AddSize from "../../views/Admin/Items/AddSize";
import AddItem from "../../views/Admin/Items/AddItem";
import AddBulk from "../../views/Admin/Items/AddBulk";
import Modify from "../../views/Admin/Items/Modify";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function AdminItems() {
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <AdminNav />
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Items" />
          <Tab label="Add Item" />
          <Tab label="Modify" />
          <Tab label="Add Brand" />
          <Tab label="Add Category" />
          <Tab label="Add Size" />
          <Tab label="Add Bulk" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ItemsTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddItem />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Modify />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AddBrand />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <AddCategory />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <AddSize />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <AddBulk />
      </TabPanel>
    </div>
  );
}

export default AdminItems;
