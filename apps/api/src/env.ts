export interface GlobalVariables {}

export interface Env<TVariables extends object = {}> {
  Bindings: CloudflareBindings;
  Variables: GlobalVariables & TVariables;
}
