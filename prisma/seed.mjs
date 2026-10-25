// ============================================================
//  পণ্য সিংক স্ক্রিপ্ট — চালাতে: npm run db:seed
//
//  prisma/data/products.mjs ফাইলের তালিকা অনুযায়ী ডেটাবেস আপডেট করে:
//  - নতুন slug → নতুন পণ্য তৈরি হয়
//  - পুরনো slug → পণ্যের তথ্য আপডেট হয়
//  - তালিকা থেকে বাদ দেওয়া পণ্য → ডেটাবেস থেকে মুছে যায়
//    (কোনো অর্ডারে থাকলে মুছে না, নিরাপদে রেখে দেয়)
//  ★ অর্ডারের কোনো ক্ষতি হয় না।
// ============================================================

import { PrismaClient } from "@prisma/client";
import { products } from "./data/products.mjs";

const prisma = new PrismaClient();

async function main() {
  // Create or update every product in the list (matched by slug)
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`Synced ${products.length} products.`);

  // Remove products that are no longer in the list (skip ones used in orders)
  const keepSlugs = products.map((p) => p.slug);
  const stale = await prisma.product.findMany({
    where: { slug: { notIn: keepSlugs } },
    include: { _count: { select: { orderItems: true } } },
  });
  for (const s of stale) {
    if (s._count.orderItems === 0) {
      await prisma.product.delete({ where: { id: s.id } });
      console.log(`Removed: ${s.slug}`);
    } else {
      console.log(`Kept (has orders): ${s.slug}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
