"use client";

import { useWalletContext } from "@/providers/Wallet";
import Link from "next/link";
export default function Home() {
  const { isConnected, wallet } = useWalletContext();

  if (!isConnected || !wallet) return <></>;

  return (
    <div className="w-full flex-grow">
      <div className="flex flex-col gap-2 p-4 pt-10">
        <Link
          prefetch={false}
          href="/sign-message"
          className="bg-[#00AFD1] hover:bg-[#05788f] px-4 py-2 rounded-full text-center text-white"
        >
          Sign message
        </Link>
        <Link
          prefetch={false}
          href="/transfer-ckb"
          className="bg-[#00AFD1] hover:bg-[#05788f] px-4 py-2 rounded-full text-center text-white"
        >
          Transfer CKB
        </Link>
        <Link
          prefetch={false}
          href="/transfer-token"
          className="bg-[#00AFD1] hover:bg-[#05788f] px-4 py-2 rounded-full text-center text-white"
        >
          Transfer Token
        </Link>
      </div>
    </div>
  );
}
