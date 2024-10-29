"use client";

import { AppProvider } from "@/providers/App";
import { useWalletContext } from "@/providers/Wallet";
import { truncateAddress } from "@/utils";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export const LayoutContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { onDisconnect, onConnect, isConnected, wallet, address, balance } =
    useWalletContext();

  const Account = () => {
    if (!isConnected || !wallet) return <></>;
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col w-full bg-[#dddfe1] py-3 px-5 rounded gap-2">
              <div className="text-sm flex justify-between">
                <label>Address:</label>{" "}
                <span>{truncateAddress(address, 10)}</span>
              </div>
              <div className="text-sm flex justify-between">
                <label>Public key:</label>{" "}
                <span>{truncateAddress(wallet?.account.publicKey!, 10)}</span>
              </div>
              <div className="text-sm flex justify-between">
                <label>Chain:</label> <span>{wallet?.account.chain}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <label></label>
                <button
                  className="bg-[#3498db] text-white py-1 px-4 rounded-lg text-base"
                  onClick={() => onDisconnect()}
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Connect = () => {
    return (
      <div className="flex flex-col gap-4 w-full">
        <button
          className="bg-[#000000] text-[#FFF] text-xl py-3 px-5 rounded-lg flex justify-center items-center gap-2 max-w-[500px]"
          onClick={onConnect}
        >
          <img className="h-8" src="utxo.png" />
          <span>Connect Wallet</span>
        </button>
      </div>
    );
  };

  console.log(balance);

  return (
    <>
      {isConnected && wallet ? (
        <div className="flex flex-col h-dvh">
          <Account />
          <div className="text-center py-4">
            Balance: {balance["ckb"]?.balance} <br />
            Balance Occupied: {balance["ckb"]?.balance_occupied} <br />
          </div>
          {children}
        </div>
      ) : (
        <div className="flex w-full h-dvh items-center justify-center px-4">
          <Connect />
        </div>
      )}
    </>
  );
};
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, [WebApp]);

  return (
    <AppProvider>
      <LayoutContent>{children}</LayoutContent>
    </AppProvider>
  );
}
