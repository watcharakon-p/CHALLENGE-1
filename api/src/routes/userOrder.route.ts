import { Router } from "express";
import { prisma } from "../db";
import { z } from "zod";
import { UserAggRow } from "../types";
import { Prisma } from "@prisma/client";

export const userOrderRouter = Router();

// validate
const qSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

userOrderRouter.get("/api/users/:id/orders", async (req, res) => {
  const id = Number(req.params.id);
  try {
    
    if(!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ ok: false, error: "Invalid ID" });
    }

    const parsed = qSchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.message });
    }

    const { page, pageSize } = parsed.data;

    const offset = (page - 1) * pageSize;

    const items: any[] = await prisma.$queryRaw`
      SELECT o.id, o."userId", o."productId", o."amount"::float as "amount", o."createdAt",p.name as "productName", p.price::float as price
      FROM "Order" o
      JOIN "Product" p ON o."productId" = p.id
      WHERE o."userId" = ${id}
      ORDER BY o."createdAt" DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const totalRes = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
      SELECT COUNT(*)::int AS count
      FROM "Order"
      WHERE "userId" = ${id}
    `);
    
    const total = Number(totalRes[0]?.count || 0);
    
    return res.json({ items, total, page, pageSize });
    
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Internal Error" });
  }
});