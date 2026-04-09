import Handlebars from "handlebars";
import templateRaw from "@html/pages/profile/profile-dashboard.hbs?raw";

import { getUserProfile, getShippingAddress } from "../../services/profile";
import { getCurrentUser } from "../../services/auth";
import { getSubscriber } from "../../services/subscriptions";

const template = Handlebars.compile(templateRaw);

export async function initProfileDashboard() {
  const container = document.querySelector(
    ".profile-dashboard"
  ) as HTMLElement;

  if (!container) return;

  try {
    const [user, profile, address, subscriber] = await Promise.all([
      getCurrentUser(),
      getUserProfile(),
      getShippingAddress(),
      getSubscriber(),
    ]);
    console.log(user, profile, address, subscriber)
    const view = {
      fullName: profile
        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
        : "—",

      email: user?.email || "—",

      isSubscribed: subscriber?.is_subscribed ?? false,

      hasAddress: !!address,

      addressLine: address
        ? `${address.country}, ${address.state}${
            address.city ? ", " + address.city : ""
          }`
        : null,
    };

    container.innerHTML = template(view);
  } catch (err) {
    container.innerHTML = "<p>Error loading dashboard</p>";
    console.error(err);
  }
}