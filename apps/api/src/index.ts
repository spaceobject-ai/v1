import { Hono } from "hono";
import { Env } from "./env";

const app = new Hono<Env>().get("/", async (c) => {
  return c.json({});
});

export default app;
