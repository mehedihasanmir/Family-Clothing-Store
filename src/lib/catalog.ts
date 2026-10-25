// ============================================================
//  ক্যাটালগ কনফিগারেশন — এখানে ক্যাটাগরি, পোশাকের ধরন ও উপলক্ষ ঠিক করুন
//  CATALOG CONFIG — categories, product types and occasions
//
//  নতুন ধরন বা উপলক্ষ যোগ করতে চাইলে নিচের তালিকায় এক লাইন যোগ করুন।
//  তারপর prisma/data/products.mjs ফাইলে পণ্যের সাথে সেই id ব্যবহার করুন।
// ============================================================

import type { Lang } from "./i18n";

export type CatalogItem = { id: string; bn: string; en: string };

export const CATEGORIES: CatalogItem[] = [
  { id: "men", bn: "পুরুষ", en: "Men" },
  { id: "women", bn: "নারী", en: "Women" },
  { id: "kids", bn: "শিশু", en: "Kids" },
];

// পোশাকের ধরন (বাংলাদেশের প্রচলিত সব ধরন)
export const PRODUCT_TYPES: CatalogItem[] = [
  // পুরুষ
  { id: "panjabi", bn: "পাঞ্জাবি", en: "Panjabi" },
  { id: "shirt", bn: "শার্ট", en: "Shirt" },
  { id: "tshirt", bn: "টি-শার্ট", en: "T-Shirt" },
  { id: "polo", bn: "পোলো শার্ট", en: "Polo Shirt" },
  { id: "pant", bn: "প্যান্ট/জিন্স", en: "Pants/Jeans" },
  { id: "lungi", bn: "লুঙ্গি", en: "Lungi" },
  { id: "pajama", bn: "পায়জামা", en: "Pajama" },
  // নারী
  { id: "saree", bn: "শাড়ি", en: "Saree" },
  { id: "three-piece", bn: "থ্রি-পিস", en: "Three-Piece" },
  { id: "kurti", bn: "কুর্তি", en: "Kurti" },
  { id: "borka", bn: "বোরকা/হিজাব", en: "Borka/Hijab" },
  { id: "lehenga", bn: "লেহেঙ্গা", en: "Lehenga" },
  // শিশু
  { id: "frock", bn: "ফ্রক", en: "Frock" },
  { id: "dress", bn: "ড্রেস", en: "Dress" },
  { id: "romper", bn: "রমপার", en: "Romper" },
  { id: "hoodie", bn: "হুডি/জ্যাকেট", en: "Hoodie/Jacket" },
];

// উপলক্ষ / উৎসব (বাংলাদেশি উৎসব অনুযায়ী)
export const OCCASIONS: CatalogItem[] = [
  { id: "eid", bn: "ঈদ কালেকশন", en: "Eid Collection" },
  { id: "pohela-boishakh", bn: "পহেলা বৈশাখ", en: "Pohela Boishakh" },
  { id: "wedding", bn: "বিয়ে/পার্টি", en: "Wedding/Party" },
  { id: "puja", bn: "পূজা", en: "Puja" },
  { id: "winter", bn: "শীত কালেকশন", en: "Winter Collection" },
  { id: "summer", bn: "গ্রীষ্ম", en: "Summer" },
  { id: "casual", bn: "ক্যাজুয়াল", en: "Casual" },
  { id: "formal", bn: "ফরমাল/অফিস", en: "Formal/Office" },
];

// ---- helper functions ----

function label(list: CatalogItem[], id: string, lang: Lang): string {
  const item = list.find((i) => i.id === id);
  return item ? item[lang] : id;
}

export function categoryLabel(id: string, lang: Lang): string {
  return label(CATEGORIES, id, lang);
}

export function typeLabel(id: string, lang: Lang): string {
  return label(PRODUCT_TYPES, id, lang);
}

export function occasionLabel(id: string, lang: Lang): string {
  return label(OCCASIONS, id, lang);
}
