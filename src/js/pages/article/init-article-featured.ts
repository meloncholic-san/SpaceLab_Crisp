import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import { getFeaturedItems } from "../../services/products";
import { renderProductsCardCatalogue } from "../main/render-main-products-catalogue";

function initSwiper() {
  new Swiper(".article-featured__slider", {
    modules: [Navigation, Autoplay],

    slidesPerView: 5,
    spaceBetween: 30,

    loop: true,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    navigation: {
      nextEl: ".article-featured-next",
      prevEl: ".article-featured-prev",
    },

    breakpoints: {
      0: { slidesPerView: 1 },
      480: { slidesPerView: 2 },
      1024: { slidesPerView: 5 },
    },
  });
}

export  async function initArticleFeatured() {
    const container = document.querySelector(".article-featured__items") as HTMLElement;
    if (!container) return;

    const featuredItems = await getFeaturedItems();
    renderProductsCardCatalogue(featuredItems, container, {append: false, asSwiper: true} )

    initSwiper();
}