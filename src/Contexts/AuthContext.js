import { createContext, useContext, useState } from "react";
import jwt_decode from "jwt-decode";
import Cookie from "js-cookie";
import { UtilityContext } from "./UtilityContext";
import API from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { toast, setIsLoading } = useContext(UtilityContext);
  const [user, setUser] = useState({});

  const login = async (name, password) => {
    try {
      const res = await API.post("/auth/login", { name, password });
      if (res.status === 200 && res.data) {
        const { name, roles_id, is_priviledged, shops_id } = jwt_decode(
          res.data
        );
        setUser({
          name,
          roles_id,
          is_priviledged,
          shops_id,
          token: res.data,
        });
        Cookie.set("sid", res.data);
        return { success: true, roles_id };
      }
      toast(res.data);
      return { success: false };
    } catch (e) {
      toast(e.response.data, "error");
      return { success: false };
    }
  };

  const logout = async () => {
    setUser({});
    Cookie.remove("sid");
    toast("Logged out");
    return true;
  };

  const refresh = async () => {
    try {
      const res = await API.post("/auth/refresh");
      if (res && res.data) {
        console.log(jwt_decode(res.data));
        const { name, roles_id, is_priviledged, shops_id } = jwt_decode(
          res.data
        );
        setUser({
          name,
          roles_id,
          is_priviledged,
          shops_id,
          token: res.data,
        });
        Cookie.set("sid", res.data);
        return { success: true, token: res.data, shops_id };
      }
      toast("session expired", "error");
      setIsLoading(false);
      return { success: false };
    } catch (e) {
      setIsLoading(false);
      toast("Refresh failed", "error");
      return { success: false };
    }
  };

  const checkCookie = async () => {
    const cookie = Cookie.get("sid");

    if (cookie) {
      const { name, roles_id, is_priviledged, shops_id, exp } =
        await jwt_decode(cookie);
      if (Date.now() >= exp * 1000) {
        setUser({});
        Cookie.remove("sid");
        toast("Session expired", "error");
        return false;
      }
      setUser({ name, roles_id, is_priviledged, shops_id, token: cookie });
      return { success: true, roles_id };
    }
    setUser({});
    return { success: false };
  };

  return (
    <AuthContext.Provider value={{ login, checkCookie, user, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
