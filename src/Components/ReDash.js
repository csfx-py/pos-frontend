import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { UtilityContext } from "../Contexts/UtilityContext";

function Home() {
  const history = useHistory();

  const { setIsLoading } = useContext(UtilityContext);
  const { checkCookie } = useContext(AuthContext);

  const checkUser = async () => {
    const res = await checkCookie();
    if (!res.success) {
      setIsLoading(false);
      history.push("/login");
      return;
    }
    switch (res.role) {
      case "admin":
        setIsLoading(false);
        history.push("/admin");
        break;
      case "shop":
        setIsLoading(false);
        history.push("/shop");
        break;
      default:
        setIsLoading(false);
        history.push("/login");
        break;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}

export default Home;
