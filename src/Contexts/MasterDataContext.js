import { createContext, useContext, useEffect, useState } from "react";
import { UtilityContext } from "./UtilityContext";
import { AuthContext } from "./AuthContext";
import API from "../utils/api";

export const MasterDataContext = createContext();

export const MasterDataProvider = ({ children }) => {
  const { toast } = useContext(UtilityContext);
  const { user, refresh } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [changesMade, setChangesMade] = useState(0);

  const fetchBrands = async () => {
    try {
      const res = await API.get("/master/items/brand");

      if (res.status === 200 && res.data.length > 0) {
        const newData = res.data.map((datum) => datum.name);
        setBrands([...newData]);
        return;
      }
      toast(res.data);
    } catch (error) {
      toast(error.response.data, "error");
      return;
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/master/items/category");

      if (res.status === 200 && res.data.length > 0) {
        const newData = res.data.map((datum) => datum.name);
        setCategories([...newData]);
        return;
      }
      toast(res.data);
    } catch (error) {
      toast(error.response.data, "error");
      return;
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await API.get("/master/items/size");

      if (res.status === 200 && res.data.length > 0) {
        const newData = res.data.map((datum) => datum.size);
        setSizes([...newData]);
        return;
      }
      toast(res.data);
    } catch (error) {
      toast(error.response.data, "error");
      return;
    }
  };

  const fetchItems = async () => {
    try {
      const res = await API.get("/master/items/items");

      if (res.status === 200 && res.data.length > 0) {
        console.log(res.data);
        setItems([...res.data]);
        return true;
      }
      toast(res.data);
      return false;
    } catch (error) {
      toast(error.response.data, "error");
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchSizes();
      await fetchBrands();
      await fetchItems();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changesMade]);

  const addCategory = async (name) => {
    try {
      const { success } = await refresh();
      if (success) {
        const res = await API.post("/master/items/category", { name });
        if (res && res.data) {
          toast(name + " added", "success");
          setChangesMade(changesMade + 1);
          return true;
        }
        toast(res.data);
        return false;
      }
      return false;
    } catch (error) {
      toast(error.response.data, "error");
      return false;
    }
  };

  const addBrand = async (name) => {
    try {
      const { success } = await refresh();
      if (success) {
        const res = await API.post("/master/items/brand", { name });
        if (res && res.data) {
          toast(name + " added", "success");
          setChangesMade(changesMade + 1);
          return true;
        }
        toast(res.data);
        return false;
      }
      return false;
    } catch (error) {
      toast(error.response.data, "error");
      return false;
    }
  };

  const addSize = async (size) => {
    try {
      const { success } = await refresh();
      if (success) {
        const res = await API.post("/master/items/size", { size });
        if (res && res.data) {
          toast(size + " added", "success");
          setChangesMade(changesMade + 1);
          return true;
        }
        toast(res.data);
        return false;
      }
      return false;
    } catch (error) {
      toast(error.response.data, "error");
      return false;
    }
  };

  const addBulk = async (items) => {
    try {
      const { success } = await refresh();
      if (success) {
        const res = await API.post("/master/items/xl-products", items);
        if (res && res.data) {
          console.log(res.data);
          toast("Bulk added, for results press F12", "success");
          setChangesMade(changesMade + 1);
          return true;
        }
        toast(res.data);
        return false;
      }
      return false;
    } catch (error) {
      toast(error.response.data, "error");
      return false;
    }
  };

  return (
    <MasterDataContext.Provider
      value={{
        brands,
        categories,
        items,
        sizes,
        addBrand,
        addCategory,
        addSize,
        addBulk,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
};
