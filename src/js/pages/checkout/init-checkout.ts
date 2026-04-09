import Handlebars from "handlebars";
import templateRaw from "@html/pages/checkout/checkout.hbs?raw";
import itemPartial from "@html/pages/checkout/checkout-item.hbs?raw";
import { Country, State } from "country-state-city";
import { clearCartAfterOrder, getCartProducts } from "../../services/cart";
import { createOrUpdateUserProfile, createShippingAddress, getShippingAddress, getUserProfile } from "../../services/profile";
import { getCurrentUser } from "../../services/auth";
import { checkout, updateOrderStatus } from "../../services/checkout";
import JustValidate from "just-validate";

Handlebars.registerPartial("components/checkout-item", itemPartial);
const template = Handlebars.compile(templateRaw);


type CheckoutItemView = {
  id: string;
  title: string;
  quantity: number;
  total: number;
  imageUrl: string;
  selected_color?: string | null;
  sizeLabel?: string;
  colorClass?: string;
};

type CartStateItem = {
  id: string;
  product_id: string;
  title: string;
  quantity: number;
  selected_color?: string | null;
  selected_size?: number | null;
  price: number;
  image: string;
};


let cartState: CartStateItem[] = [];
let checkoutData: any = null;

function mapToCheckout(items: CartStateItem[]): CheckoutItemView[] {
  return items.map(i => ({
    ...i,
    total: i.price * i.quantity,
    imageUrl: i.image
      ? `./img/main/products/${i.image}.webp`
      : `./img/main/products/crisp_product_dress-1.webp`,
    sizeLabel: i.selected_size ? `W${i.selected_size}` : undefined,
    colorClass: i.selected_color ? i.selected_color.replace(/\s+/g, '-') : undefined,
  }));
}

function getShippingCost(method: string): number {
  return method === "flat" ? 5 : 10;
}

function getShippingLabel(method: string): string {
  return method === "flat" ? "Flat Rate - Fixed" : "Best Way - Table Rate";
}

function updateTotalsUI() {
  if (!checkoutData) return;

  const subtotal = checkoutData.totals.subtotal;
  const shippingCost = getShippingCost(checkoutData.shippingMethod);
  const tax = checkoutData.totals.tax;
  const total = subtotal + shippingCost + tax;

  const subtotalEl = document.querySelector(".checkout__subtotal span:last-child");
  const shippingEl = document.getElementById("shipping-cost");
  const taxEl = document.querySelector(".checkout__tax span:last-child");
  const totalEl = document.getElementById("order-total");
  const itemCountEl = document.querySelector(".checkout__cart-toggle p");
  const summaryMethodEl = document.getElementById("summary-shipping-method");

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} EUR`;
  if (shippingEl) shippingEl.textContent = `${shippingCost.toFixed(2)} EUR`;
  if (taxEl) taxEl.textContent = `${tax.toFixed(2)} EUR`;
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} EUR`;
  if (itemCountEl) {
    const count = cartState.reduce((acc, i) => acc + i.quantity, 0);
    itemCountEl.textContent = `${count} item${count !== 1 ? "s" : ""} in Cart!`;
  }
  if (summaryMethodEl) summaryMethodEl.textContent = getShippingLabel(checkoutData.shippingMethod);
}

function initCheckoutItemOpeners() {
  const items = document.querySelectorAll(".checkout-item");
  
  items.forEach(item => {
    const opener = item.querySelector(".checkout-item__opener");
    const details = item.querySelector(".checkout-item__details");
    const openerSpan = opener?.querySelector("span");
    
    if (!opener || !details) return;
    
    details.classList.add("hidden");
    
    opener.addEventListener("click", () => {
      details.classList.toggle("hidden");
      openerSpan?.classList.toggle("active");
    });
  });
}

function updatePaymentBlock() {
  if (!checkoutData) return;

  const data = checkoutData.shipping;
  
  const firstNameEl = document.querySelector(".checkout__content.second .firstname");
  const lastNameEl = document.querySelector(".checkout__content.second .lastname");
  const streetEl = document.querySelector(".checkout__content.second .street");
  const regionEl = document.querySelector(".checkout__content.second .region");
  const zipEl = document.querySelector(".checkout__content.second .zip");
  const countryEl = document.querySelector(".checkout__content.second .country");

  if (firstNameEl) firstNameEl.textContent = data.firstName || "";
  if (lastNameEl) lastNameEl.textContent = data.lastName || "";
  if (streetEl) streetEl.textContent = data.street || "";
  if (regionEl) regionEl.textContent = data.state || "";
  if (zipEl) zipEl.textContent = data.zip || "";
  if (countryEl) countryEl.textContent = data.country || "";

  const summaryFirstName = document.querySelector(".checkout__summary-stage .firstname");
  const summaryLastName = document.querySelector(".checkout__summary-stage .lastname");
  const summaryStreet = document.querySelector(".checkout__summary-stage .street");
  const summaryRegion = document.querySelector(".checkout__summary-stage .region");
  const summaryZip = document.querySelector(".checkout__summary-stage .zip");
  const summaryCountry = document.querySelector(".checkout__summary-stage .country");

  if (summaryFirstName) summaryFirstName.textContent = data.firstName || "";
  if (summaryLastName) summaryLastName.textContent = data.lastName || "";
  if (summaryStreet) summaryStreet.textContent = data.street || "";
  if (summaryRegion) summaryRegion.textContent = data.state || "";
  if (summaryZip) summaryZip.textContent = data.zip || "";
  if (summaryCountry) summaryCountry.textContent = data.country || "";
}

function updateShippingUI(method: string) {
  const shippingCost = getShippingCost(method);
  const shippingLabel = getShippingLabel(method);
  
  const shippingCostEl = document.getElementById("shipping-cost");
  const shippingMethodEl = document.getElementById("shipping-method-display");
  const totalEl = document.getElementById("order-total");
  
  if (shippingCostEl) shippingCostEl.textContent = `${shippingCost} EUR`;
  if (shippingMethodEl) shippingMethodEl.textContent = shippingLabel;
  
  if (checkoutData) {
    const subtotal = checkoutData.totals.subtotal;
    const tax = checkoutData.totals.tax;
    const total = subtotal + shippingCost + tax;
    
    if (totalEl) totalEl.textContent = `${total.toFixed(2)} EUR`;
    
    checkoutData.shippingMethod = method;
    checkoutData.totals.total = total;
  }
}

function initShippingRadios() {
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="shipping"]');
  
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        updateShippingUI(target.value);
      }
    });
  });
  
  const checkedRadio = document.querySelector<HTMLInputElement>('input[name="shipping"]:checked');
  if (checkedRadio) {
    updateShippingUI(checkedRadio.value);
  }
}

function initToggleItems() {
  const toggleBtn = document.querySelector(".checkout__toggle-items");
  const itemsContainer = document.querySelector(".checkout__items");
  
  toggleBtn?.addEventListener("click", () => {
    itemsContainer?.classList.toggle("hidden");
    toggleBtn.classList.toggle("active");
  });
}

function switchStep(step: number) {
  const steps = document.querySelectorAll(".checkout__step");
  const contentFirst = document.querySelector(".checkout__content.first");
  const contentSecond = document.querySelector(".checkout__content.second");
  const summaryInner = document.querySelector(".checkout__summary-inner");
  const summaryStage = document.querySelector(".checkout__summary-stage");
  const itemsContainer = document.querySelector(".checkout__items");
  const toggleBtn = document.querySelector(".checkout__toggle-items");

  steps.forEach((s, i) => {
    if (i === step - 1) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });

  if (step === 1) {
    contentFirst?.classList.remove("hidden");
    contentSecond?.classList.add("hidden");
    summaryInner?.classList.remove("hidden");
    summaryStage?.classList.add("hidden");
    if (itemsContainer && toggleBtn) {
      if (!itemsContainer.classList.contains("hidden")) {
        toggleBtn.classList.remove("active");
      } else {
        toggleBtn.classList.add("active");
      }
    }
  } else {
    contentFirst?.classList.add("hidden");
    contentSecond?.classList.remove("hidden");
    // summaryInner?.classList.add("hidden");
    summaryStage?.classList.remove("hidden");
    if (itemsContainer && toggleBtn) {
      if (!itemsContainer.classList.contains("hidden")) {
        toggleBtn.classList.remove("active");
      } else {
        toggleBtn.classList.add("active");
      }
    }
    
    updatePaymentBlock();
    updateTotalsUI();
  }
}



function initShippingForm(container: HTMLElement, cart: CartStateItem[]) {
  const shippingForm = document.getElementById("checkout__shipping") as HTMLFormElement;

  if (!shippingForm) return;

  const validator = new JustValidate(shippingForm, {
    errorFieldCssClass: "is-invalid",
  });

  validator
    .addField('[name="firstName"]', [
      { rule: "required", errorMessage: "First name is required" },
      {
        validator: (value: string) => {
          return /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(value);
        },
        errorMessage: 'First name must contain only letters',
      },
    ])
    .addField('[name="lastName"]', [
      { rule: "required", errorMessage: "Last name is required" },
      {
        validator: (value: string) => {
          return /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(value);
        },
        errorMessage: 'First name must contain only letters',
      },
    ])
    .addField('[name="street"]', [
      { rule: "required", errorMessage: "Street is required" },
    ])
    .addField('[name="zip"]', [
      {
        validator: (value: string) => {
          if (!value) return true;
          return /^\d+$/.test(value);
        },
        errorMessage: "ZIP must be numeric",
      },
    ]);


  validator.onSuccess(async (e: Event) => {
    e.preventDefault();

    const formData = new FormData(shippingForm);

    const countryEl = container.querySelector(
      '[data-select="country"] .cart-select__selected'
    ) as HTMLElement;

    const stateEl = container.querySelector(
      '[data-select="state"] .cart-select__selected'
    ) as HTMLElement;

    const country = countryEl?.textContent?.trim() || "";
    const state = stateEl?.textContent?.trim() || "";

    const selectedShippingMethod =
      (formData.get("shipping") as string) || "flat";

    const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const tax = subtotal * 0.03;
    const shippingCost = getShippingCost(selectedShippingMethod);
    const total = subtotal + tax + shippingCost;

    checkoutData = {
      cart: cart.map(item => ({
        ...item,
        total: item.price * item.quantity,
        imageUrl: item.image
          ? `./img/main/products/${item.image}.webp`
          : `./img/main/products/crisp_product_dress-1.webp`,
        sizeLabel: item.selected_size ? `W${item.selected_size}` : undefined,
      })),
      shipping: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        street: formData.get("street") as string,
        country,
        state,
        zip: formData.get("zip") as string,
      },
      shippingMethod: selectedShippingMethod,
      totals: {
        subtotal,
        tax,
        total,
      },
    };

    try {
      const user = await getCurrentUser();

      if (user) {
        await createOrUpdateUserProfile({
          firstName: checkoutData.shipping.firstName,
          lastName: checkoutData.shipping.lastName,
        });
        await createShippingAddress({
          country,
          state,
          address: checkoutData.shipping.street,
          zip: Number(checkoutData.shipping.zip),
        });
      }
    } catch (err) {
      console.error("Shipping save error:", err);
    }

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    updateTotalsUI();
    updateShippingUI(selectedShippingMethod);

    switchStep(2);
  });
}

function initPaymentForm() {
  const placeOrderBtn = document.querySelector(".checkout__payment-order");
  const backBtn = document.querySelector(".checkout__payment-back");
  const applyDiscountBtn = document.querySelector(".checkout__payment-discount button");
  const discountInput = document.querySelector(".checkout__payment-discount input") as HTMLInputElement;

  backBtn?.addEventListener("click", () => {
    switchStep(1);
  });

  applyDiscountBtn?.addEventListener("click", () => {
    const code = discountInput?.value;
    console.log("Apply discount:", code);//dont forget to do
  });

  placeOrderBtn?.addEventListener("click", async () => {
    if (!checkoutData) {
      alert("No order data found. Please go back to shipping step.");
      return;
    }

    const btn = placeOrderBtn as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = "Processing...";

    try {
      const result = await checkout({
        cart: cartState,
        totals: checkoutData.totals,
        shipping: checkoutData.shipping,
        shippingMethod: checkoutData.shippingMethod,
      });

      if (result.error) {
        alert(`Error: ${result.error.message}`);
        btn.disabled = false;
        btn.textContent = "PLACE ORDER";
        return;
      }

      await updateOrderStatus(result.order.id, "completed");
      alert(`Order #${result.order.id} created successfully!`);
      clearCartAfterOrder();
      sessionStorage.removeItem("checkoutData");
      setTimeout(()=> {
        window.location.href = "./"
      }, 500)
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`);
      btn.disabled = false;
      btn.textContent = "PLACE ORDER";
    }
  });
}

export async function initCheckout() {
  const container = document.querySelector(".checkout") as HTMLElement;

  if (!container) return;

  cartState = await getCartProducts();

  if (!cartState.length) {
    // container.innerHTML = "<p>Cart is empty</p>";
    window.location.href="./cart.html"
    return;
  }

  const items = mapToCheckout(cartState);
  const itemCount = cartState.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.total, 0);
  const tax = subtotal * 0.03;
  const defaultShippingCost = 5;
  const total = subtotal + tax + defaultShippingCost;

  container.innerHTML = template({
    items,
    itemCount,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shippingCost: defaultShippingCost.toFixed(2),
    total: total.toFixed(2),
    firstName: "",
    lastName: "",
    street: "",
    state: "",
    zip: "",
    country: "",
    shippingMethodLabel: "Flat Rate",
  });

  const savedData = sessionStorage.getItem("checkoutData");
  if (savedData) {
    checkoutData = JSON.parse(savedData);
  }


  await fillUserProfile(container);
  initLocationSelects(container);
  await fillShippingData(container)
  initShippingRadios();
  initShippingForm(container, cartState);
  initPaymentForm();
  initToggleItems();
  initCheckoutItemOpeners();
  await toggleLogin();

  const itemsContainer = document.querySelector(".checkout__items");
  const toggleBtn = document.querySelector(".checkout__toggle-items");
  if (itemsContainer && toggleBtn) {
    itemsContainer.classList.remove("hidden");
    toggleBtn.classList.remove("active");
  }
    switchStep(1);
}

async function fillUserProfile(container: HTMLElement) {
  try {
    const profile = await getUserProfile();
    if (!profile) return;

    const firstNameInput = container.querySelector<HTMLInputElement>(
      '[name="firstName"]'
    );
    const lastNameInput = container.querySelector<HTMLInputElement>(
      '[name="lastName"]'
    );

    if (firstNameInput && profile.first_name) {
      firstNameInput.value = profile.first_name;
    }

    if (lastNameInput && profile.last_name) {
      lastNameInput.value = profile.last_name;
    }
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}

async function fillShippingData(container: HTMLElement) {
  try {
    const shipping = await getShippingAddress();
    if (!shipping) return;

    const streetInput = container.querySelector<HTMLInputElement>(
      '[name="street"]'
    );
    const zipInput = container.querySelector<HTMLInputElement>(
      '[name="zip"]'
    );

    if (streetInput && shipping.address) {
      streetInput.value = shipping.address;
    }

    if (zipInput && shipping.zip) {
      zipInput.value = String(shipping.zip);
    }

    const countrySelect = container.querySelector(
      '[data-select="country"] .cart-select__selected'
    ) as HTMLElement;

    const stateSelect = container.querySelector(
      '[data-select="state"] .cart-select__selected'
    ) as HTMLElement;

    if (countrySelect && shipping.country) {
      countrySelect.textContent = shipping.country;
      countrySelect.dataset.value = shipping.country;
    }

    if (stateSelect && shipping.state) {
      stateSelect.textContent = shipping.state;
      stateSelect.dataset.value = shipping.state;
    }

  } catch (err) {
    console.error("Failed to load shipping:", err);
  }
}



export function initLocationSelects(container: HTMLElement) {
  const countryEl = container.querySelector('[data-select="country"]') as HTMLElement;
  const stateEl = container.querySelector('[data-select="state"]') as HTMLElement;

  if (!countryEl || !stateEl) return;

  const countries = Country.getAllCountries();
  let currentCountry = "US";

  const updateCheckoutDataLocation = () => {
    if (!checkoutData) return;
    
    const countrySelected = countryEl.querySelector('.cart-select__selected') as HTMLElement;
    const stateSelected = stateEl.querySelector('.cart-select__selected') as HTMLElement;
    
    const country = countrySelected?.textContent?.trim() || "";
    const state = stateSelected?.textContent?.trim() || "";
    
    checkoutData.shipping.country = country;
    checkoutData.shipping.state = state;

    if (document.querySelector('.checkout__content.second:not(.hidden)')) {
      updatePaymentBlock();
    }
  };

  const initCountrySelect = () => {
    const selected = countryEl.querySelector('.cart-select__selected') as HTMLElement;
    const dropdown = countryEl.querySelector('.cart-select__dropdown') as HTMLElement;
    
    if (!selected || !dropdown) return;

    dropdown.innerHTML = countries
      .map(
        (c) => `
          <div class="cart-select__option" data-value="${c.isoCode}">
            ${c.name}
          </div>
        `
      )
      .join("");

    const defaultCountry = countries.find(c => c.isoCode === "US");
    if (defaultCountry) {
      selected.textContent = defaultCountry.name;
      selected.dataset.value = defaultCountry.isoCode;
    }

    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      stateEl.classList.remove("open");
      countryEl.classList.toggle("open");
    });

    dropdown.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const option = target.closest(".cart-select__option") as HTMLElement;
      if (!option) return;

      const value = option.dataset.value!;
      selected.textContent = option.textContent!;
      selected.dataset.value = value;
      countryEl.classList.remove("open");

      fillStates(value);
      updateCheckoutDataLocation();
 
      if (checkoutData) {
        sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      }
    });
    
  };

  const closeAllDropdowns = () => {
    countryEl.classList.remove("open");
    stateEl.classList.remove("open");
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!countryEl.contains(target) && !stateEl.contains(target)) {
      closeAllDropdowns();
    }
  };


  const initStateSelect = () => {
    const selected = stateEl.querySelector('.cart-select__selected') as HTMLElement;
    const dropdown = stateEl.querySelector('.cart-select__dropdown') as HTMLElement;
    
    if (!selected || !dropdown) return;

    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      countryEl.classList.remove("open");
      stateEl.classList.toggle("open");
    });

    dropdown.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const option = target.closest(".cart-select__option") as HTMLElement;
      if (!option) return;

      const value = option.dataset.value!;
      selected.textContent = option.textContent!;
      selected.dataset.value = value;
      stateEl.classList.remove("open");

      updateCheckoutDataLocation();
      
      if (checkoutData) {
        sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      }
    });
  };

  const fillStates = (countryCode: string) => {
    const states = State.getStatesOfCountry(countryCode);
    const dropdown = stateEl.querySelector('.cart-select__dropdown') as HTMLElement;
    const selected = stateEl.querySelector('.cart-select__selected') as HTMLElement;
    
    if (!dropdown || !selected) return;

    dropdown.innerHTML = states
      .map(
        (s) => `
          <div class="cart-select__option" data-value="${s.isoCode}">
            ${s.name}
          </div>
        `
      )
      .join("");

    if (states.length > 0) {
      selected.textContent = states[0].name;
      selected.dataset.value = states[0].isoCode;
    } else {
      selected.textContent = "Select state";
      selected.dataset.value = "";
    }
  };

  document.addEventListener("click", () => {
    countryEl.classList.remove("open");
    stateEl.classList.remove("open");
  });

  document.addEventListener("click", handleClickOutside);
  initCountrySelect();
  initStateSelect();
  fillStates(currentCountry);
}

async function toggleLogin() {
  const user = await getCurrentUser()
  const checkoutLogin = document.querySelector(".checkout__login");

  if (user) {
    checkoutLogin?.classList.add("hide");
  } else {
    checkoutLogin?.classList.remove("hide");
  }
  
}