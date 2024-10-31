"use client";

import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { truncateAddress } from "../../utils";
import { useWalletContext } from "@/providers/Wallet";
import { UserRejectsError } from "@tonconnect/sdk";
import Link from "next/link";

export default function TransferToken() {
  const { balance, wallet, address, tonConnectUI } = useWalletContext();
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState<any | undefined>(undefined);
  const [addressTo, setAddressTo] = useState("");
  const [amount, setAmount] = useState("");
  const [args, setArgs] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const isTestnet = useMemo(() => {
    return wallet?.account.chain.toString() === "nervos_testnet";
  }, [wallet]);

  const onTransfer = async () => {
    try {
      setTxHash("");
      setError(undefined);
      const payload = {
        args,
      };
      const result = await tonConnectUI?.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: addressTo,
            amount: amount,
            payload: btoa(JSON.stringify(payload)),
          },
        ],
      });

      if (result?.boc) {
        setAmount("");
        setAddressTo("");
        setTxStatus("Pending");
        setTxHash(result.boc);
      }
    } catch (e) {
      if (e instanceof UserRejectsError) {
        setError(
          "You rejected the transaction. Please confirm it to send to the blockchain"
        );
      } else {
        setError((e as any).message);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    try {
      if (!!txHash && txStatus === "Pending") {
        interval = setInterval(async () => {
          const res = await fetch(
            `https://staging-api-720a.utxo.global/ckb/${
              isTestnet ? "testnet" : "mainnet"
            }/v1/transactions/${txHash}`
          );

          const { data } = await res.json();
          if (data.attributes?.tx_status !== "pending") {
            setTxStatus(data.attributes?.tx_status);
          }
        }, 1500); //1.5s
      }
    } catch (e) {
      console.error(e);
    }

    return () => clearInterval(interval);
  }, [txHash, txStatus]);

  return (
    <div className="flex flex-col gap-10">
      <label className="text-2xl font-bold">Transfer xUDT</label>
      <div className="flex gap-10 items-center w-full justify-between">
        <label>Sender</label>
        <span>{truncateAddress(address, 10)}</span>
      </div>
      <input
        type="text"
        placeholder="Address To"
        className="border-b-[1px] outline-none"
        value={addressTo}
        onChange={(e) => setAddressTo(e.target.value)}
      />
      <div>
        <input
          type="text"
          placeholder="Args"
          className="border-b-[1px] outline-none w-full"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
        />
        {!!args && (
          <div className="mt-1 text-xs text-gray-500">
            Balance: {balance[args]?.balance}
          </div>
        )}
      </div>
      <div className="flex gap-5 justify-between border-b-[1px]">
        <input
          type="text"
          placeholder="0"
          className="w-full outline-none"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </div>
      {!!txHash && (
        <div>
          Tx:{" "}
          <a
            href={`https://${
              isTestnet ? "testnet." : ""
            }explorer.nervos.org/en/transaction/${txHash}`}
            target="_blank"
          >
            {truncateAddress(txHash, 10)}
          </a>
          <br />
          Status: {txStatus}
        </div>
      )}

      {!!error && <div>{error}</div>}

      <div className="flex justify-between gap-2">
        <Link
          className="py-3 px-5 rounded-lg text-xl border border-gray-400 w-1/2 text-center"
          href="/"
        >
          Back
        </Link>
        <button
          className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale w-1/2"
          disabled={!addressTo || !address || Number(amount) <= 0}
          onClick={onTransfer}
        >
          Transfer
        </button>
      </div>
    </div>
  );
}
