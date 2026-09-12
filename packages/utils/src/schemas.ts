import { isAddress } from "viem";
import { z } from "zod";

// Agent ids are uint256 values; 0 means "no agent" on-chain, so only positive
// values identify an agent. The string input side keeps the schema
// representable in JSON Schema, which both the OpenAPI doc and MCP tool
// listing require.
export const agentIdSchema = z.string().pipe(z.coerce.bigint<string>().positive());

export const addressSchema = z.string().refine((value) => isAddress(value), "Invalid EVM address");
