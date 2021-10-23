import { Drawer } from "@material-ui/core";

function AppDrawer({ drawer, handleDrawer, children }) {
  return (
    <Drawer anchor="left" open={drawer} onClose={handleDrawer(false)}>
      {children}
    </Drawer>
  );
}

export default AppDrawer;