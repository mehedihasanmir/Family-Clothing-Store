import { prisma } from "@/lib/prisma";
import ProductsView from "@/components/ProductsView";

export const dynamic = "force-dynamic";

type Params = {
  category?: string;
  type?: string;
  occasion?: string;
  age?: string;
  size?: string;
  color?: string;
  price?: string;
  sort?: string;
  q?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const { category, type, occasion, age, size, color, price, sort, q } = await searchParams;

  const orderBy =
    sort === "price_low"
      ? ({ price: "asc" } as const)
      : sort === "price_high"
        ? ({ price: "desc" } as const)
        : ({ createdAt: "desc" } as const);

  // Fetch all products in the selected category, then build filter options from them
  const base = await prisma.product.findMany({
    where: category ? { category } : {},
    orderBy,
  });

  // Available filter options (facets) based on current category
  const types = [...new Set(base.map((p) => p.productType).filter(Boolean))];
  const occasions = [
    ...new Set(base.flatMap((p) => p.occasions.split(",")).filter(Boolean)),
  ];
  const sizes = [...new Set(base.flatMap((p) => p.sizes.split(",")))];
  const colors = [...new Set(base.flatMap((p) => p.colors.split(",")))];
  const ages = [...new Set(base.map((p) => p.ageGroup).filter(Boolean))].sort();

  // Apply the remaining filters
  let products = base;
  if (q) {
    const term = q.toLowerCase();
    products = products.filter(
      (p) => p.nameEn.toLowerCase().includes(term) || p.nameBn.includes(q)
    );
  }
  if (type) products = products.filter((p) => p.productType === type);
  if (occasion) products = products.filter((p) => p.occasions.split(",").includes(occasion));
  if (size) products = products.filter((p) => p.sizes.split(",").includes(size));
  if (color) products = products.filter((p) => p.colors.split(",").includes(color));
  if (age) products = products.filter((p) => p.ageGroup === age);
  if (price) {
    if (price.endsWith("+")) {
      const min = parseInt(price, 10);
      products = products.filter((p) => p.price >= min);
    } else {
      const [min, max] = price.split("-").map((n) => parseInt(n, 10));
      products = products.filter((p) => p.price >= min && p.price <= max);
    }
  }

  return (
    <ProductsView
      products={products}
      facets={{ types, occasions, sizes, colors, ages }}
      active={{
        category: category ?? "",
        type: type ?? "",
        occasion: occasion ?? "",
        age: age ?? "",
        size: size ?? "",
        color: color ?? "",
        price: price ?? "",
        sort: sort ?? "newest",
        q: q ?? "",
      }}
    />
  );
}
