import { createContext, useContext, useEffect, useState } from "react";
import { UtilityContext } from "./UtilityContext";
import { AuthContext } from "./AuthContext";
import API from "../utils/api";

export const ShopDataContext = createContext();

export const ShopDataProvider = ({ children }) => {
  const { toast } = useContext(UtilityContext);
  const { refresh } = useContext(AuthContext);

  const [shopItems, setShopItems] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [salesReports, setSalesReports] = useState([]);
  const [purchaseReports, setPurchaseReport] = useState([]);
  const [changesMade, setChangesMade] = useState(0);

  const fetchItems = async () => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.get("/shop/items", {
          params: {
            shops_id: shops_id[0],
          },
        });

        if (res && res.data?.length > 0) {
          const newData = res.data.map((datum) => ({
            ...datum,
            mrp: parseFloat(datum.mrp),
            purchase_price: parseFloat(datum.purchase_price),
          }));
          setShopItems([...newData]);
          setActiveItems(newData.filter((item) => item.stock > 0));
          return true;
        }

        toast(res.data);
        return false;
      }
    } catch (error) {
      toast(error.response.data, "error");
      return false;
    }
  };

  // const fetchSales = async () => {
  //   try {
  //     const { success, shop, token } = await refresh();
  //     if (success) {
  //       const res = await API.get("shop/get-sales", {
  //         params: {
  //           shop,
  //         },
  //         headers: { auth: token },
  //       });

  //       if (res && res.data?.length > 0) {
  //         const newData = res.data.map((datum) => ({
  //           ...datum,
  //           sales_date: datum.sales_date
  //             .match(/([^T]+)/)[0]
  //             .split("-")
  //             .reverse()
  //             .join("/"),
  //           total: (
  //             datum.price *
  //             (parseInt(datum.qty_card || 0) +
  //               parseInt(datum.qty_cash || 0) +
  //               parseInt(datum.qty_upi || 0))
  //           ).toLocaleString("en-IN", {
  //             maximumFractionDigits: 2,
  //             currency: "INR",
  //           }),
  //         }));
  //         setSalesReports(newData);
  //         return true;
  //       }

  //       toast(res.data);
  //       return false;
  //     }
  //   } catch (error) {
  //     toast(error.response.data, "error");
  //     return false;
  //   }
  // };

  // const fetchPurchases = async () => {
  //   try {
  //     const { success, shop, token } = await refresh();
  //     if (success) {
  //       const res = await API.get("/shop/get-purchase", {
  //         params: {
  //           shop,
  //         },
  //         headers: { auth: token },
  //       });

  //       if (res && res.data?.length > 0) {
  //         const newData = res.data.map((datum) => ({
  //           ...datum,
  //           purchase_date: datum.purchase_date
  //             .match(/([^T]+)/)[0]
  //             .split("-")
  //             .reverse()
  //             .join("/"),
  //           total: (datum.price * datum.qty).toLocaleString("en-IN", {
  //             maximumFractionDigits: 2,
  //             currency: "INR",
  //           }),
  //         }));
  //         setPurchaseReport(newData);
  //         return true;
  //       }

  //       toast(res.data);
  //       return false;
  //     }
  //   } catch (error) {
  //     toast(error.response.data, "error");
  //     return false;
  //   }
  // };

  // const fetchReports = async () => {
  //   await fetchSales();
  //   await fetchPurchases();
  // };

  useEffect(() => {
    fetchItems();
    // fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changesMade]);

  const addBulk = async (data) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const finalData = data.map((datum) => ({
          ...datum,
          shops_id: shops_id[0],
        }));
        const res = await API.post("/shop/stock", finalData);
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

  // const splitInvoices = async () => {
  //   const invToSplit = [
  //     ...invoices[activeInvoiceNum].sort((a, b) => a.price - b.price),
  //   ];

  //   // delete active invoice
  //   const filteredInvoices = [
  //     ...invoices.filter((inv, index) => index !== activeInvoiceNum),
  //   ];

  //   const split = await splitter(invToSplit);

  //   const newInvoices = [...filteredInvoices, ...split];
  //   setInvoices(newInvoices);
  //   return;
  // };

  const qSell = async (data, transaction_type) => {
    try {
      const { success, shops_id, id } = await refresh();
      if (success) {
        const finalData = data.map((datum) => ({
          products_id: datum.products_id,
          qty: datum.sellQty,
          price: datum.mrp,
        }));
        const res = await API.post("/shop/sale", {
          shops_id: shops_id[0],
          users_id: id,
          transaction_type,
          items: finalData,
        });
        if (res && res.data) {
          toast("Q-Sell added, for results press F12", "success");
          setChangesMade(changesMade + 1);
          console.log(res.data);
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

  const purchase = async (data, purchase_date) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const finalData = data.map((datum) => ({
          shops_id: shops_id[0],
          products_id: datum.products_id,
          purchase_date,
          qty_case: datum.qty_case,
          qty_item: datum.qty_unit,
        }));

        console.log(finalData);

        const res = await API.post("/shop/purchase", finalData);
        if (res && res.data) {
          toast("Processed, for results press F12", "success");
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

  const tempSold = async (sales_date) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.get("/shop/temp-sold", {
          params: {
            shops_id: shops_id[0],
            sales_date,
          },
        });
        if (res && res.data) {
          console.log(res.data);
          return [...res.data];
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

  const bulkSell = async (data, sales_date) => {
    try {
      const { success, shop } = await refresh();
      console.log(data);
      // if (success) {
      //   const finalData = data
      //     .filter((datum) => datum.sellQty > 0)
      //     .map((datum) => ({
      //       sales_date,
      //       shop,
      //       item: datum.item,
      //       price: datum.mrp,
      //       qty: datum.sellQty,
      //     }));

      //   const res = await API.post("/shop/bulksell", finalData);
      //   if (res && res.data) {
      //     toast("Bulk sold, for results press F12", "success");
      //     setChangesMade(changesMade + 1);
      //     return true;
      //   }
      //   toast(res.data);
      //   return false;
      // }
      return false;
    } catch (error) {
      toast(error.response.data, "error");
      return false;
    }
  };

  return (
    <ShopDataContext.Provider
      value={{
        shopItems,
        activeItems,
        // invoices,
        // splitInvoices,
        // setInvoices,
        // activeInvoiceNum,
        // setActiveInvoiceNum,
        addBulk,
        qSell,
        tempSold,
        bulkSell,
        purchase,
        salesReports,
        purchaseReports,
      }}
    >
      {children}
    </ShopDataContext.Provider>
  );
};
