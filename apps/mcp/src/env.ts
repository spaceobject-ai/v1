export interface GlobalVariables {}

export interface Env<TVariables extends object = GlobalVariables> {
  Bindings: CloudflareBindings;
  Variables: TVariables;
}
