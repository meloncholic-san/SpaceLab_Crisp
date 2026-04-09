import Handlebars from "handlebars";
import cartItemTemplate from "@html/pages/cart/cart-product.hbs?raw";

const template = Handlebars.compile(cartItemTemplate);

type CartItem = {
  id: string;
  product_id: string;
  title: string;
  image?: string | null;
  selected_color?: string | null;
  selected_size?: number | null;
  price: number;
  quantity: number;
};

type CartItemView = CartItem & {
  total: number;
  imageUrl: string;
  sizeLabel?: string;
};


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

function mapCartItem(item: CartItem): CartItemView {
  return {
    ...item,
    total: item.price * item.quantity,
    imageUrl: item.image
      ? `./img/main/products/${item.image}.webp`
      : `./img/main/products/crisp_product_dress-1.webp`,
    sizeLabel: item.selected_size
      ? `W${item.selected_size}`
      : undefined,
    selected_color: colorMap[item.selected_color!] ?? item.selected_color
  };
}

export function renderCartProducts(container: HTMLElement, cartItems: CartItem[]) {

  const mappedCartItems = cartItems.map(mapCartItem);
  
  if (mappedCartItems.length === 0) {
    container.innerHTML =
      '<p style="font-size:20px; color:red;">No items!</p>';
    return;
  }

  const html = mappedCartItems
    .map(product => template(product))
    .join("");

  container.innerHTML = html;
}