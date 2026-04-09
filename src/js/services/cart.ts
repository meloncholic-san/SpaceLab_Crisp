import { supabase } from "../api/supabase";
import { updateCartIcon } from "../components/init-cart-icons";
import { getCurrentUser } from "./auth";
import { addLocalCartProduct, deleteLocalCartProduct, getLocalCart, saveLocalCart } from "./local-cart";


export interface CartProductPayload {
  product: {
    id: string;
    title: string;
    price: number;
    discount_percent?: number | null;
    image: string;
  };
  quantity: number;
  selectedColor: string | null;
  selectedSize: number | null;
}


export async function addCartProduct(payload: CartProductPayload) {
  console.group("ADD TO CART");
  try {
    const { product, quantity, selectedColor, selectedSize } = payload;

    if (!selectedColor || !selectedSize) {
    throw new Error("Select color and size");
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    if (!session) {
      const cart = addLocalCartProduct({
        product_id: product.id,
        title: product.title,
        image: product.image[0],
        selected_color: selectedColor,
        selected_size: selectedSize,
        quantity,
        price: product.price,
      });

      return { data: cart, error: null };
    }

    const userId = session.user.id;

    const { data: existingItem, error: fetchError } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("product_id", product.id)
      .eq("user_id", userId)
      .eq("selected_color", selectedColor)
      .eq("selected_size", selectedSize)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart")
        .update({
          quantity: existingItem.quantity + quantity,
        })
        .eq("id", existingItem.id);

      if (updateError) throw new Error(updateError.message);

    } else {
      const { error: insertError } = await supabase
        .from("cart")
        .insert({
          product_id: product.id,
          user_id: userId,

          title: product.title,
          image: product.image[0],

          selected_color: selectedColor,
          selected_size: selectedSize,

          price: product.price,
          quantity,
        });

      if (insertError) throw new Error(insertError.message);
    }
    updateCartIcon();
    return { error: null };

  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    return { error: err };
  } finally {
    console.groupEnd();
  }
}

export async function getCartProducts() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return getLocalCart();
    }

    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data;

  } catch (err) {
    console.error("GET CART ERROR:", err);
    return [];
  }
}


export async function deleteCartProduct(params: {
  id?: string;
  product_id?: string;
  selected_color?: string;
  selected_size?: number;
}) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      if (
        params.product_id &&
        params.selected_color &&
        params.selected_size !== undefined
      ) {
        deleteLocalCartProduct({
          product_id: params.product_id,
          selected_color: params.selected_color,
          selected_size: params.selected_size,
        });
      }
      return;
    }

    if (!params.id) {
      throw new Error("Cart item id is required for delete");
    }

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("id", params.id);

    if (error) throw new Error(error.message);
    updateCartIcon();
  } catch (err) {
    console.error("DELETE CART ERROR:", err);
  }
}



export async function updateCartItem(params: {
  id?: string;
  product_id?: string;
  selected_color?: string;
  selected_size?: number;
  quantity: number;
}) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      if (
        params.product_id &&
        params.selected_color &&
        params.selected_size !== undefined
      ) {
        const cart = getLocalCart();

        const updatedCart = cart.map((item) => {
          if (
            item.product_id === params.product_id &&
            item.selected_color === params.selected_color &&
            item.selected_size === params.selected_size
          ) {
            return {
              ...item,
              quantity: params.quantity,
            };
          }
          return item;
        });

        saveLocalCart(updatedCart);
      }

      return;
    }

    if (!params.id) {
      throw new Error("Cart item id is required for update");
    }

    const { error } = await supabase
      .from("cart")
      .update({
        quantity: params.quantity,
        selected_color: params.selected_color,
        selected_size: params.selected_size,
      })
      .eq("id", params.id);

    if (error) throw new Error(error.message);
    updateCartIcon();
  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
  }
}

export async function clearCartAfterOrder() {
  try {
    const user = await getCurrentUser();
    if (user) {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id);
      
      if (error) throw error;
    } else {
      localStorage.removeItem("local_cart");
    }
    updateCartIcon();
  } catch (err) {
    console.error("Failed to clear cart:", err);
  }
}