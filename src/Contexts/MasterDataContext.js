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
        setBrands([...res.data]);
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
        setCategories([...res.data]);
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
        setSizes([...res.data]);
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
        const newData = res.data.map((item) => ({
          ...item,
          mrp: parseFloat(item.mrp),
          purchase_price: parseFloat(item.purchase_price),
          case_price: parseFloat(item.case_price),
          mrp1: item.mrp1 ? parseFloat(item.mrp1) : 0,
          mrp2: item.mrp2 ? parseFloat(item.mrp2) : 0,
          mrp3: item.mrp3 ? parseFloat(item.mrp3) : 0,
          mrp4: item.mrp4 ? parseFloat(item.mrp4) : 0,
          discount: parseFloat(item.discount),
        }));
        setItems([...newData]);
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

  const addItem = async (item) => {
    const {
      name,
      categories_id,
      sizes_id,
      purchase_price,
      case_qty,
      case_price,
      mrp,
    } = item;
    const brands_id = item.brands_id === "" ? null : item.brands_id;
    const barcode = item.barcode === "" ? null : item.barcode;
    const mrp1 = item.mrp1 === 0 ? null : item.mrp1;
    const mrp2 = item.mrp2 === 0 ? null : item.mrp2;
    const mrp3 = item.mrp3 === 0 ? null : item.mrp3;
    const mrp4 = item.mrp4 === 0 ? null : item.mrp4;
    try {
      const { success } = await refresh();
      if (success) {
        const res = await API.post("master/items/products", {
          name,
          categories_id,
          sizes_id,
          brands_id,
          barcode,
          purchase_price,
          case_qty,
          case_price,
          mrp,
          mrp1,
          mrp2,
          mrp3,
          mrp4,
        });
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

  const addBulk = async (items) => {
    try {
      const { success } = await refresh();
      if (success) {
        const res = await API.post("/master/items/xl-products", items);
        if (res && res.data) {
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
        addItem,
        addBulk,
      }}
    >
      {children}
    </MasterDataContext.Provider>
  );
};
