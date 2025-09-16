import { Prisma, PrismaClient } from "@prisma/client";
import { mulberry32 } from "../util/rng";

const FIRST = [
  "Alex",
  "Sam",
  "Jamie",
  "Taylor",
  "Jordan",
  "Casey",
  "Riley",
  "Morgan",
  "Charlie",
  "Avery",
];
const LAST = [
  "Lee",
  "Patel",
  "Garcia",
  "Nguyen",
  "Smith",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Clark",
];
const pick = <T>(rand: () => number, arr: T[]) => arr[Math.floor(rand() * arr.length)] as T;

export async function seedDatabase(
  prisma: PrismaClient,
  {
    users,
    orders,
    products,
    seed,
  }: { users: number; orders: number; products: number; seed: number },
  onProgress?: (ev: string, data: any) => void
) {
  const rand = mulberry32(seed);

  onProgress?.("seed:truncate", {});
  await prisma.$transaction([
    prisma.order.deleteMany({}),
    prisma.product.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);

  // Users
  const userBatch: Prisma.UserCreateManyInput[] = Array.from(
    { length: users },
    (_, i) => {
      const name = `${pick(rand, FIRST)} ${pick(rand, LAST)}`;
      const email = `${name
        .toLowerCase()
        .replace(/\s+/g, ".")}${i}@example.com`;
      const createdAt = new Date(
        Date.now() - Math.floor(rand() * 1000 * 60 * 60 * 24 * 365)
      );
      return { id: i + 1, name, email, createdAt };
    }
  );
  for (let i = 0; i < userBatch.length; i += 5000) {
    await prisma.user.createMany({
      data: userBatch.slice(i, i + 5000),
      skipDuplicates: true,
    });
    onProgress?.("seed:users", {
      inserted: Math.min(i + 5000, userBatch.length),
    });
  }

  // Products
  const productBatch: Prisma.ProductCreateManyInput[] = Array.from(
    { length: products },
    (_, i) => {
      const name = `Product ${i + 1}`;
      const price = Math.round((rand() * 500 + 1) * 100) / 100;
      return { id: i + 1, name, price };
    }
  );
  for (let i = 0; i < productBatch.length; i += 5000) {
    await prisma.product.createMany({
      data: productBatch.slice(i, i + 5000),
      skipDuplicates: true,
    });
    onProgress?.("seed:products", {
      inserted: Math.min(i + 5000, productBatch.length),
    });
  }

  // Orders (chunked)
  const orderChunk = 10000; // tune based on memory
  let created = 0;
  while (created < orders) {
    const size = Math.min(orderChunk, orders - created);
    const data: Prisma.OrderCreateManyInput[] = Array.from(
      { length: size },
      (_, k) => {
        const userId = Math.floor(rand() * users) + 1;
        const productId = Math.floor(rand() * products) + 1;
        const qtyish = rand() * 5 + 1;
        const price = Number(productId % products) + 1;
        const amount = Math.round(qtyish * (rand() * 500 + 1) * 100) / 100;
        const createdAt = new Date(
          Date.now() - Math.floor(rand() * 1000 * 60 * 60 * 24 * 365)
        );
        return { userId, productId, amount, createdAt };
      }
    );
    await prisma.order.createMany({ data });
    created += size;
    onProgress?.("seed:orders", { inserted: created });
  }

  onProgress?.("seed:done", { users, products, orders });
}
