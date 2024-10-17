"use client";

import { useMemo, useState } from "react";
import { truncateAddress } from "../utils";
import SignMessage from "../components/SignMessage";
import SendNativeCoin from "../components/SendNativeCoin";
import { useWalletContext } from "@/providers/Wallet";

export default function Home() {
  const [tab, setTab] = useState("account");
  const { onConnect, onDisconnect, isConnected, wallet, address } =
    useWalletContext();

  const balances: { [key: string]: any } = useMemo(() => {
    return {};
  }, []);

  const Account = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-between items-center">
            <button
              className="bg-[#ffc107] text-[#333] py-3 px-5 rounded-lg text-xl"
              onClick={() => onDisconnect()}
            >
              Disconnect
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col w-full bg-[#dddfe1] py-3 px-5 rounded">
              {truncateAddress(address)}
              <div className="text-sm">
                PublicKey: {truncateAddress(wallet?.account.publicKey!, 20)}
              </div>
              <div className="flex gap-1 justify-between items-center">
                <span className="text-sm">{wallet?.account.chain}</span>
                <div>
                  {balances[address] ? balances[address].total / 10 ** 8 : "-"}{" "}
                </div>
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
        <div className="text-2xl font-bold text-center mb-4">
          Connect Wallet
        </div>
        <button
          className="bg-[#000000] text-[#FFF] text-xl py-3 px-5 rounded-lg flex justify-center items-center gap-2"
          onClick={onConnect}
        >
          <img className="h-8" src="utxo.png" />
          <span>BTC</span>
        </button>
        <button
          className="bg-[#000000] text-[#FFF] text-xl py-3 px-5 rounded-lg flex justify-center items-center gap-2"
          onClick={onConnect}
        >
          <img className="h-8" src="utxo.png" />
          <span>CKB</span>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full min-h-dvh flex flex-col py-10 px-4 items-center justify-center">
      {!isConnected ? (
        <Connect />
      ) : (
        <>
          <div className="flex gap-10 text-lg border-b-[1px] w-full justify-start mb-10 font-bold">
            <button onClick={() => setTab("account")}>Account</button>
            <button onClick={() => setTab("signMessage")}>Sign Message</button>
          </div>
          <div className="max-w-[500px] w-full flex justify-center mx-auto">
            <div className="flex flex-col gap-5 text-xl w-full">
              {tab === "account" && <Account />}
              {tab === "signMessage" && <SignMessage />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
