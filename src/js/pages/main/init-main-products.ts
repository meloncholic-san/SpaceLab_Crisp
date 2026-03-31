import { getProductsByTag } from "../../services/products";
import { renderProductsCardCatalogue } from "./render-main-products-catalogue";


function updateQueryParams(params: Record<string, string | number>) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value.toString());
  });
  window.history.replaceState({}, "", url.toString());
}

async function onFilterClick(
  e: Event,
  container: HTMLElement,
  state: { currentPage: number; currentTag: string },
  loadMoreBtn: HTMLButtonElement,
) {
  const target = e.target as HTMLElement;
  const filterItem = target.closest(".main-products__filters-item");
  if (!filterItem || !(filterItem instanceof HTMLElement)) return;
  const currentFilter = filterItem.dataset.filter;
  if (!currentFilter) return;
  
  document.querySelectorAll(".main-products__filters-item").forEach(item => {
    item.classList.remove("active");
    const cb = item.querySelector(".main-products__filters-checkbox");
    cb?.classList.remove("active");
  });

  filterItem.classList.add("active");
  const checkbox = filterItem.querySelector(".main-products__filters-checkbox");
  checkbox?.classList.add("active");


  state.currentTag = currentFilter;
  state.currentPage = 1;

  updateQueryParams({ tag: state.currentTag, page: state.currentPage });

  const products = await getProductsByTag({
    tag: state.currentTag,
    page: state.currentPage,
  });
  renderProductsCardCatalogue(products, container, { showColors: false, filter: state.currentTag});
  loadMoreBtn.style.display = products.length < 8 ? 'none' : 'block';
}

async function onLoadMore(
  // e: Event,
  container: HTMLElement,
  state: { currentPage: number; currentTag: string }, 
  loadMoreBtn: HTMLButtonElement,
) {
  state.currentPage += 1;

  updateQueryParams({ page: state.currentPage });

  const products = await getProductsByTag({
    tag: state.currentTag,
    page: state.currentPage,
  });
  loadMoreBtn.style.display = products.length < 8 ? 'none' : 'block';
  renderProductsCardCatalogue(products, container, { append: true, showColors: true, filter: state.currentTag });


}

export async function initMainProducts() {
    const filters = document.querySelector<HTMLElement>(".main-products__filters-list");
    const container = document.querySelector<HTMLElement>(".main-products__list");
    const loadMoreBtn = document.querySelector<HTMLButtonElement>(".main-products button");
    const filterItems = document.querySelectorAll<HTMLElement>(".main-products__filters-item");
    if (!filters || !container || !loadMoreBtn) return;

    const urlParams = new URLSearchParams(window.location.search);
    const initialTag = urlParams.get("tag") || "top";
    const initialPage = parseInt(urlParams.get("page") || "1", 10);
    filterItems.forEach(item => {
    if (item.dataset.filter === initialTag) {
        const checkbox = item.querySelector(".main-products__filters-checkbox");
        checkbox?.classList.add("active");
    }
    });
    const state = { currentPage: initialPage, currentTag: initialTag };

    const initialProducts = await getProductsByTag({
        tag: state.currentTag,
        page: state.currentPage,
    });

    loadMoreBtn.style.display = initialProducts.length < 8 ? 'none' : 'block';
    renderProductsCardCatalogue(initialProducts, container, { showColors: false, filter: state.currentTag });

    filters.addEventListener("click", (e) => onFilterClick(e, container, state, loadMoreBtn));
    loadMoreBtn.addEventListener("click", () => onLoadMore(container, state, loadMoreBtn));
}