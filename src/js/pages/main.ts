
import { initMainFeatured } from "./main/init-main-featured";
import { initMainHero } from "./main/init-main-hero";
import { initMainPopular } from "./main/init-main-popular";
import { initMainProducts } from "./main/init-main-products";

export async function initMain(): Promise<void> {
    initMainHero();
    initMainProducts();
    initMainFeatured();
    initMainPopular();
}