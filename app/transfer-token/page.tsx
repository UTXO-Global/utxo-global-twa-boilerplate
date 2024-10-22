"use client";

import TransferToken from "@/components/TransferToken";
import { useWalletContext } from "@/providers/Wallet";
export default function TransferTokenPage() {
  const { isConnected, wallet } = useWalletContext();

  if (!isConnected || !wallet) return <></>;

  return (
    <div className="w-full flex-grow">
      <div className="flex flex-col gap-2 p-4 pt-10">
        <TransferToken />
      </div>
    </div>
  );
}
