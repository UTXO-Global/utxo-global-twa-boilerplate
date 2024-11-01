"use client";

import { useWalletContext } from "@/providers/Wallet";
import { truncateAddress } from "@/utils";
import { verifyMessageCkbSecp256k1 } from "@ckb-ccc/core";
import { UserRejectsError } from "@utxo-global/tonconnect-sdk";
import { useState } from "react";
import React from "react";

export default function SignMessage() {
  const { tonConnectUI, address, wallet } = useWalletContext();
  const [message, setMessage] = useState("Hello");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const onSignMessage = async () => {
    setError("");
    setSignature("");
    try {
      const result = await tonConnectUI?.signData({
        message: message,
        address: address,
      });

      setSignature(result?.signature || "");
    } catch (e) {
      setSignature("");
      if (e instanceof UserRejectsError) {
        setError("You rejected the message");
      } else {
        setError((e as any).message);
      }
    }
  };

  const checkSignature = async () => {
    setIsCheck(true);
    setIsValid(
      verifyMessageCkbSecp256k1(message, signature, wallet?.account.publicKey!)
    );
  };
  return (
    <div className="flex flex-col gap-5">
      <label className="text-2xl font-bold">SignMessage</label>
      <div className="flex gap-10 items-center w-full justify-between">
        <label>Sender</label>
        <span>{truncateAddress(address, 10)}</span>
      </div>
      <input
        type="text"
        placeholder="Hello"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border-b-[1px] outline-none text-base placeholder:text-gray-500"
      />

      {!!error && <div>{error}</div>}

      <button
        className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale"
        disabled={!address || !message}
        onClick={onSignMessage}
      >
        Sign
      </button>

      <textarea
        className="border resize-none w-full h-20 p-2 text-base mt-10"
        placeholder="Input signature here ..."
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
      />

      {isCheck && <div>Signature: {isValid ? "Valid" : "Invalid"}</div>}
      <button
        className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale"
        disabled={!signature}
        onClick={checkSignature}
      >
        Verify signature
      </button>
    </div>
  );
}
