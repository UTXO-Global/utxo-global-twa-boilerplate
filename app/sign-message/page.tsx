"use client";

import SignMessage from "@/components/SignMessage";
import { useWalletContext } from "@/providers/Wallet";
import Link from "next/link";
export default function SignMessagePage() {
  const { isConnected, wallet } = useWalletContext();

  if (!isConnected || !wallet) return <></>;

  return (
    <div className="w-full flex-grow">
      <div className="flex flex-col gap-2 p-4 pt-10">
        <SignMessage />
      </div>
    </div>
  );
}
