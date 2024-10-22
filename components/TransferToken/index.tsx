"use client";

import React from "react";
import { useEffect, useState } from "react";
import { truncateAddress } from "../../utils";
import { useWalletContext } from "@/providers/Wallet";

export default function TransferToken() {
  const { isConnected, wallet, address } = useWalletContext();
  const [addressTo, setAddressTo] = useState("");
  const [args, setArgs] = useState("");
  const [amountInput, setAmountInput] = useState("0");
  const [satAmount, setSatAmount] = useState(0);

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
      <input
        type="text"
        placeholder="Args"
        className="border-b-[1px] outline-none"
        value={addressTo}
        onChange={(e) => setArgs(e.target.value)}
      />
      <div className="flex gap-5 justify-between border-b-[1px]">
        <input
          type="text"
          placeholder="0"
          className="w-full outline-none"
          value={amountInput}
          onChange={(e) => {
            setSatAmount(Number(e.target.value));
            setAmountInput(e.target.value);
          }}
        />
      </div>

      <button
        className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale"
        disabled={true}
        onClick={() => {}}
      >
        Transfer
      </button>
    </div>
  );
}
