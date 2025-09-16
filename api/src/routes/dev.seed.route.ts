import { Router } from "express";
import { seedDatabase } from "../seed/seed-database";
import { prisma } from "../db";
import { sseBroadcast } from "../rt/sse";
import { wsBroadcast } from "../rt/ws";

export const devSeed = Router();

devSeed.post("/dev/seed", async (req, res) => {
  const users = Number(req.query.users ?? process.env.DEFAULT_USERS ?? 50000);
  const orders = Number(
    req.query.orders ?? process.env.DEFAULT_ORDERS ?? 500000
  );
  const products = Number(
    req.query.products ?? process.env.DEFAULT_PRODUCTS ?? 10000
  );
  const seed = Number(process.env.SEED_RNG ?? 1337);

  const onProgress = (ev: string, data: any) => {
    sseBroadcast(ev, data);
    wsBroadcast(ev, data);
  };

  await seedDatabase(prisma, { users, orders, products, seed }, onProgress);
  
  res.json({ ok: true, counts: { users, orders, products }, seed });
});
