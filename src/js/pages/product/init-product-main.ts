import { showToast } from "../../components/show-toast";
import { addCartProduct } from "../../services/cart";
import { getProductById } from "../../services/products";
import { renderSingleProduct } from "./render-single-product";

const colorReverseMap: Record<string, string> = {
  "Charcoal": "Charcoal",
  "Ivory": "Ivory",
  "Navy-Blue": "Navy Blue",
  "Deep-Teal": "Deep Teal",
  "Warm-Gray": "Warm Gray",
  "Muted-Indigo": "Muted Indigo",
  "Cool-Gray": "Cool Gray",
  "Burgundy": "Burgundy",
  "Mustard": "Mustard",
  "Brown": "Brown",
  "Dusty-Rose": "Dusty Rose",
  "Turquoise": "Turquoise",
};

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

function initQuantity(container: HTMLElement) {
  const minusBtn = container.querySelector(".product__pricing-quantity-btn-menus");
  const plusBtn = container.querySelector(".product__pricing-quantity-btn-plus");
  const valueEl = container.querySelector(".product__pricing-quantity-span");

  if (!minusBtn || !plusBtn || !valueEl) return;

  plusBtn.addEventListener("click", () => {
    productState.quantity++;
    valueEl.textContent = String(productState.quantity);
  });

  minusBtn.addEventListener("click", () => {
    if (productState.quantity > 1) {
      productState.quantity--;
      valueEl.textContent = String(productState.quantity);
    }
  });
}

function initSizes(container: HTMLElement) {
  const sizes = container.querySelectorAll<HTMLElement>(".product__size");

  sizes.forEach(size => {
    if (size.classList.contains("disabled")) return;

    size.addEventListener("click", () => {
      sizes.forEach(s => s.classList.remove("active"));
      size.classList.add("active");

      productState.selectedSize = size.dataset.size || null;
    });
  });
}

function initColors(container: HTMLElement) {
  const colors = container.querySelectorAll<HTMLElement>(".product__color");

  colors.forEach(color => {
    color.addEventListener("click", () => {
      colors.forEach(c => c.classList.remove("active"));
      color.classList.add("active");

      const classList = Array.from(color.classList);
      const colorClass = classList.find(c => c !== "product__color" && c !== "active");
      if (!colorClass) return;

      productState.selectedColor = colorReverseMap[colorClass] ?? colorClass;
    });
  });
}

function initAddToCart(container: HTMLElement, productPrice: number) {
  const btn = container.querySelector(".product__add-to-cart");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (!productState.selectedSize) {
      showToast("Select size", "warning");
      return;
    }
    if (!productState.selectedColor) {
      showToast("Select color", "warning");
      return;
    }

    await addCartProduct({
      product: {
        id: productState.id,
        title: productState.title,
        price: productPrice,
        image: productState.image,
      },
      quantity: productState.quantity,
      selectedColor: productState.selectedColor,
      selectedSize: Number(productState.selectedSize),
    });
    showToast("Added to cart", "success");
  });
}


type ProductState = {
  id: string;
  quantity: number;
  title: string;
  selectedSize: string | null;
  selectedColor: string | null;
  price: number;
  image: string;
};

const productState: ProductState = {
    id: "",
    quantity: 1,
    title: "",
    selectedSize: null,
    selectedColor: null,
    price: 0,
    image: "",
  };

export async function initProductMain() {
  const container = document.querySelector(".product-main-content") as HTMLElement;
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) return;

  try {
    const product = await getProductById(id);
    renderSingleProduct(product, container);
    productState.id = product.id;
    productState.title = product.title;
    productState.image = product.image;
    if (product.discount_percent) {
      const discountedPrice = product.price * (1 - product.discount_percent / 100);
      productState.price = Number(discountedPrice.toFixed(2));
    } else {
      productState.price = Number(product.price.toFixed(2));
    }

    console.log(product)
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

    initSizes(container);
    initColors(container);
    initQuantity(container);
    initAddToCart(container, productState.price);

}