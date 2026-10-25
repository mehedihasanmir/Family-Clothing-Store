// Plain serializable product shape passed from server pages to client components
export type ProductDTO = {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  comparePrice: number | null;
  category: string;
  productType: string;
  occasions: string;
  ageGroup: string;
  sizes: string;
  colors: string;
  image: string;
  featured: boolean;
};
