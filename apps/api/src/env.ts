import { Sdk } from "../.generated/erc-8004";

export interface GlobalVariables {
  erc8004: Sdk;
}

export interface Env<TVariables extends object = {}> {
  Bindings: CloudflareBindings;
  Variables: GlobalVariables & TVariables;
}
