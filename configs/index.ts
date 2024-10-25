import { Config, createConfig } from "@ckb-lumos/lumos/config";
import { predefined } from "@ckb-lumos/config-manager";

export const AGGRON4: Config = createConfig({
  ...predefined.AGGRON4,
  SCRIPTS: {
    ...predefined.AGGRON4.SCRIPTS,
    OMNILOCK: {
      ...predefined.AGGRON4.SCRIPTS.OMNILOCK!,
      CODE_HASH:
        "0xa7a8a4f8eadb4d9736d32cdbe54259d1ee8e23785e7c28d15a971a0dbdc14ca6",
      HASH_TYPE: "type",
      TX_HASH:
        "0x65de639c5f4822cef9be430c4884c2b7689147a6b0098f3aa4028d0f7f9689d1",
      INDEX: "0x0",
      DEP_TYPE: "code",
    },
    // {
    //   "name": "multisig",
    //   "tx_hash": "0xe6774580c98c8b15799c628f539ed5722f3bc2b17206c2280e15f99be3c1ad71",
    //   "index": 0,
    //   "occupied_capacity": 5255000000000,
    //   "data_hash": "0x50c8623ef5112510ccdf2d8e480d02d0de7288eb9968f8b019817340c3991145",
    //   "type_id": "0x765b3ed6ae264b335d07e73ac332bf2c0f38f8d3340ed521cb447b4c42dd5f09"
    // }
    // testnet已部署
    SECP256K1_BLAKE160_MULTISIG: {
      CODE_HASH:
        "0x765b3ed6ae264b335d07e73ac332bf2c0f38f8d3340ed521cb447b4c42dd5f09",
      HASH_TYPE: "type",
      TX_HASH:
        "0xe6774580c98c8b15799c628f539ed5722f3bc2b17206c2280e15f99be3c1ad71",
      INDEX: "0x0",
      DEP_TYPE: "depGroup",
      SHORT_ID: 1,
    },
    XUDT: {
      CODE_HASH:
        "0x25c29dc317811a6f6f3985a7a9ebc4838bd388d19d0feeecf0bcd60f6c0975bb",
      HASH_TYPE: "type",
      TX_HASH:
        "0xbf6fb538763efec2a70a6a3dcb7242787087e1030c4e7d86585bc63a9d337f5f",
      INDEX: "0x0",
      DEP_TYPE: "code",
    },
  },
});

export const LINA: Config = createConfig({
  ...predefined.LINA,
  SCRIPTS: {
    ...predefined.LINA.SCRIPTS,
    // mainnet已部署：
    // {
    //   "cell_recipes": [
    //     {
    //       "name": "multisig",
    //       "tx_hash": "0x0a13d8d9c83c3374196ee43d4f0116dac497b0fec3e71c04f7cb7780abc455d8",
    //       "index": 0,
    //       "occupied_capacity": 5255000000000,
    //       "data_hash": "0x50c8623ef5112510ccdf2d8e480d02d0de7288eb9968f8b019817340c3991145",
    //       "type_id": "0xd1a9f877aed3f5e07cb9c52b61ab96d06f250ae6883cc7f0a2423db0976fc821"
    //     }
    //   ],
    //   "dep_group_recipes": []
    // }
    SECP256K1_BLAKE160_MULTISIG: {
      CODE_HASH:
        "0xd1a9f877aed3f5e07cb9c52b61ab96d06f250ae6883cc7f0a2423db0976fc821",
      HASH_TYPE: "type",
      TX_HASH:
        "0x0a13d8d9c83c3374196ee43d4f0116dac497b0fec3e71c04f7cb7780abc455d8",
      INDEX: "0x0",
      DEP_TYPE: "code",
      SHORT_ID: 1,
    },
    XUDT: {
      CODE_HASH:
        "0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95",
      HASH_TYPE: "data1",
      TX_HASH:
        "0xc07844ce21b38e4b071dd0e1ee3b0e27afd8d7532491327f39b786343f558ab7",
      INDEX: "0x0",
      DEP_TYPE: "code",
    },
  },
});
