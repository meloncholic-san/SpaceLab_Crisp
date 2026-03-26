import { initProductFeatured } from "./product/init-product-featured";
import { initProductMain } from "./product/init-product-main";

export async function initProductPage() {
    initProductMain();
    initProductFeatured();
}