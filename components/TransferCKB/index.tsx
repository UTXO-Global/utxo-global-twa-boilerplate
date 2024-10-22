"use client";

import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { truncateAddress } from "../../utils";
import { useWalletContext } from "@/providers/Wallet";
import Link from "next/link";
import { BI, Cell, Indexer, WitnessArgs, helpers } from "@ckb-lumos/lumos";
import { predefined } from "@ckb-lumos/config-manager";
import { blockchain } from "@ckb-lumos/base";
import { bytes } from "@ckb-lumos/codec";
import { createTransactionFromSkeleton } from "@ckb-lumos/lumos/helpers";

export default function TransferCKB() {
  const { isConnected, wallet, address, tonConnectUI } = useWalletContext();
  const [addressTo, setAddressTo] = useState("");
  const [amountInput, setAmountInput] = useState("0");
  const [satAmount, setSatAmount] = useState(0);
  const isTestnet = useMemo(() => {
    return wallet?.account.chain.toString() === "nervos_testnet";
  }, [wallet]);

  const onTransfer = async () => {
    const neededCapacity = BI.from(satAmount).add(100000);
    const lumosConfig = isTestnet ? predefined.AGGRON4 : predefined.LINA;
    const rpc = isTestnet
      ? "https://testnet.ckb.dev/rpc"
      : "https://mainnet.ckb.dev/rpc";

    const indexer = new Indexer(rpc);
    let txSkeleton = helpers.TransactionSkeleton({
      cellProvider: indexer,
    });

    const fromScript = helpers.parseAddress(address, {
      config: lumosConfig,
    });
    const toScript = helpers.parseAddress(addressTo, {
      config: lumosConfig,
    });

    const cells = indexer.collector({
      lock: fromScript,
      data: "0x",
      type: "empty",
    });

    // TODO: add smart selector
    const collected: Cell[] = [];
    let collectedSum = BI.from(0);
    for await (const cell of cells.collect()) {
      if (!cell.cellOutput.type) {
        collectedSum = collectedSum.add(cell.cellOutput.capacity);
        collected.push(cell);
      }
      if (collectedSum.gte(neededCapacity)) break;
    }

    const changeOutput: Cell = {
      cellOutput: {
        capacity: collectedSum.sub(neededCapacity).toHexString(),
        lock: fromScript,
      },
      data: "0x",
    };

    const transferOutput: Cell = {
      cellOutput: {
        capacity: BI.from(satAmount).toHexString(),
        lock: toScript,
      },
      data: "0x",
    };

    txSkeleton = txSkeleton.update("inputs", (inputs) =>
      inputs.push(...collected)
    );
    if (collectedSum.sub(neededCapacity).eq(BI.from(0))) {
      txSkeleton = txSkeleton.update("outputs", (outputs) =>
        outputs.push(transferOutput)
      );
    } else {
      txSkeleton = txSkeleton.update("outputs", (outputs) =>
        outputs.push(transferOutput, changeOutput)
      );
    }

    txSkeleton = txSkeleton.update("cellDeps", (cellDeps) =>
      cellDeps.push({
        outPoint: {
          txHash: lumosConfig.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
          index: lumosConfig.SCRIPTS.SECP256K1_BLAKE160.INDEX,
        },
        depType: lumosConfig.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
      })
    );

    const firstIndex = txSkeleton
      .get("inputs")
      .findIndex(
        (input) =>
          input.cellOutput.lock.codeHash === fromScript.codeHash &&
          input.cellOutput.lock.hashType === fromScript.hashType &&
          input.cellOutput.lock.args === fromScript.args
      );
    if (firstIndex !== -1) {
      while (firstIndex >= txSkeleton.get("witnesses").size) {
        txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
          witnesses.push("0x")
        );
      }
      let witness: string = txSkeleton.get("witnesses").get(firstIndex)!;
      const newWitnessArgs: WitnessArgs = {
        /* 65-byte zeros in hex */
        lock: "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      };
      if (witness !== "0x") {
        const witnessArgs = blockchain.WitnessArgs.unpack(
          bytes.bytify(witness)
        );
        const lock = witnessArgs.lock;
        if (
          !!lock &&
          !!newWitnessArgs.lock &&
          !bytes.equal(lock, newWitnessArgs.lock)
        ) {
          throw new Error(
            "Lock field in first witness is set aside for signature!"
          );
        }
        const inputType = witnessArgs.inputType;
        if (inputType) {
          newWitnessArgs.inputType = inputType;
        }
        const outputType = witnessArgs.outputType;
        if (outputType) {
          newWitnessArgs.outputType = outputType;
        }
      }
      witness = bytes.hexify(blockchain.WitnessArgs.pack(newWitnessArgs));
      txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
        witnesses.set(firstIndex, witness)
      );
    }

    const tx = createTransactionFromSkeleton(txSkeleton);

    console.log(tx);

    await tonConnectUI?.sendTransaction({
      validUntil: 0,
      messages: [
        {
          address: addressTo,
          amount: satAmount.toString(),
          payload: JSON.stringify(tx),
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <label className="text-2xl font-bold">Send CKB</label>
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
        <span>CKB</span>
      </div>

      <div className="flex justify-between gap-2">
        <Link
          className="py-3 px-5 rounded-lg text-xl border border-gray-400 w-1/2 text-center"
          href="/"
        >
          Back
        </Link>
        <button
          className="bg-[#198754] text-[#FFF] py-3 px-5 rounded-lg text-xl disabled:grayscale w-1/2"
          disabled={!addressTo || !address || satAmount <= 0}
          onClick={onTransfer}
        >
          Transfer
        </button>
      </div>
    </div>
  );
}
