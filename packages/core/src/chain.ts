import { z } from "zod";

export const addressSchema = z.string();
export type Address = z.infer<typeof addressSchema>;

export const chains = ["eip155:5042002"] as const;
export const chainSchema = z.enum(chains);
export type Chain = z.infer<typeof chainSchema>;

export const chainConfigSchema = z.object({
  chain: chainSchema,
  name: z.string(),
  contracts: z.object({
    identityRegistry: addressSchema,
    reputationRegistry: addressSchema,
    validationRegistry: addressSchema,
    usdc: addressSchema,
    escrow: addressSchema.optional(),
  }),
});
export type ChainConfig = z.infer<typeof chainConfigSchema>;

export const contractNameSchema = chainConfigSchema.shape.contracts.keyof();
export type ContractName = z.infer<typeof contractNameSchema>;

export const accountIdSchema = z.string().superRefine((accountId, context) => {
  const [namespace, reference, address, ...remainder] = accountId.split(":");

  if (
    remainder.length === 0 &&
    /^[-.%a-zA-Z0-9]{1,128}$/.test(address ?? "") &&
    chainSchema.safeParse(`${namespace}:${reference}`).success
  )
    return;

  context.addIssue({
    code: "custom",
    message: "Invalid CAIP-10 account id",
  });
});
export type AccountId = z.infer<typeof accountIdSchema>;

export const chainConfigs = z.record(chainSchema, chainConfigSchema).parse({
  "eip155:5042002": {
    chain: "eip155:5042002",
    name: "Arc Testnet",
    contracts: {
      identityRegistry: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
      reputationRegistry: "0x8004B663056A597Dffe9eCcC1965A193B7388713",
      validationRegistry: "0x8004Cb1BF31DAf7788923b405b754f57acEB4272",
      usdc: "0x3600000000000000000000000000000000000000",
    },
  },
});

export function parseChainId(chain: Chain) {
  const [namespace, reference] = chainSchema.parse(chain).split(":");
  return { namespace, reference };
}

export function buildAccountId(chain: Chain, address: Address) {
  return accountIdSchema.parse(`${chainSchema.parse(chain)}:${addressSchema.parse(address)}`);
}

export function parseAccountId(accountId: AccountId) {
  const parsedAccountId = accountIdSchema.parse(accountId);
  const addressSeparator = parsedAccountId.lastIndexOf(":");

  return {
    chain: chainSchema.parse(parsedAccountId.slice(0, addressSeparator)),
    address: addressSchema.parse(parsedAccountId.slice(addressSeparator + 1)),
  };
}

export function getContractAddress(chain: Chain, contract: ContractName) {
  const address = chainConfigs[chain].contracts[contract];

  if (address !== undefined) return address;

  throw new Error(`Contract "${contract}" is not configured for chain "${chain}"`);
}
