import { Router } from "express";
import { listQuerySchema } from "../util/validate";
import {
  ListQuery,
  SortBy,
  SortDir,
  UserAggRow,
  UsersListResponse,
} from "../types";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export const usersRoute = Router();

usersRoute.get("/api/users", async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.message });
  }

  const { page, pageSize, search, sortBy, sortDir } = parsed.data as ListQuery;
  const offset = (page - 1) * pageSize;
  const q: string | null = (search || "").trim() || null;

  const orderColumn = (() => {
    const key = (sortBy || "createdAt") as SortBy;
    switch (key) {
      case "name":
        return Prisma.sql`u.name`;
      case "email":
        return Prisma.sql`u.email`;
      case "createdAt":
        return Prisma.sql`u."createdAt"`;
      case "orderTotal":
        return Prisma.sql`COALESCE(a.order_total, 0)`;
      default:
        return Prisma.sql`u."createdAt"`;
    }
  })();

  const orderDirection = (sortDir === "asc" ? "asc" : "desc") as SortDir;
  const orderDirSql =
    orderDirection === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

  try {
    const rows = await prisma.$queryRaw<UserAggRow[]>(Prisma.sql`
      WITH agg AS (
        SELECT "userId" AS user_id,
        COUNT(*) AS order_count,
        COALESCE(SUM("amount"), 0)::int AS order_total
        FROM "Order"
        GROUP BY "userId"
      )
      SELECT 
        u.id,
        u.name,
        u.email,
        u."createdAt" as "createdAt",
        COALESCE(a.order_count, 0)::int AS "orderCount",
        COALESCE(a.order_total, 0)::int AS "orderTotal"
      FROM "User" u
      LEFT JOIN agg a ON u.id = a.user_id
      WHERE (${q}::text IS NULL OR u.name ILIKE '%' || ${q} || '%' OR u.email ILIKE '%' || ${q} || '%')
      ORDER BY ${orderColumn} ${orderDirSql}
      LIMIT ${pageSize} OFFSET ${offset}
    `);

    const safeRows = rows.map((row) => ({
      ...row,
      orderTotal: Number(row.orderTotal),
      orderCount: Number(row.orderCount),
    }));

    const totalRes = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
      SELECT COUNT(*)::int AS count
      FROM "User" u
      WHERE (${q}::text IS NULL OR u.name ILIKE '%' || ${q} || '%' OR u.email ILIKE '%' || ${q} || '%')
    `);

    const total = Number(totalRes[0]?.count || 0);

    const payload: UsersListResponse = {
      items: safeRows,
      total,
      page,
      pageSize,
    };

    return res.json(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Internal Error" });
  }
});
