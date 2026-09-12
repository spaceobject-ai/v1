import { Sdk } from "../.generated/erc-8004/sdk";

export interface GlobalVariables {
  erc8004: Sdk;
}

export interface Env<TVariables extends object = {}> {
  Bindings: CloudflareBindings;
  Variables: GlobalVariables & TVariables;
}
