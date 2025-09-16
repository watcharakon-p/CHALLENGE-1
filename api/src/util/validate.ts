import { z } from "zod";

export const listQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(200).default(50),
    search: z.string().trim().max(200).optional().default(""),
    sortBy: z.enum(["name", "email", "createdAt", "orderTotal"]).default("createdAt"),
    sortDir: z.enum(["asc", "desc"]).default("asc"),
});

export type ListQuery = z.infer<typeof listQuerySchema>;
