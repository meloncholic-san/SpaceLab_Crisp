
import { initProfileAccount } from "./profile/init-account-page";
import { initProfileAddress } from "./profile/init-profile-address";
import { initProfileDashboard } from "./profile/init-profile-dashboard";
import { initProfileFavourites } from "./profile/init-profile-favourites";
import { initProfileOrders } from "./profile/init-profile-order";
import { initProfileSidebar } from "./profile/init-profile-sidebar";

export function initProfile () {
    initProfileSidebar();
    initProfileAccount();
    initProfileAddress();
    initProfileOrders();
    initProfileFavourites();
    initProfileDashboard();
}
