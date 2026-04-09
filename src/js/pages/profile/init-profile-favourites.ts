import Handlebars from "handlebars";
import templateRaw from "@html/pages/profile/profile-favourite-items.hbs?raw";

import { addCartProduct } from "../../services/cart";
import { showToast } from "../../components/show-toast";
import { getFavourites, removeFavourite } from "../../services/profile";

Handlebars.registerHelper("eq", (a, b) => a === b);
type Product = {
  id: string;
  title: string;
  price: number;
  discount_percent?: number | null;
  colors?: string[];
  sizes?: number[];
  image: string;
};

type ProductWithDiscount = Product & {
  finalPrice: number;
  hasDiscount: boolean;
  selectedColor: string | null;
  selectedSize: number | null;
};

const template = Handlebars.compile(templateRaw);

let favouritesState: ProductWithDiscount[] = [];

function calculateFinalPrice(price: number, discount?: number | null) {
  if (discount && discount > 0) {
    const val = price - (price * discount) / 100;
    return {
      finalPrice: Math.round(val * 100) / 100,
      hasDiscount: true,
    };
  }

  return { finalPrice: price, hasDiscount: false };
}

function normalizeProducts(raw: any[]): ProductWithDiscount[] {
  return raw
    .map((i) => i.product)
    .filter(Boolean)
    .map((p: any) => {
      const { finalPrice, hasDiscount } = calculateFinalPrice(
        p.price,
        p.discount_percent
      );
      return {
        id: p.id,
        title: p.title,
        price: p.price,
        finalPrice,
        hasDiscount,
        discount_percent: p.discount_percent,
        colors: p.colors || [],
        sizes: p.sizes || [],
        image: Array.isArray(p.image) ? p.image : [],

        selectedColor: p.colors?.[0],
        selectedSize: p.sizes?.[0],
      };
    });
}

function render(container: HTMLElement) {
  if (!favouritesState.length) {
    container.innerHTML = `<p>No favourites yet</p>`;
    return;
  }

  container.innerHTML = favouritesState
    .map((p) =>
      template({
        ...p,
        selectedColor: p.selectedColor,
        selectedSize: p.selectedSize,
      })
    )
    .join("");
}


function getItemAndProduct(target: HTMLElement) {
  const item = target.closest(".favourites-item") as HTMLElement;
  if (!item) return {};

  const id = item.dataset.id;
  if (!id) return {};

  const productIndex = favouritesState.findIndex((p) => p.id === id);
  const product = favouritesState[productIndex];

  return { item, id, product, productIndex };
}


function initActions(container: HTMLElement) {
  container.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;

    const { item, id, product, productIndex } =
      getItemAndProduct(target);

    if (!item || !id || !product) return;

    // =========================
    // ❌ REMOVE
    // =========================
    if (target.closest("[data-action='remove']")) {
      try {
        await removeFavourite(id);

        favouritesState = favouritesState.filter((p) => p.id !== id);

        render(container);

        showToast("Removed", "success");
      } catch {
        showToast("Error", "error");
      }
    }

    // =========================
    // ✏️ UPDATE (open modal)
    // =========================
    if (target.closest("[data-action='update']")) {
      const modal = item.querySelector(".favourites-item__modal");
      if (!modal) return;

      // закрываем все
      container
        .querySelectorAll(".favourites-item__modal.active")
        .forEach((m) => m.classList.remove("active"));

      modal.classList.add("active");
    }

    // =========================
    // 🎨 SELECT COLOR
    // =========================
    const colorEl = target.closest(".favourites-item__color-badge") as HTMLElement;

    if (colorEl) {
    const color = colorEl.dataset.color;

    favouritesState[productIndex].selectedColor = color || null;

    render(container);
    return;
    }

    // =========================
    // 📏 SELECT SIZE
    // =========================
    const sizeEl = target.closest(".favourites-item__size-badge") as HTMLElement;

    if (sizeEl) {
    const size = Number(sizeEl.dataset.size);

    favouritesState[productIndex].selectedSize = size;

    render(container);
    return;
    }
    // =========================
    // 🛒 ADD TO CART
    // =========================
    if (target.closest(".favourites-item__btn-add")) {
      try {
        const input = item.querySelector<HTMLInputElement>(
          ".favourites-item__quantity"
        );

        let quantity = parseInt(input?.value || "1");
        if (isNaN(quantity) || quantity < 1) quantity = 1;
        
        await addCartProduct({
          product: {
            id: product.id,
            title: product.title,
            price: product.finalPrice,
            image: product.image,
          },
          selectedColor: product.selectedColor,
          selectedSize: product.selectedSize,
          quantity,
        });
        showToast("Added to cart", "success");
      } catch {
        showToast("Error", "error");
      }
    }
  });
  const addAllBtn = document.querySelector("[data-type='add']") as HTMLButtonElement;
    if (addAllBtn) {
    addAllBtn.addEventListener("click", async () => {
        try {
        const items = container.querySelectorAll(".favourites-item");

        const promises: Promise<any>[] = [];

        items.forEach((item) => {
            const id = item.getAttribute("data-id");
            if (!id) return;

            const product = favouritesState.find((p) => p.id === id);
            if (!product) return;

            const input = item.querySelector<HTMLInputElement>(
            ".favourites-item__quantity"
            );

            let quantity = parseInt(input?.value || "1");
            if (isNaN(quantity) || quantity < 1) quantity = 1;

            promises.push(
            addCartProduct({
                product: {
                id: product.id,
                title: product.title,
                price: product.finalPrice,
                image: product.image || "",
                },
                selectedColor: product.selectedColor,
                selectedSize: product.selectedSize,
                quantity,
            })
            );
        });

        await Promise.all(promises);

        showToast("All items added to cart", "success");
        } catch (err) {
        console.error(err);
        showToast("Failed to add all", "error");
        }
    });
    }

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const isInside = target.closest(".favourites-item");

    if (!isInside) {
      document
        .querySelectorAll(".favourites-item__modal.active")
        .forEach((m) => m.classList.remove("active"));
    }
  });
}


export async function initProfileFavourites() {
  const container = document.querySelector(
    "#profile-favourites-list"
  ) as HTMLElement;

  if (!container) return;

  try {
    const raw = await getFavourites();

    favouritesState = normalizeProducts(raw);

    render(container);
    initActions(container);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>Error</p>`;
  }
}