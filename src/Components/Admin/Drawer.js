import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { useContext } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

function AdminDrawer({ handleDrawer }) {
  const classes = useStyles();

  const { logout } = useContext(AuthContext);

  const history = useHistory();
  return (
    <div
      className={classes.list}
      onClick={handleDrawer(false)}
      onKeyDown={handleDrawer(false)}
    >
      <List>
        <ListItem>
          <Link to="/admin/items">
            <ListItemText primary="Items" />
          </Link>
        </ListItem>
        <ListItem>
          <Link to="/admin/admin">
            <ListItemText primary="Management" />
          </Link>
        </ListItem>
        <ListItem>
          <Link to="/admin/purchase-reports">
            <ListItemText primary="Purchase Reports" />
          </Link>
        </ListItem>
        <ListItem>
          <Link to="/admin/sales-reports">
            <ListItemText primary="Sales Reports" />
          </Link>
        </ListItem>
        <ListItem>
          <Link to="/admin/orders">
            <ListItemText primary="Orders" />
          </Link>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem
          button
          onClick={async (e) => {
            const res = await logout();
            if (res) {
              history.push("/");
            }
          }}
        >
          <ListItemIcon>
            <BiLogOutCircle />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
}

export default AdminDrawer;
