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
        className="border-b-[1px] outline-none text-base placeholder:text-gray-500"
      />
      <button
        className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale"
        disabled={true}
        onClick={() => {}}
      >
        Sign
      </button>

      <textarea
        className="border resize-none w-full h-20 p-2 text-base mt-10"
        placeholder="Input signature here ..."
      ></textarea>
      <button
        className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale"
        disabled={true}
        onClick={() => {}}
      >
        Verify signature
      </button>
    </div>
  );
}
