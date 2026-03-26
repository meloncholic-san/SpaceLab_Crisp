import { getProductById } from "../../services/products";
import { renderSingleProduct } from "./render-single-product";

function initProductGallery(container: HTMLElement) {
  const mainImg = container.querySelector(".product__main-image") as HTMLImageElement;
  const thumbnails = container.querySelectorAll(".product__thumbnail");

  if (!mainImg || !thumbnails.length) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {
      const newSrc = thumb.getAttribute("data-src");
      if (!newSrc) return;

      mainImg.src = newSrc;

      thumbnails.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

function initAccordion(container: HTMLElement | null) {
  if (!container) return;

  const items = container.querySelectorAll<HTMLElement>(".product-main__accordion-item");

  items.forEach(item => {
    const header = item.querySelector<HTMLElement>(".product-main__accordion-header");
    const opener = item.querySelector<HTMLElement>(".product-main__accordion-opener");

    if (!header) return;

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      item.classList.toggle("active");

      if (opener) {
        opener.classList.toggle("active", !isActive);
      }
    });
  });
}

function initImageZoom(wrapper: HTMLElement) {
  const img = wrapper.querySelector<HTMLImageElement>(".product__main-image");
  const lens = wrapper.querySelector<HTMLElement>(".product__zoom-lens");

  if (!img || !lens) return;

  wrapper.addEventListener("mousemove", e => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensWidth = lens.offsetWidth;
    const lensHeight = lens.offsetHeight;

    let left = x - lensWidth / 2;
    let top = y - lensHeight / 2;

    if (left < 0) left = 0;
    if (top < 0) top = 0;
    if (left > rect.width - lensWidth) left = rect.width - lensWidth;
    if (top > rect.height - lensHeight) top = rect.height - lensHeight;

    lens.style.left = `${left}px`;
    lens.style.top = `${top}px`;

    lens.style.backgroundImage = `url(${img.src})`;
    lens.style.backgroundPosition = `-${left}px -${top}px`;
    lens.style.backgroundSize = `${img.width}px ${img.height}px`;
  });
}


export async function initProductMain() {
  const container = document.querySelector(".product-main-content") as HTMLElement;
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) return;

  try {
    const product = await getProductById(id);
    renderSingleProduct(product, container);
  } catch {
    container.innerHTML = `<p>Error loading product</p>`;
  }
    const galleryContainer = document.querySelector(".product__gallery") as HTMLElement;
    const descriptionContainer = document.querySelector(".product-main__accordion") as HTMLElement;
    const firstThumb = container.querySelector(".product__thumbnail");
    const mainWrapper = document.querySelector(".product__main-image-wrapper") as HTMLElement;
    
    firstThumb?.classList.add("active");

    initProductGallery(galleryContainer);
    initAccordion(descriptionContainer);
    if (mainWrapper) initImageZoom(mainWrapper);
}