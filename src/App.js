import { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UtilityContext } from "./Contexts/UtilityContext";
import Loading from "./Components/Loading";
import { makeStyles } from "@material-ui/core";
import Login from "./Routes/Login";
import ReDash from "./Components/ReDash";
import Admin from "./Routes/Admin/Admin";
import AdminItems from "./Routes/Admin/AdminItems";
import { MasterDataProvider } from "./Contexts/MasterDataContext";
import Shop from "./Routes/Shop";
import { ShopDataProvider } from "./Contexts/ShopDataContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  const { isLoading } = useContext(UtilityContext);
  return (
    <div className={classes.root}>
      <Router>
        {isLoading && <Loading />}
        <MasterDataProvider>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/admin/items" component={AdminItems} />
            <Route exact path="/shop">
              <ShopDataProvider>
                <Shop />
              </ShopDataProvider>
            </Route>
            <Route path="*" component={ReDash} />
          </Switch>
        </MasterDataProvider>
      </Router>
    </div>
  );
}

export default App;
