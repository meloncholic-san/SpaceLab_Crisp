import type { Filters } from "../../services/products";
import { getProductsWithFilters } from "../../services/products";
import { renderProductsCardCatalogue } from "../main/render-main-products-catalogue";

function updateQueryParams(params: Record<string, string | number>) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value.toString());
  });
  window.history.replaceState({}, "", url.toString());
}

function getFiltersFromQuery(): Filters {
  const params = new URL(window.location.href).searchParams;

  return {
    brands: params.get("brands") ? params.get("brands")!.split(",").filter(Boolean) : [],
    sizes: params.get("sizes") ? params.get("sizes")!.split(",").filter(Boolean) : [],
    lengths: params.get("lengths") ? params.get("lengths")!.split(",").filter(Boolean) : [],
    colors: params.get("colors") ? params.get("colors")!.split(",").filter(Boolean) : [],
    priceMin: Number(params.get("priceMin")) || 0,
    priceMax: Number(params.get("priceMax")) || 500,
    sort: (params.get("sort") as Filters["sort"]) || "price_asc",
  };
}

async function applyFilters(container: HTMLElement, state: Filters) {
  const products = await getProductsWithFilters(state);
  console.log(state)
  renderProductsCardCatalogue(products, container, {
    append: false,
    insertBanner: 11,
    showColors: true,
  });

    updateQueryParams({
    brands: state.brands.join(","),
    sizes: state.sizes.join(","),
    lengths: state.lengths.join(","),
    colors: state.colors.join(","),
    priceMin: state.priceMin,
    priceMax: state.priceMax,
    sort: state.sort,
  });
  renderFiltersUI(state);
  renderActiveFilters(state);
  toggleGlobalFiltersVisibility(state);
}

function toggleArrayValue(arr: string[], value: string) {
  const index = arr.indexOf(value);

  if (index === -1) {
    arr.push(value);
  } else {
    arr.splice(index, 1);
  }
}

async function onFilterChange(e: Event, container: HTMLElement,state: Filters) {
  const target = e.target as HTMLElement;

  // BRAND
  const brandItem = target.closest(".products-catalogue__brand-item");
  if (brandItem) {
    const value = brandItem.getAttribute("data-brand");
    if (!value) return;

    toggleArrayValue(state.brands, value);

    const checkbox = brandItem.querySelector(
      ".products-catalogue__brand-checkbox"
    );
    checkbox?.classList.toggle("active");

    await applyFilters(container, state);
    return;
  }

  // SIZE
  const sizeItem = target.closest(".products-catalogue__size-item");
  if (sizeItem) {
    const value = sizeItem.getAttribute("data-size");
    if (!value) return;

    toggleArrayValue(state.sizes, value);

    sizeItem.classList.toggle("active");

    await applyFilters(container, state);
    return;
  }

  // LENGTH
  const lengthItem = target.closest(".products-catalogue__length-item");
  if (lengthItem) {
    const value = lengthItem.getAttribute("data-length");
    if (!value) return;

    toggleArrayValue(state.lengths, value);

    const checkbox = lengthItem.querySelector(
      ".products-catalogue__length-checkbox"
    );
    checkbox?.classList.toggle("active");

    await applyFilters(container, state);
    return;
  }

  // COLOR
  const colorItem = target.closest(".products-catalogue__color-item");
  if (colorItem) {
    const value = colorItem.getAttribute("data-color");
    if (!value) return;

    toggleArrayValue(state.colors, value);

    colorItem.classList.toggle("active");

    await applyFilters(container, state);
    return;
  }
}

function onAccordionClick (e: Event) {
    const target = e.target as HTMLElement;

    const header = target.closest(".products-catalogue__accordion-header");
    
    if (!header) return;

    const accordion = header.closest(".products-catalogue__accordion") as HTMLElement;
    if (!accordion) return;

    const content = accordion.querySelector(".products-catalogue__accordion-content") as HTMLElement;
    if (!content) return;

    accordion.classList.toggle("active");
    
    const btn = accordion.querySelector(".filter-accordion__toggle") as HTMLButtonElement;
    if (btn) {
      btn.textContent = accordion.classList.contains("active") ? "−" : "+";
    }
}

function renderFiltersUI(state: Filters) {
  const filtersContainer = document.querySelector(".products-catalogue__filters");

  if (!filtersContainer) return;

  filtersContainer.querySelectorAll(".products-catalogue__brand-item")
    .forEach(el => {
      const value = el.getAttribute("data-brand");
      const active = state.brands.includes(value || "");

      el.classList.toggle("active", active);
      el.querySelector(".products-catalogue__brand-checkbox")
        ?.classList.toggle("active", active);
    });

  filtersContainer.querySelectorAll(".products-catalogue__size-item")
    .forEach(el => {
      const value = el.getAttribute("data-size");
      const active = state.sizes.includes(value || "");

      el.classList.toggle("active", active);
    });

  filtersContainer.querySelectorAll(".products-catalogue__length-item")
    .forEach(el => {
      const value = el.getAttribute("data-length");
      const active = state.lengths.includes(value || "");

      el.classList.toggle("active", active);
      el.querySelector(".products-catalogue__length-checkbox")
        ?.classList.toggle("active", active);
    });

  filtersContainer.querySelectorAll(".products-catalogue__color-item")
    .forEach(el => {
      const value = el.getAttribute("data-color");
      const active = state.colors.includes(value || "");

      el.classList.toggle("active", active);
    });

  const minSlider = document.getElementById("min-slider") as HTMLInputElement;
  const maxSlider = document.getElementById("max-slider") as HTMLInputElement;
  const minPriceText = document.querySelector(".products-catalogue__price-min") as HTMLElement;
  const maxPriceText = document.querySelector(".products-catalogue__price-max") as HTMLElement;
  const range = document.getElementById("slider-range") as HTMLElement;

  if (minSlider && maxSlider && range) {
    minSlider.value = String(state.priceMin);
    maxSlider.value = String(state.priceMax);

    const max = Number(maxSlider.max);

    const percent1 = (state.priceMin / max) * 100;
    const percent2 = (state.priceMax / max) * 100;

    range.style.left = percent1 + "%";
    range.style.width = percent2 - percent1 + "%";

    if (minPriceText) minPriceText.textContent = `${state.priceMin}.00 EUR`;
    if (maxPriceText) maxPriceText.textContent = `${state.priceMax}.00 EUR`;
  }

  const pricingSelect = document.getElementById("pricing") as HTMLSelectElement;
  if (pricingSelect) {
    pricingSelect.value = state.sort;
  }
}

function renderActiveFilters(state: Filters) {
  const globalContainer = document.querySelector(".products-catalogue__global");
  if (!globalContainer) return;

  const createItem = (value: string, category: keyof Filters) => {
    const li = document.createElement("li");
    li.className = "products-catalogue__global-item";

    const removeBtn = document.createElement("div");
    removeBtn.textContent = "";
    removeBtn.classList.add("products-catalogue__global-reset-icon")

    const name = document.createElement("div");

    if (category === "colors") {
      li.classList.add("color")
      name.className = `products-catalogue__global-item-name color ${value.replace(/\s+/g, "-")}`;
    } else {
      name.className = "products-catalogue__global-item-name";
      name.textContent = getFilterLabel(value, category);
    }

    removeBtn.addEventListener("click", async () => {
      const arr = state[category] as string[];
      const index = arr.indexOf(value);
      if (index !== -1) arr.splice(index, 1);

      const productsList = document.querySelector(".products-catalogue__list") as HTMLElement;
      await applyFilters(productsList, state);
    });

    li.appendChild(removeBtn);
    li.appendChild(name);

    return li;
  };

  const renderCategory = (category: keyof Filters, selector: string) => {
    const block = globalContainer.querySelector(selector);
    if (!block) return;

    const ul = block.querySelector(".products-catalogue__global-list");
    if (!ul) return;

    ul.innerHTML = "";

    const items = state[category] as string[];

    items.forEach(value => {
      ul.appendChild(createItem(value, category));
    });
  };

  renderCategory("brands", `[data-category="brand"]`);
  renderCategory("sizes", `[data-category="size"]`);
  renderCategory("lengths", `[data-category="length"]`);
  renderCategory("colors", `[data-category="color"]`);

  const priceBlock = globalContainer.querySelector(`[data-category="price"]`);
  if (priceBlock) {
    const ul = priceBlock.querySelector(".products-catalogue__global-list");
    if (!ul) return;

    ul.innerHTML = "";

    const li = document.createElement("li");
    li.className = "products-catalogue__global-item";

    const removeBtn = document.createElement("div");
    removeBtn.textContent = "";
    removeBtn.classList.add("products-catalogue__global-reset-icon")

    const name = document.createElement("p");
    name.className = "products-catalogue__global-item-name";
    name.innerHTML = `
      <span>${state.priceMin} EUR</span> - <span>${state.priceMax} EUR</span>
    `;

    removeBtn.addEventListener("click", async () => {
      state.priceMin = 0;
      state.priceMax = 500;

      const productsList = document.querySelector(".products-catalogue__list") as HTMLElement;
      await applyFilters(productsList, state);
    });

    li.appendChild(removeBtn);
    li.appendChild(name);

    ul.appendChild(li);
  }

  const resetAll = globalContainer.querySelector(".products-catalogue__global-reset") as HTMLButtonElement;
  if (resetAll) {
    resetAll.onclick = async () => {
      state.brands = [];
      state.sizes = [];
      state.lengths = [];
      state.colors = [];
      state.priceMin = 0;
      state.priceMax = 500;
      state.sort = "price_asc";

      const productsList = document.querySelector(".products-catalogue__list") as HTMLElement;
      await applyFilters(productsList, state);
    };
  }
}

function getFilterLabel(value: string, category: keyof Filters): string {
  const container = document.querySelector(".products-catalogue__filters");
  if (!container) return value;

  let selector = "";

  switch (category) {
    case "brands":
      selector = `.products-catalogue__brand-item[data-brand="${value}"]`;
      break;
    case "sizes":
      selector = `.products-catalogue__size-item[data-size="${value}"]`;
      break;
    case "lengths":
      selector = `.products-catalogue__length-item[data-length="${value}"]`;
      break;
    default:
      return value;
  }

  const el = container.querySelector(selector);
  return el?.getAttribute("data-label") || value;
}

function hasActiveFilters(state: Filters): boolean {
  return (
    state.brands.length > 0 ||
    state.sizes.length > 0 ||
    state.lengths.length > 0 ||
    state.colors.length > 0 ||
    state.priceMin !== 0 ||
    state.priceMax !== 500
  );
}

function toggleGlobalFiltersVisibility(state: Filters) {
  const globalContainer = document.querySelector(".products-catalogue__global") as HTMLElement;
  if (!globalContainer) return;

  globalContainer.classList.toggle("active", hasActiveFilters(state));
}

export async function initProductsCatalogue() {

  function updateSlider() {
    let minVal = Number(minSlider.value);
    let maxVal = Number(maxSlider.value);

    if (maxVal - minVal < minGap) {
      if (minVal > filtersState.priceMin) {
        minSlider.value = String(maxVal - minGap);
      } else {
        maxSlider.value = String(minVal + minGap);
      }
    }

    minVal = Number(minSlider.value);
    maxVal = Number(maxSlider.value);

    const percent1 = (minVal / max) * 100;
    const percent2 = (maxVal / max) * 100;

    range.style.left = percent1 + "%";
    range.style.width = percent2 - percent1 + "%";

    minPriceText.textContent = `${minVal}.00 EUR`;
    maxPriceText.textContent = `${maxVal}.00 EUR`;
  }

  const minSlider = document.getElementById("min-slider") as HTMLInputElement;
  const maxSlider = document.getElementById("max-slider") as HTMLInputElement;
  const range = document.getElementById("slider-range") as HTMLElement;
  const minPriceText = document.querySelector(".products-catalogue__price-min") as HTMLElement;
  const maxPriceText = document.querySelector(".products-catalogue__price-max") as HTMLElement;
  const productsList = document.querySelector(".products-catalogue__list") as HTMLElement;
  const filtersContainer = document.querySelector(".products-catalogue__filters") as HTMLElement;
  const applyBtn = document.querySelector(".products-catalogue__price-btn") as HTMLButtonElement;
  const pricingSelect = document.getElementById("pricing") as HTMLSelectElement;

  const minGap = 50;
  const max = Number(maxSlider.max);

  const filtersState: Filters = getFiltersFromQuery();

  filtersState.brands.forEach(brand => {
    const el = filtersContainer.querySelector(`.products-catalogue__brand-item[data-brand="${brand}"]`);
    el?.classList.add("active");
    el?.querySelector(".products-catalogue__brand-checkbox")?.classList.add("active");
  });

  filtersState.sizes.forEach(size => {
    const el = filtersContainer.querySelector(`.products-catalogue__size-item[data-size="${size}"]`);
    el?.classList.add("active");
  });

  filtersState.lengths.forEach(length => {
    const el = filtersContainer.querySelector(`.products-catalogue__length-item[data-length="${length}"]`);
    el?.classList.add("active");
  });

  filtersState.colors.forEach(color => {
    const el = filtersContainer.querySelector(`.products-catalogue__color-item[data-color="${color}"]`);
    el?.classList.add("active");
  });

  minSlider.value = String(filtersState.priceMin);
  maxSlider.value = String(filtersState.priceMax);
  updateSlider();

  pricingSelect.value = filtersState.sort;

  if (productsList) {
    await applyFilters(productsList, filtersState);
  }

  minSlider.addEventListener("input", updateSlider);
  maxSlider.addEventListener("input", updateSlider);

  applyBtn.addEventListener("click", async () => {
    filtersState.priceMin = Number(minSlider.value);
    filtersState.priceMax = Number(maxSlider.value);

    await applyFilters(productsList, filtersState);
  });


  filtersContainer.addEventListener("click", (e) => {
    onAccordionClick(e)
    onFilterChange(e, productsList, filtersState);
  } );

  pricingSelect.addEventListener("change", async () => {
  const value = pricingSelect.value as Filters["sort"];

  filtersState.sort = value;

  await applyFilters(productsList, filtersState);
});

}