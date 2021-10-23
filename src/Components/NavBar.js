import { AppBar, IconButton, makeStyles, Toolbar } from "@material-ui/core";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import logo from "../Images/liqtown.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuBtn: {
    marginRight: theme.spacing(2),
    marginLeft: "auto",
  },
  title: {
    flexGrow: 1,
  },
  img: {
    maxHeight: "55px",
  },
}));

function Navbar({ handleDrawer }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/">
            <img src={logo} alt="liquor town" className={classes.img} />
          </Link>
          <IconButton
            edge="start"
            className={classes.menuBtn}
            color="inherit"
            aria-label="menu"
            onClick={handleDrawer(true)}
          >
            <GiHamburgerMenu />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
