import { prisma } from "@/lib/prisma";
import HomeView from "@/components/HomeView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return <HomeView featured={featured} />;
}
