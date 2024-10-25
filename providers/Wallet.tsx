"use client";

import { LocalStorage } from "@/utils/storage";
import { predefined } from "@ckb-lumos/config-manager";
import { BI, Indexer, helpers } from "@ckb-lumos/lumos";
import TonConnect, { Wallet } from "@tonconnect/sdk";
import { THEME, TonConnectUI, UIWallet } from "@tonconnect/ui";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

const tonConnect = new TonConnect({
  manifestUrl: "https://config.utxo.global/utxo-ton-wallet-manifest.json",
  storage: LocalStorage,
});

const customWallet: UIWallet = {
  appName: "utxowallet",
  name: "UTXO Wallet",
  imageUrl: "https://utxo.global/icon.png",
  aboutUrl: "https://t.me/utxo_global_wallet_bot/utxo",
  universalLink: "https://t.me/utxo_global_wallet_bot/utxo",
  jsBridgeKey: "utxowallet",
  bridgeUrl: "https://bridge.ton.space/bridge",
  platforms: ["ios", "android", "macos", "windows", "linux"],
};

interface WalletContextType {
  tonConnectUI: TonConnectUI | undefined;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  wallet: Wallet | null;
  address: string;
  isConnected: boolean;
  balance: BI;
}

const WalletContext = createContext<WalletContextType>({
  tonConnectUI: undefined,
  onConnect: async () => {},
  onDisconnect: async () => {},
  wallet: null,
  address: "",
  isConnected: false,
  balance: BI.from(0),
});

export type AppContextProviderProps = {};

export function WalletProvider({
  children,
}: PropsWithChildren<AppContextProviderProps>) {
  const tonConnectUI = useMemo(() => {
    try {
      return new TonConnectUI({
        connector: tonConnect,
        actionsConfiguration: {
          twaReturnUrl: "https://t.me/utxo_global_boilerplate_stag_bot/start",
        },
        uiPreferences: {
          theme: THEME.DARK,
          borderRadius: "m",
        },
        restoreConnection: true,
        walletsListConfiguration: {
          includeWallets: [customWallet],
        },
      });
    } catch (_e) {}
    return undefined;
  }, []);

  const [wallet, setWallet] = useState<Wallet | null>(
    tonConnectUI?.wallet || null
  );

  const [balance, setBalance] = useState(BI.from(0));

  const isTestnet = useMemo(() => {
    return wallet?.account.chain.toString() === "nervos_testnet";
  }, [wallet]);

  const address = useMemo(() => {
    if (wallet) return wallet.account.address;
    return "";
  }, [wallet]);

  const fetchBalance = async () => {
    setBalance(BI.from(0));
    if (!!address) {
      const lumosConfig = isTestnet ? predefined.AGGRON4 : predefined.LINA;
      const rpc = isTestnet
        ? "https://testnet.ckb.dev/rpc"
        : "https://mainnet.ckb.dev/rpc";

      const indexer = new Indexer(rpc);
      const addressScript = helpers.parseAddress(address, {
        config: lumosConfig,
      });
      const collector = indexer.collector({ lock: addressScript });
      let balance: BI = BI.from(0);
      for await (const cell of collector.collect()) {
        balance = balance.add(cell.cellOutput.capacity);
      }

      setBalance(balance);
    }
  };

  const isConnected = useMemo(() => {
    return !!wallet && !!wallet.account?.address;
  }, [wallet, address]);

  const onConnect = async () => {
    tonConnectUI?.openSingleWalletModal("utxowallet");
  };

  const onDisconnect = async () => {
    await tonConnectUI?.disconnect();
  };

  useEffect(() => {
    if (tonConnectUI) {
      tonConnectUI.connector.onStatusChange(
        (wallet) => setWallet(wallet),
        (error) => {
          toast.error(error.message, { autoClose: 3000 });
          tonConnectUI.closeSingleWalletModal();
        }
      );
      tonConnectUI.connectionRestored.then((restored) => {
        if (restored) {
          setWallet(tonConnectUI.wallet);
        } else {
          setWallet(null);
          console.log("Connection was not restored.");
        }
      });
    }
  }, [tonConnectUI]);

  useEffect(() => {
    fetchBalance();
  }, [address, wallet]);

  const context: WalletContextType = useMemo(
    () => ({
      tonConnectUI,
      onConnect,
      onDisconnect,
      wallet,
      address,
      isConnected,
      balance,
    }),
    [
      tonConnectUI,
      balance,
      onConnect,
      onDisconnect,
      wallet,
      address,
      isConnected,
    ]
  );
  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
