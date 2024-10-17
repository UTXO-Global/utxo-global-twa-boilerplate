"use client";

import React from "react";
import { useEffect, useState } from "react";
import { truncateAddress } from "../../utils";

export default function SendNativeCoin() {
  const [senderAddress, setSenderAddress] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [amountInput, setAmountInput] = useState("0");
  const [satAmount, setSatAmount] = useState(0);

  return (
    <div className="flex flex-col gap-10">
      <label className="text-2xl font-bold">Send ???</label>
      <div className="flex gap-10 items-center w-full justify-between">
        <label>Sender</label>
        <select
          className="py-3 px-5 cursor-pointer"
          value={senderAddress}
          onChange={(e) => setSenderAddress(e.target.value)}
        ></select>
      </div>
      <input
        type="text"
        placeholder="Address To"
        className="border-b-[1px] outline-none"
        value={addressTo}
        onChange={(e) => setAddressTo(e.target.value)}
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
        <span>???</span>
      </div>

      <button
        className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale"
        disabled={true}
        onClick={() => {}}
      >
        Send
      </button>
    </div>
  );
}
