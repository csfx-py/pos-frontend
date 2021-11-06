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

  const { user, logout } = useContext(AuthContext);

  const history = useHistory();
  return (
    <div
      className={classes.list}
      onClick={handleDrawer(false)}
      onKeyDown={handleDrawer(false)}
    >
      <List>
        <ListItem>
          <ListItemText primary={`User: ${user.name}`} />
        </ListItem>
        <ListItem>
          <Link to="/shop">
            <ListItemText primary="Sell" />
          </Link>
        </ListItem>
        <ListItem>
          <Link to="/shop/items">
            <ListItemText primary="Items" />
          </Link>
        </ListItem>
        {user.is_priviledged && (
          <ListItem>
            <Link to="/shop/sell-bulk">
              <ListItemText primary="Bulk Sell" />
            </Link>
          </ListItem>
        )}
        {user.is_priviledged && (
          <ListItem>
            <Link to="/shop/purchase">
              <ListItemText primary="Purchase" />
            </Link>
          </ListItem>
        )}
        {user.is_priviledged && (
          <ListItem>
            <Link to="/shop/reports">
              <ListItemText primary="Reports" />
            </Link>
          </ListItem>
        )}
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
