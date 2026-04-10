import { supabase, guestSupabase } from "../api/supabase";
import { getCurrentSession, getCurrentUser } from "./auth";
import { createShippingAddress } from "./profile";
import { getCartProducts } from "./cart";
import { getLocalCart } from "./local-cart";
import type { ShippingData } from "./profile";
import { getGuestId } from "./guest";

export interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
  selected_color?: string | null;
  selected_size?: number | null;
}

export interface Totals {
  subtotal: number;
  tax: number;
  total: number;
  
}

export interface CheckoutPayload {
  cart?: CartItem[]; 
  discountCode?: string;
  shipping?: ShippingData;
  shippingMethod?: string;
  totals: Totals;
}



export async function createOrder({totals,discountCode,shippingMethod,shippingAddressId}: {
  totals: Totals;
  discountCode?: string;
  shippingMethod?: string;
  shippingAddressId?: string;
  status?: string;
}) {
  const user = await getCurrentUser();
  const client = supabase;

  const { data, error } = await client
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      discount_code: discountCode || null,
      shipping_method: shippingMethod || null,
      shipping_address_id: shippingAddressId ?? null,
    })
    .select()
    .single();

  if (error || !data) throw error || new Error("Order creation failed");
  return data;
}



export async function createOrderItems(orderId: string, cart: CartItem[]) {
  if (!cart.length) return;

  const items = cart.map((item) => ({
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    selected_color: item.selected_color,
    selected_size: item.selected_size,
  }));

  const { error } = await supabase.from("order_items").insert(items);
  if (error) throw error;
}


export async function checkout(payload: CheckoutPayload) {
  try {
    const user = await getCurrentSession();
    const isGuest = !user;
    const client = supabase;

    const cart =
      payload.cart ??
      (user ? await getCartProducts() : getLocalCart());

    if (!cart?.length) {
      return {
        error: { stage: "cartEmpty", message: "Cart is empty" },
      };
    }

    let shippingAddressId: string | undefined;

    if (payload.shipping && !isGuest) {
      try {
        const address = await createShippingAddress(payload.shipping);
        shippingAddressId = address.id;
      } catch (err: any) {
        return {
          error: {
            stage: "createShippingAddress",
            message: err.message,
          },
        };
      }
    }
    let order;

    try {
      const { data, error } = await client
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          guest_id: isGuest ? getGuestId() : null,

          subtotal: payload.totals.subtotal,
          tax: payload.totals.tax,
          total: payload.totals.total,

          discount_code: payload.discountCode || null,
          shipping_method: payload.shippingMethod || null,
          shipping_address_id: shippingAddressId ?? null,

          status: "processing",
        })
        .select()
        .single();

      if (error) throw error;

      order = data;
    } catch (err: any) {
      return {
        error: {
          stage: "createOrder",
          message: err.message,
        },
      };
    }

    try {
      const items = cart.map((item: any) => ({
        order_id: order.id,

        product_id: item.product_id || item.id,
        price: item.price,
        quantity: item.quantity,

        selected_color:
          item.selected_color || item.selectedColor || null,
        selected_size:
          item.selected_size || item.selectedSize || null,
      }));

      const { error } = await client
        .from("order_items")
        .insert(items);

      if (error) throw error;
    } catch (err: any) {
      await client
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);

      return {
        error: {
          stage: "createOrderItems",
          message: err.message,
        },
      };
    }

    return { order };
  } catch (err: any) {
    return {
      error: {
        stage: "checkoutUnknown",
        message: err.message,
      },
    };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw error;
}