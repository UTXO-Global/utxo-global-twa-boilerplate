"use client";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { WalletProvider } from "./Wallet";

interface AppContextType {}

const AppContext = createContext<AppContextType>({});

export type AppContextProviderProps = {};

export function AppProvider({
  children,
}: PropsWithChildren<AppContextProviderProps>) {
  const context: AppContextType = useMemo(() => ({}), []);

  return (
    <WalletProvider>
      <AppContext.Provider value={context}>{children}</AppContext.Provider>
    </WalletProvider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
