"use client";

import { LocalStorage } from "@/utils/storage";
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
  balance: { [key: string]: { balance: number; balance_occupied: number } };
}

const WalletContext = createContext<WalletContextType>({
  tonConnectUI: undefined,
  onConnect: async () => {},
  onDisconnect: async () => {},
  wallet: null,
  address: "",
  isConnected: false,
  balance: {},
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

  const [balance, setBalance] = useState({});

  const isTestnet = useMemo(() => {
    return wallet?.account.chain.toString() === "nervos_testnet";
  }, [wallet]);

  const address = useMemo(() => {
    if (wallet) return wallet.account.address;
    return "";
  }, [wallet]);

  const fetchBalance = async () => {
    setBalance({});
    if (!!address) {
      // Testnet: https://testnet-api.explorer.nervos.org/api/v1/addresses/{address}
      // Mainnet: https://mainnet-api.explorer.nervos.org/api/v1/addresses/{address}

      const apiURL = `https://staging-api-720a.utxo.global/ckb/${
        isTestnet ? "testnet" : "mainnet"
      }/v1/addresses/${address}`;

      const options = {
        method: "GET",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      };

      const res = await fetch(apiURL, options);
      const { data } = await res.json();
      const attributes = data[0].attributes;
      const udt_accounts = attributes.udt_accounts as {
        amount: string;
        decimal: string;
        sysbol: string;
        type_hash: string;
      }[];
      const bal: any = {
        ckb: {
          balance: Number(attributes.balance) / Number(10 ** 8),
          balance_occupied:
            Number(attributes.balance_occupied) / Number(10 ** 8),
        },
      };

      udt_accounts.map((udt) => {
        bal[udt.type_hash] = {
          balance: Number(udt.amount) / Number(10 ** Number(udt.decimal)),
        };
      });

      setBalance(bal);
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
