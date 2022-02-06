import { createContext, useContext, useEffect, useState } from "react";
import { UtilityContext } from "./UtilityContext";
import { AuthContext } from "./AuthContext";
import API from "../utils/api";

export const ShopDataContext = createContext();

export const ShopDataProvider = ({ children }) => {
  const { toast } = useContext(UtilityContext);
  const { refresh, user } = useContext(AuthContext);

  const [shopDetails, setShopDetails] = useState({});
  const [shopItems, setShopItems] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [changesMade, setChangesMade] = useState(0);

  const fetchShopDetails = async () => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.get("/shop/shop-details", {
          params: {
            shops_id: shops_id[0],
          },
        });
        if (res.data) {
          setShopDetails(res.data);
          return true;
        }
        return false;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

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
      return false;
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
            mrp: parseFloat(datum.mrp).toFixed(2),
            total: parseFloat(datum.total).toFixed(2),
          }));
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
          return [...res.data.purchase];
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
          const newInvoices = res.data.invoices.map((datum) => ({
            ...datum,
            invoice_date: new Date(datum.invoice_date).toLocaleDateString(),
          }));
          const newReport = res.data.invoiceReports.map((datum) => ({
            ...datum,
            invoice_date: new Date(datum.invoice_date).toLocaleDateString(),
          }));
          return {
            invoices: [...newInvoices],
            invoiceReports: [...newReport],
          };
        }

        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const fetchExcel = async (sDate) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.post("shop/excel-report", {
          shops_id: shops_id[0],
          sDate,
        });

        if (res && res.data) {
          const newData = res.data.sales.map((datum) => ({
            ...datum,
            mrp: parseFloat(datum.mrp).toFixed(2),
            total: parseFloat(datum.total).toFixed(2),
            range: `${res.data.range[1].invoice_number} to ${res.data.range[0].invoice_number}`,
          }));
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
        const res = await API.post("shop/product-transactions", {
          id: pid,
          shops_id: shops_id[0],
          sDate,
          eDate,
        });

        if (res && res.data) {
          const op = {
            type: "opening",
            qty: res.data.openingStock,
            date: new Date(sDate).toLocaleDateString(),
          };
          const purchase = res.data.purchase.map((datum) => ({
            ...datum,
            type: "purchase",
            qty: parseInt(datum.qty),
            date: new Date(datum.purchase_date).toLocaleDateString(),
          }));
          const sales = res.data.sales.map((datum) => ({
            ...datum,
            type: "sales",
            qty: parseInt(datum.qty),
            date: new Date(datum.sales_date).toLocaleDateString(),
          }));

          let merged = [...purchase, ...sales];

          // sort merged according to date
          merged.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
          });

          merged.unshift(op);

          let cumulative = 0;
          // add closing stock
          const test = merged.map((item) => {
            if (item.type === "opening") {
              item.close = "N/A";
              cumulative = item.qty;
            } else if (item.type === "purchase") {
              item.close = cumulative + item.qty;
              cumulative += item.qty;
            } else if (item.type === "sales") {
              item.close = cumulative - item.qty;
              cumulative -= item.qty;
            }
            return item;
          });

          return {
            txns: [...test],
            purchases: purchase.reduce((a, b) => a + b.qty, 0),
            sales: sales.reduce((a, b) => a + b.qty, 0),
          };
        }
        return { txns: [], purchases: 0, sales: 0 };
      }
      return { txns: [], purchases: 0, sales: 0 };
    } catch (error) {
      return { txns: [], purchases: 0, sales: 0 };
    }
  };

  const fetchDsr = async (sDate) => {
    try {
      const { success, shops_id } = await refresh();
      if (success) {
        const res = await API.post("shop/all-stock-opening", {
          shops_id: shops_id[0],
          eDate: sDate,
        });

        if (res && res.data) {
          console.log(res.data);
          return res.data;
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
    fetchShopDetails();
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

  const qSell = async (data, transaction_type, sDate) => {
    try {
      const { success, shops_id, id } = await refresh();
      if (success) {
        const finalData = data.map((datum) => ({
          products_id: datum.products_id,
          qty: datum.sellQty,
          discount: datum.discount,
          price: datum.mrp,
        }));
        const res = await API.post("/shop/sale", {
          shops_id: shops_id[0],
          users_id: id,
          transaction_type,
          items: finalData,
          sDate: sDate ? sDate : null,
        });
        if (res && res.data) {
          toast("Q-Sell added, for results press F12", "success");
          setChangesMade(changesMade + 1);
          return res.data;
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
        shopDetails,
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
        fetchDsr,
        fetchExcel,
      }}
    >
      {children}
    </ShopDataContext.Provider>
  );
};
