import Handlebars from 'handlebars';
import productCardTemplate from '@html/components/product-card.hbs?raw';
import productsBannerTemplate from '@html/pages/products/products-banner.hbs?raw';
import orderBtnPartial from '@html/components/order-btn.hbs?raw';

Handlebars.registerPartial('components/order-btn', orderBtnPartial);

const template = Handlebars.compile(productCardTemplate);
const bannerTemplate = Handlebars.compile(productsBannerTemplate);


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
};

type ProductView = Product & {
  oldPrice?: number;
  category?: string;
  showColors?: boolean;
  showBrand?: boolean;
};
type RenderOptions = {
  append?: boolean;  
  showColors?: boolean;
  showBrand?: boolean;
  filter?: string | null;
  asSwiper?: boolean;
  insertBanner?: number;
};

const tagsList: Record<string, string> = {
  best: "BEST SELLERS",
  new: "NEW ARRIVALS",
  top: "TOP WOMAN",
  summer: "COLLECTION: SUMMER",
  spring: "COLLECTION: SPRING",
  trending: "TRENDING",
};

export function renderProductsCardCatalogue(
  products: Product[],
  container: HTMLElement,
  { append = false, showColors = false, showBrand = false, filter = null, asSwiper = false, insertBanner = undefined}: RenderOptions = {}
) {
  console.log(products)
  const normalizedProducts = products.map(product => {
    const newProduct = { ...product } as ProductView;

    if (newProduct.discount_percent) {
      newProduct.oldPrice = newProduct.price;

      newProduct.price = Number(
        (newProduct.price * (1 - newProduct.discount_percent / 100)).toFixed(2)
      );
    }


  if (newProduct.tags?.length) {
    if (filter) {
      newProduct.category = tagsList[filter] ?? filter;
    } else {
      newProduct.category = newProduct.tags
        .map(tag => tagsList[tag])
        .filter((item): item is string => Boolean(item))
        .join(", ");
    }
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

    newProduct.colors = newProduct.colors?.map(c => colorMap[c] ?? c);

  
    newProduct.showColors = showColors;
    newProduct.showBrand = showBrand;

    return newProduct;
  });

  if (normalizedProducts.length === 0) {
    container.innerHTML =
      '<p style="font-size:20px; color:red;">No items!</p>';
    return;
  }

  const html = normalizedProducts
    .map((product, index) => {
      let cardHtml = asSwiper
        ? `<div class="swiper-slide">${template(product)}</div>`
        : template(product);

      if (insertBanner !== undefined && index === insertBanner) {
        cardHtml += `<div class="products-catalogue__banner">${bannerTemplate({})}</div>`;
      }

      return cardHtml;
    })
    .join("");


  if (asSwiper) {
    container.innerHTML = html;
  } else if (append) {
    container.insertAdjacentHTML("beforeend", html);
  } else {
    container.innerHTML = html;
  }
  
}