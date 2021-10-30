import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import AppDrawer from "../AppDrawer";
import Navbar from "../NavBar";
import Drawer from "./Drawer";

function ShopNav() {
  const [drawer, setDrawer] = useState(false);
  const handleDrawer = (val) => (e) => {
    if (e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }

    setDrawer(val);
  };

  const { checkCookie } = useContext(AuthContext);
  const history = useHistory();

  const checkUser = async () => {
    const res = await checkCookie();
    if (!res.success || res.roles_id !== 2) {
      history.push("/login");
    }
  };

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar handleDrawer={handleDrawer} />
      <AppDrawer drawer={drawer} handleDrawer={handleDrawer}>
        <Drawer handleDrawer={handleDrawer} />
      </AppDrawer>
    </>
  );
}

export default ShopNav;
