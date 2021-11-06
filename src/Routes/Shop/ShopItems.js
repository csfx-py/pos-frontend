import { AppBar, makeStyles, Tab, Tabs } from "@material-ui/core";
import TabPanel from "../../Components/TabPanel";
import { useContext, useState } from "react";
import ShopNav from "../../Components/Shop/ShopNav";
// import ItemsTable from "../../views/Shop/Items/ItemsTable";
import AddBulk from "../../views/Shop/Items/AddBulk";
import { AuthContext } from "../../Contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function ShopItems() {
  const classes = useStyles();

  const { user } = useContext(AuthContext);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <ShopNav />
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Items" />
          {user.is_priviledged && <Tab label="Add Bulk" />}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {/* <ItemsTable /> */}
      </TabPanel>
      {user.is_priviledged && (
        <TabPanel value={value} index={1}>
          <AddBulk />
        </TabPanel>
      )}
    </div>
  );
}

export default ShopItems;
