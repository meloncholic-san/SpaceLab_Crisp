import Handlebars from "handlebars";
import productTemplate from "@html/pages/product/product.hbs?raw";

const template = Handlebars.compile(productTemplate);

type Product = {
  id: string;
  title: string;
  brand?: string;
  price: number;
  discount_percent?: number | null;
  tags?: string[];
  colors?: string[];
  sizes?: number[];
  image?: string[];
  product_code?: string;
  description?: string;
  dress_length?: string;
};

type SizeItem = {
  value: number;
  label: string;
  available: boolean;
};

type ProductView = Product & {
  oldPrice?: number;
  colors?: string[];
  allSizes?: SizeItem[];
  isOSFA?: boolean;
  category?: string;
};

const ALL_SIZES = [0, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 40, 42, 44, 46, 48, 50, 52];

const tagsList: Record<string, string> = {
  best: "BEST SELLERS",
  new: "NEW ARRIVALS",
  top: "TOP WOMAN",
  summer: "COLLECTION: SUMMER",
  spring: "COLLECTION: SPRING",
  trending: "TRENDING",
};


const formatSizeLabel = (size: number) => {
  if (size === 0) return "OSFA";
  return "W"+size;
};

export function renderSingleProduct(
  product: Product,
  container: HTMLElement
) {
  if (!product) {
    container.innerHTML = `<p>Product not found</p>`;
    return;
  }

  const normalized: ProductView = { ...product };

  if (normalized.discount_percent) {
    normalized.oldPrice = normalized.price;

    normalized.price = Number(
      (normalized.price * (1 - normalized.discount_percent / 100)).toFixed(2)
    );
  }

  if (normalized.tags?.length) {
    normalized.category = normalized.tags
      .map(tag => tagsList[tag])
      .filter((item): item is string => Boolean(item))
      .join(", ");
  }


  const colorMap: Record<string, string> = {
    "Charcoal": "Charcoal",
    "Ivory": "Ivory",
    "Navy Blue": "Navy-Blue",
    "Deep Teal": "Deep-Teal",
    "Warm Gray": "Warm-Gray",
    "Muted Indigo": "Muted-Indigo",
    "Cool Gray": "Cool-Gray",
    "Burgundy": "Burgundy",
    "Mustard": "Mustard",
    "Brown": "Brown",
    "Dusty Rose": "Dusty-Rose",
    "Turquoise": "Turquoise",
  };

  normalized.colors = normalized.colors?.map(
    c => colorMap[c] ?? c
  );


  const productSizes = normalized.sizes || [];

  normalized.isOSFA =
    productSizes.length === 1 && productSizes[0] === 0;

  normalized.allSizes = ALL_SIZES.map(size => ({
    value: size,
    label: formatSizeLabel(size),
    available: productSizes.includes(size),
  }));


  if (!normalized.image?.length) {
    normalized.image = ["crisp_product_dress-1"];
  }


  container.innerHTML = template(normalized);
}