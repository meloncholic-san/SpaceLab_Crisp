

import { getCartProducts } from "../services/cart";
import { getCurrentUser } from "../services/auth";
import { getLocalCart } from "../services/local-cart";

export async function updateCartIcon() {
  try {
    const user = await getCurrentUser();
    let cart = [];
    if (user) {
      cart = await getCartProducts();
    } else {
      cart = getLocalCart();
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const desktopCartPrice = document.querySelector(".header__cart-price");
    if (desktopCartPrice) {
      desktopCartPrice.textContent = `${totalPrice.toFixed(2)} EUR`;
    }

    const mobileCartPrice = document.querySelector(".header-menu__cart-price");
    if (mobileCartPrice) {
      mobileCartPrice.textContent = `${totalPrice.toFixed(2)} EUR`;
    }
    
    
    return { totalPrice };
  } catch (err) {
    console.error("Failed to update cart icon:", err);
    return { totalItems: 0, totalPrice: 0 };
  }
}