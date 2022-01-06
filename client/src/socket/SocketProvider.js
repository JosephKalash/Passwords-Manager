import React from "react";
import io from "socket.io-client";
import { baseURL, CAServer } from "./configs";
import authHandlers from "./eventHandlers/authHandlers";

const SocketContext = React.createContext();

export const useAuthSocket = () => React.useContext(SocketContext).auth;
export const useMainSocket = () => React.useContext(SocketContext).main;
export const useCaSocket = () => React.useContext(SocketContext).ca;

export const SocketProvider = ({ children }) => {
  const [sockets, setSockets] = React.useState({ auth: null, main: null, ca: null });

  React.useEffect(() => {
    const newAuthSocket = io(`${baseURL}/auth`, { transports: ["websocket"] });
    const newMainSocket = io(`${baseURL}/main`, { transports: ["websocket"] });
    const newCaSocket = io(`${CAServer}`, { transports: ["websocket"] });
    setSockets({
      auth: newAuthSocket,
      main: newMainSocket,
      ca: newCaSocket,
    });
    authHandlers(newAuthSocket);
    // mainHandlers(newMainSocket);

    return () => {
      newAuthSocket.close();
      newMainSocket.close();
      newCaSocket.close();
    };
  }, []);

  return <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>;
};
