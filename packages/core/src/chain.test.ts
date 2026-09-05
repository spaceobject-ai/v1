import { describe, expect, it } from "vite-plus/test";

import {
  accountIdSchema,
  addressSchema,
  buildAccountId,
  chainConfigSchema,
  chainConfigs,
  chainSchema,
  chains,
  contractNameSchema,
  getContractAddress,
  parseAccountId,
  parseChainId,
} from "./chain.js";

describe("chain schemas", () => {
  it("accepts the supported chain and rejects an unknown chain", () => {
    expect(chainSchema.parse("eip155:5042002")).toBe("eip155:5042002");
    expect(() => chainSchema.parse("eip155:1")).toThrow();
  });

  it("treats addresses as chain-independent strings", () => {
    expect(addressSchema.parse("not-an-evm-address")).toBe("not-an-evm-address");
    expect(() => addressSchema.parse(123)).toThrow();
  });

  it("accepts a complete chain config and rejects a bad chain id", () => {
    const config = {
      chain: "eip155:5042002",
      name: "Arc Testnet",
      contracts: {
        identityRegistry: "identity",
        reputationRegistry: "reputation",
        validationRegistry: "validation",
        usdc: "usdc",
      },
    };

    expect(chainConfigSchema.parse(config)).toEqual(config);
    expect(() => chainConfigSchema.parse({ ...config, chain: "eip155:1" })).toThrow();
  });

  it("accepts contract names and rejects unknown names", () => {
    expect(contractNameSchema.parse("identityRegistry")).toBe("identityRegistry");
    expect(contractNameSchema.parse("escrow")).toBe("escrow");
    expect(() => contractNameSchema.parse("rpc")).toThrow();
  });

  it("accepts a valid CAIP-10 id and rejects malformed and unknown-chain ids", () => {
    expect(accountIdSchema.parse("eip155:5042002:0xabc")).toBe("eip155:5042002:0xabc");
    expect(() => accountIdSchema.parse("eip155:5042002")).toThrow();
    expect(() => accountIdSchema.parse("eip155:1:0xabc")).toThrow();
  });
});

describe("chain configuration", () => {
  it("has one parsed record for every supported chain", () => {
    expect(Object.keys(chainConfigs)).toEqual([...chains]);
    expect(chainConfigs["eip155:5042002"]).toMatchObject({
      chain: "eip155:5042002",
      name: "Arc Testnet",
      contracts: {
        identityRegistry: expect.any(String),
        reputationRegistry: expect.any(String),
        validationRegistry: expect.any(String),
        usdc: expect.any(String),
      },
    });
    expect(chainConfigs["eip155:5042002"].contracts.escrow).toBeUndefined();
  });
});

describe("chain identifiers", () => {
  it("parses a CAIP-2 chain id without converting its reference to a number", () => {
    expect(parseChainId("eip155:5042002")).toEqual({
      namespace: "eip155",
      reference: "5042002",
    });
  });

  it("builds and parses a CAIP-10 account id", () => {
    expect(buildAccountId("eip155:5042002", "0xabc")).toBe("eip155:5042002:0xabc");
    expect(parseAccountId("eip155:5042002:0xabc")).toEqual({
      chain: "eip155:5042002",
      address: "0xabc",
    });
  });

  it("rejects a CAIP-10 account id for an unknown chain", () => {
    expect(() => parseAccountId("eip155:1:0xabc")).toThrow();
  });
});

describe("contract lookup", () => {
  it("returns a configured contract address", () => {
    expect(getContractAddress("eip155:5042002", "identityRegistry")).toBe(
      chainConfigs["eip155:5042002"].contracts.identityRegistry,
    );
  });

  it("names the chain and contract when an address is not set", () => {
    expect(() => getContractAddress("eip155:5042002", "escrow")).toThrow(
      'Contract "escrow" is not configured for chain "eip155:5042002"',
    );
  });
});
