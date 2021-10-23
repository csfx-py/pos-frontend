// create a context to store logs
import { createContext, useState } from "react";
export const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  return (
    <LogContext.Provider
      value={{
        logs,
        setLogs,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};
