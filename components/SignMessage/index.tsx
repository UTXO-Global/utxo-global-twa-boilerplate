"use client";

import { useEffect, useState } from "react";
import { truncateAddress } from "../../utils";
import React from "react";

export default function SignMessage() {
  const [message, setMessage] = useState("Hello");
  const [senderAddress, setSenderAddress] = useState("");

  return (
    <div className="flex flex-col gap-5">
      <label className="text-2xl font-bold">SignMessage</label>
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
        placeholder="Hello"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border-b-[1px] outline-none"
      />
      <button
        className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale"
        disabled={true}
        onClick={() => {}}
      >
        Sign
      </button>
    </div>
  );
}
