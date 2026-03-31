import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import { getFeaturedItems } from "../../services/products";
import { renderProductsCardCatalogue } from "../main/render-main-products-catalogue";

function initSwiper() {
  new Swiper(".product-featured__slider", {
    modules: [Navigation, Autoplay],

    slidesPerView: 5,
    spaceBetween: 26,

    loop: true,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    navigation: {
      nextEl: ".product-featured-next",
      prevEl: ".product-featured-prev",
    },

    breakpoints: {
      0: { slidesPerView: 1 },
      480: { slidesPerView: 2 },
      1024: { slidesPerView: 5 },
    },
  });
}

export  async function initProductFeatured() {
    const container = document.querySelector(".product-featured__items") as HTMLElement;
    if (!container) return;

    const featuredItems = await getFeaturedItems();
    renderProductsCardCatalogue(featuredItems, container, {append: false, asSwiper: true} )

    initSwiper();
}