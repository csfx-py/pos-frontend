import { createContext, useContext, useEffect, useState } from "react";
import { UtilityContext } from "./UtilityContext";
import { AuthContext } from "./AuthContext";
import API from "../utils/api";

export const ShopDataContext = createContext();

export const ShopDataProvider = ({ children }) => {
  const { toast } = useContext(UtilityContext);
  const { refresh, user } = useContext(AuthContext);

  const [shopItems, setShopItems] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
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

  const fetchSales = async (sDate, eDate) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.post("shop/sales-report", {
          shops_id: shops_id[0],
          sDate,
          eDate,
        });

        if (res && res.data) {
          const newData = res.data.sales.map((datum) => ({
            ...datum,
            total: (
              datum.price *
              (parseInt(datum.qty_card || 0) +
                parseInt(datum.qty_cash || 0) +
                parseInt(datum.qty_upi || 0))
            ).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              currency: "INR",
            }),
          }));
          console.log(newData);
          return [...newData];
        }

        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const fetchPurchases = async (sDate, eDate) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.post("shop/purchase-report", {
          shops_id: shops_id[0],
          sDate,
          eDate,
        });

        if (res && res.data) {
          const newData = res.data.purchase.map((datum) => ({
            ...datum,
            total: (
              datum.price *
              (parseInt(datum.qty_card || 0) +
                parseInt(datum.qty_cash || 0) +
                parseInt(datum.qty_upi || 0))
            ).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              currency: "INR",
            }),
          }));
          return [...newData];
        }

        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const fetchInvoices = async (sDate, eDate) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.post("shop/invoices", {
          shops_id: shops_id[0],
          sDate,
          eDate,
        });

        if (res && res.data) {
          const newData = res.data.invoices.map((datum) => ({
            ...datum,
            invoice_date: new Date(datum.invoice_date).toLocaleDateString(),
          }));
          newData.sort((a, b) => {
            return new Date(a.invoice_date) - new Date(b.invoice_date);
          });
          return [...newData];
        }

        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const fetchItemReport = async (pid, sDate, eDate) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.post("shop/product/invoices", {
          id: pid,
          shops_id: shops_id[0],
          sDate,
          eDate,
        });

        if (res && res.data) {
          const purchase = res.data.purchase.map((datum) => ({
            ...datum,
            type: "purchase",
            qty: "+" + datum.qty,
            date: new Date(datum.purchase_date).toLocaleDateString(),
          }));
          const sales = res.data.sales.map((datum) => ({
            ...datum,
            type: "sales",
            qty: "-" + datum.qty,
            date: new Date(datum.sales_date).toLocaleDateString(),
          }));

          const merged = [...purchase, ...sales];

          // sort merged according to date
          merged.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
          });

          return [...merged];
        }
        return [];
      }
      return [];
    } catch (error) {
      return [];
    }
  };


  useEffect(() => {
    fetchItems();
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
        return [];
      }
      return [];
    } catch (error) {
      toast(error.response.data, "error");
      return [];
    }
  };

  const bulkSell = async (data, sales_date) => {
    try {
      const { success, shops_id } = await refresh();
      console.log(data);
      if (success) {
        const finalData = data
          .filter(
            (datum) =>
              datum.qtyCard > 0 || datum.qtyCash > 0 || datum.qtyUpi > 0
          )
          .map(
            ({
              qtyCash: qty_cash,
              qtyCard: qty_card,
              qtyUpi: qty_upi,
              mrp: price,
              ...rest
            }) => ({
              ...rest,
              qty_cash,
              qty_card,
              qty_upi,
              price,
            })
          );
        const res = await API.post("/shop/blkSales", {
          shops_id: shops_id[0],
          users_id: user.id,
          items: finalData,
          sales_date,
        });
        if (res && res.data) {
          toast("Bulk sold, for results press F12", "success");
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
    <ShopDataContext.Provider
      value={{
        shopItems,
        activeItems,
        addBulk,
        qSell,
        tempSold,
        bulkSell,
        purchase,
        fetchPurchases,
        fetchSales,
        fetchInvoices,
        fetchItemReport,
      }}
    >
      {children}
    </ShopDataContext.Provider>
  );
};
