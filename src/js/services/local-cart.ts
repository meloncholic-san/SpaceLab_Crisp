import { supabase } from "../api/supabase";
import { updateCartIcon } from "../components/init-cart-icons";

export interface LocalCartItem {
  product_id: string;

  title: string;
  image: string;

  selected_color: string;
  selected_size: number;

  price: number;
  quantity: number;
}

const LOCAL_CART_KEY = "local_cart";

function isSameItem(a: LocalCartItem, b: LocalCartItem) {
  return (
    a.product_id === b.product_id &&
    a.selected_color === b.selected_color &&
    a.selected_size === b.selected_size
  );
}

export function getLocalCart(): LocalCartItem[] {
  try {
    const cart = localStorage.getItem(LOCAL_CART_KEY);
    return cart ? (JSON.parse(cart) as LocalCartItem[]) : [];
  } catch (err) {
    console.error("GET LOCAL CART ERROR:", err);
    return [];
  }
}

export function saveLocalCart(cart: LocalCartItem[]): void {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("SAVE LOCAL CART ERROR:", err);
  }
}

export function addLocalCartProduct(
  product: LocalCartItem
): LocalCartItem[] {
  try {
    const cart = getLocalCart();

    const existing = cart.find(item => isSameItem(item, product));

    if (existing) {
      existing.quantity += product.quantity;
    } else {
      cart.push(product);
    }

    saveLocalCart(cart);
    updateCartIcon();
    return cart;

  } catch (err) {
    console.error("ADD LOCAL CART ERROR:", err);
    return [];
  }
}

export function deleteLocalCartProduct(target: {product_id: string;selected_color: string;selected_size: number;}): void {
  try {
    const cart = getLocalCart();

    const updated = cart.filter(
        i =>!(i.product_id === target.product_id &&i.selected_color === target.selected_color &&i.selected_size === target.selected_size)
    );

    saveLocalCart(updated);
    updateCartIcon();
  } catch (err) {
    console.error("DELETE LOCAL CART ERROR:", err);
  }
}

export async function syncLocalCartToDatabase() {
  console.group("SYNC LOCAL CART");

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw new Error(error.message);
    if (!session) return;

    const localCart = getLocalCart();
    if (!localCart.length) return;

    const userId = session.user.id;

    for (const item of localCart) {
      const { data: existing } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", item.product_id)
        .eq("selected_color", item.selected_color)
        .eq("selected_size", item.selected_size)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("cart")
          .update({
            quantity: existing.quantity + item.quantity,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("cart").insert({
          product_id: item.product_id,
          user_id: userId,

          title: item.title,
          image: item.image,

          selected_color: item.selected_color,
          selected_size: item.selected_size,

          price: item.price,
          quantity: item.quantity,
        });
      }
    }
    updateCartIcon();
    localStorage.removeItem(LOCAL_CART_KEY);

  } catch (err) {
    console.error("SYNC LOCAL CART ERROR:", err);
  } finally {
    console.groupEnd();
  }
}