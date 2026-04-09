import { showToast } from "../../components/show-toast";
import { getCartProducts, deleteCartProduct, updateCartItem, } from "../../services/cart";
import { getProductById } from "../../services/products";
import { renderCartProducts } from "./init-render-cart-product";
import { Country, State } from "country-state-city";
import JustValidate from "just-validate";
import { toggleFavourite } from "../../services/profile";
import { checkout } from "../../services/checkout";

type SelectOption = {
  label: string;
  value: string;
};

type CartStateItem = {
  id: string;
  product_id: string;
  quantity: number;
  selected_color?: string | null;
  selected_size?: number | null;
  price: number;
  status?:string;
};

let cartState: CartStateItem[] = [];

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

export async function initCart() {
  const container = document.querySelector(".cart__items") as HTMLElement;
  const clearBtn = document.querySelector('[data-action="clear"]');

  if (!container) return;

  const cartItems = await getCartProducts();
  cartState = cartItems;

  renderCartProducts(container, cartItems);
  updateSummaryUI();

  //delegation
  container.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const actionEl = target.closest("[data-action]") as HTMLElement;

    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const itemEl = actionEl.closest(".cart-product") as HTMLElement;

    if (!itemEl) return;

    const id = itemEl.dataset.id;

    const item = cartState.find((i) => i.id === id);

    const fallbackItem =
      item ||
      cartState.find(
        (i) =>
          i.product_id === itemEl.dataset.productId &&
          i.selected_color === itemEl.dataset.color &&
          Number(i.selected_size) === Number(itemEl.dataset.size)
      );

    if (!fallbackItem) return;

  //quantity
    if (action === "increase" || action === "decrease") {
      if (action === "increase") {
        fallbackItem.quantity++;
      }

      if (action === "decrease" && fallbackItem.quantity > 1) {
        fallbackItem.quantity--;
      }

      updateQuantityUI(itemEl, fallbackItem);
    }

  //color&size
    if (action === "change-size" || action === "change-color") {
      const productId = itemEl.dataset.productId;

        if (!productId) return;

        const product = await getProductById(productId);

        if (action === "change-size") {
          openSizeDropdown(itemEl, product.sizes, fallbackItem);
        }

        if (action === "change-color") {
          openColorSelector(itemEl, product.colors, fallbackItem);
        }
      }

  //remove
    if (action === "remove") {
      await deleteCartProduct({
        id: fallbackItem.id,
        product_id: fallbackItem.product_id,
        selected_color: fallbackItem.selected_color || undefined,
        selected_size: fallbackItem.selected_size || undefined,
      });

      cartState = cartState.filter((i) => i !== fallbackItem);
      itemEl.remove();
      updateSummaryUI();
    }

  //update
    if (action === "update") {
      await updateCartItem({
        id: fallbackItem.id,
        product_id: fallbackItem.product_id,
        quantity: fallbackItem.quantity,
        selected_color: fallbackItem.selected_color || undefined,
        selected_size: fallbackItem.selected_size || undefined,
      });

      showToast("UPDATED", "success")
      updateSummaryUI();
    }

  //favourite
    if (action === "like") {
      toggleFavourite(fallbackItem.product_id);
      showToast("Toggle Favourite", "success");
    }
  });

  //clear all
  clearBtn?.addEventListener("click", async () => {
    const confirmed = confirm("Clear cart?");
    if (!confirmed) return;

    for (const item of cartState) {
      await deleteCartProduct({
        id: item.id,
        product_id: item.product_id,
        selected_color: item.selected_color || undefined,
        selected_size: item.selected_size || undefined,
      });
    }

    cartState = [];
    container.innerHTML = "";
    updateSummaryUI();
  });

  //locationInit
  const cartContent = document.querySelector(".cart__accordion-content") as HTMLElement;
  initLocationSelects(cartContent);

  //formValidate
  const form = document.querySelector(".cart__form") as HTMLFormElement;

  if (form) {
    const validator = new JustValidate(form, {
      errorFieldCssClass: "is-invalid",
    });

    validator
    .addField('[name="zip"]', [
      {
        validator: (value: string) => {
          if (!value || value.trim() === "") return true;
          return /^\d+$/.test(value);
        },
        errorMessage: "ZIP must contain only numbers",
      },
    ])
      validator.onSuccess(async (e: Event) => {
        e.preventDefault();

        if (cartState.length === 0) {
          showToast("Cart is empty", "error");
          return;
        }

        const totals = calculateTotals(cartState);

        const formData = new FormData(form);

        const countryEl = form.querySelector('[data-select="country"] .cart-select__selected') as HTMLElement;
        const stateEl = form.querySelector('[data-select="state"] .cart-select__selected') as HTMLElement;
        const zipStr = formData.get("zip") as string;
        const shippingMethod = (formData.get("shipping") as string) || undefined;
        const discountInput = document.querySelector<HTMLInputElement>(
          'input[name="discountCode"]'
        );
        const discountCode = discountInput?.value || undefined;
        const country = countryEl?.dataset.value || countryEl?.textContent || "";
        const state = stateEl?.dataset.value || stateEl?.textContent || "";

        const payload = {
          cart: cartState,
          totals,
          shipping: { country, state, zip: Number(zipStr) },
          shippingMethod,
          discountCode,
        };
        console.log(payload)
        try {
          const result = await checkout(payload);

          if (result.error) {
            showToast(
              `Checkout error at ${result.error.stage}: ${result.error.message}`,
              "error"
            );
            return;
          }

          const { order } = result;
          showToast(`Order #${order.id} created successfully!`, "success");
          setTimeout(() => {
            window.location.href = `./checkout?id=${order.id}`;
          }, 500);

        } catch (err: any) {
          showToast(`Unexpected error: ${err.message}`, "error");
        }
      });
  }

  //accordion
  const accordion = document.querySelector(".cart__accordion") as HTMLElement;
  const content = document.querySelector(".cart__accordion-content") as HTMLElement;
  const btn = document.querySelector(".cart__accordion-btn") as HTMLElement;

  if (accordion && content && btn) {
    accordion.addEventListener("click", () => {
      content.classList.toggle("active");
      btn.classList.toggle("active");
    });
  }
}


function updateQuantityUI(el: HTMLElement, item: CartStateItem) {
  const qtyEl = el.querySelector(
    ".cart-product__quantity-span"
  ) as HTMLElement;

  const totalEl = el.querySelector(
    ".cart-product__total"
  ) as HTMLElement;

  if (qtyEl) qtyEl.textContent = String(item.quantity);

  if (totalEl) {
    totalEl.textContent = `${(item.price * item.quantity).toFixed(2)} EUR`;
  }
}

function openSizeDropdown(itemEl: HTMLElement,sizes: number[],item: CartStateItem) {
  const wrapper = itemEl.querySelector(
    ".cart-product__size"
  ) as HTMLElement;

  if (!wrapper) return;


  const existing = wrapper.querySelector(".size-dropdown");
  if (existing) {
    existing.remove();
    return;
  }

  const dropdown = document.createElement("div");
  dropdown.className = "size-dropdown";

  dropdown.innerHTML = sizes
    .map(
      (size) => `
        <div 
          class="size-option ${
            size === item.selected_size ? "active" : ""
          }"
          data-size="${size}"
        >
          W${size}
        </div>
      `
    )
    .join("");

  wrapper.appendChild(dropdown);

  dropdown.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const size = target.dataset.size;
    if (!size) return;

    item.selected_size = Number(size);
    itemEl.dataset.size = size;

    wrapper.textContent = `W${size}`;
    mergeCartItems(item);
    dropdown.remove();
  });

  document.addEventListener("click",(e) => {
      if (!wrapper.contains(e.target as Node)) {
        dropdown.remove();
      }
    },
    { once: true }
  );
  
}

function openColorSelector(itemEl: HTMLElement,colors: string[],item: CartStateItem) {
  const wrapper = itemEl.querySelector(
    ".cart-product__color"
  ) as HTMLElement;

  if (!wrapper) return;

  const existing = wrapper.querySelector(".color-dropdown");
  if (existing) {
    existing.remove();
    return;
  }

  const dropdown = document.createElement("div");
  dropdown.className = "color-dropdown";

  dropdown.innerHTML = colors
    .map(
      (c) => `
        <span 
          class="color-option ${colorMap[c]} ${
            c === item.selected_color ? "active" : ""
          }"
          data-color="${c}"
        ></span>
      `
    )
    .join("");

  wrapper.appendChild(dropdown);


  dropdown.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const color = target.dataset.color;
    if (!color) return;

    item.selected_color = color;
    itemEl.dataset.color = color;

    wrapper.className = `cart-product__color ${colorMap[color]}`;
    mergeCartItems(item);
    dropdown.remove();
  });

  document.addEventListener(
    "click", (e) => {
      if (!wrapper.contains(e.target as Node)) {
        dropdown.remove();
      }
    },
    { once: true }
  );
}

async function mergeCartItems(changedItem: CartStateItem) {
  const duplicate = cartState.find(
    (i) =>
      i !== changedItem &&
      i.product_id === changedItem.product_id &&
      i.selected_color === changedItem.selected_color &&
      i.selected_size === changedItem.selected_size
  );

  if (!duplicate) return;


  duplicate.quantity += changedItem.quantity;
  const duplicateEl = document.querySelector(
  `.cart-product[data-id="${duplicate.id}"]`
) as HTMLElement;

  updateQuantityUI(duplicateEl, duplicate)
  cartState = cartState.filter((i) => i !== changedItem);
  await updateCartItem({
    id: duplicate.id,
    product_id: duplicate.product_id,
    quantity: duplicate.quantity,
    selected_color: duplicate.selected_color || undefined,
    selected_size: duplicate.selected_size || undefined,
  });

  await deleteCartProduct({
    id: changedItem.id,
    product_id: changedItem.product_id,
    selected_color: changedItem.selected_color || undefined,
    selected_size: changedItem.selected_size || undefined,
  });

  const el = document.querySelector(
    `.cart-product[data-id="${changedItem.id}"]`
  );
  el?.remove();
  updateSummaryUI();
  showToast("Items merged", "success");
}

export function initCustomSelect(root: HTMLElement, options: SelectOption[], onChange: (value: string) => void, defaultValue?: string) {
  const selected = root.querySelector(".cart-select__selected")!;
  const dropdown = root.querySelector(".cart-select__dropdown")!;

  dropdown.innerHTML = options
    .map(
      (opt) => `
      <div class="cart-select__option" data-value="${opt.value}">
        ${opt.label}
      </div>
    `
    )
    .join("");

  if (defaultValue) {
    const def = options.find((o) => o.value === defaultValue);
    if (def) selected.textContent = def.label;
  }

  const closeSelect = () => {
    root.classList.remove("open");
  };

  const toggleSelect = (e: Event) => {
    e.stopPropagation();
    
    document.querySelectorAll('.cart-select.open').forEach(openSelect => {
      if (openSelect !== root) {
        openSelect.classList.remove('open');
      }
    });
    
    root.classList.toggle("open");
  };

  selected.addEventListener("click", toggleSelect);

  dropdown.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const option = target.closest(".cart-select__option") as HTMLElement;

    if (!option) return;

    const value = option.dataset.value!;
    selected.textContent = option.textContent!;

    root.classList.remove("open");
    closeSelect();
    onChange(value);
  });

    const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    if (!root.contains(target)) {
      root.classList.remove("open");
    }
  };

  document.addEventListener("click", handleClickOutside);
}

export function initLocationSelects(container: HTMLElement) {
  const countryEl = container.querySelector('[data-select="country"]') as HTMLElement;
  const stateEl = container.querySelector('[data-select="state"]') as HTMLElement;

  if (!countryEl || !stateEl) return;

  const countries = Country.getAllCountries();

  let currentCountry = "US";

  initCustomSelect(
    countryEl,
    countries.map((c) => ({
      label: c.name,
      value: c.isoCode,
    })),
    (countryCode) => {
      currentCountry = countryCode;
      fillStates(countryCode);
    },
    "US"
  );

  function fillStates(countryCode: string) {
    const states = State.getStatesOfCountry(countryCode);

    initCustomSelect(
      stateEl,
      states.map((s) => ({
        label: s.name,
        value: s.isoCode,
      })),
      () => {},
      states[0]?.isoCode
    );
  }

  fillStates(currentCountry);
}

function calculateTotals(cart: CartStateItem[]) {
  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const tax = subtotal * 0.03;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

function updateSummaryUI() {
  const subtotalEl = document.querySelector(".cart__subtotal span:last-child");
  const taxEl = document.querySelector(".cart__tax span:last-child");
  const totalEl = document.querySelector(".cart__total span:last-child");

  const { subtotal, tax, total } = calculateTotals(cartState);

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} EUR`;
  if (taxEl) taxEl.textContent = `${tax.toFixed(2)} EUR`;
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} EUR`;
}