"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { WalletProvider } from "./Wallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WebApp from "@twa-dev/sdk";

interface AppContextType {}

const AppContext = createContext<AppContextType>({});

export type AppContextProviderProps = {};

export function AppProvider({
  children,
}: PropsWithChildren<AppContextProviderProps>) {
  const context: AppContextType = useMemo(() => ({}), []);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, [WebApp]);

  return (
    <WalletProvider>
      <AppContext.Provider value={context}>
        {children}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          rtl={true}
        />
      </AppContext.Provider>
    </WalletProvider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
