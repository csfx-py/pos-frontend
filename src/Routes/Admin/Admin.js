import { Button, Grid, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import AdminNav from "../../Components/Admin/AdminNav";
import banner from "../../Images/banner.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    marginBottom: "1rem",
    marginTop: "1rem",
  },
  btn: {
    width: "144px",
    margin: "8px 0",
  },
}));

function Admin() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AdminNav />
      <Grid container>
        <Grid item xs={12} md={6}>
          <Grid
            container
            spacing={3}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={6} className={classes.item}>
              <Link to="/admin/purchase">
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                >
                  Purchase
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <Link to="/admin/sales">
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                >
                  Sales
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <Link to="/admin/items">
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                >
                  Items
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <Link to="/admin/order">
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                >
                  Orders
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className={classes.item}>
              <Link to="/admin/users">
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                >
                  Users
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <img src={banner} alt="banner" className={classes.banner} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Admin;
