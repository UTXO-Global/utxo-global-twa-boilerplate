"use client";

import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { WalletProvider } from "./Wallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AppContextType {}

const AppContext = createContext<AppContextType>({});

export type AppContextProviderProps = {};

export function AppProvider({
  children,
}: PropsWithChildren<AppContextProviderProps>) {
  const context: AppContextType = useMemo(() => ({}), []);

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
