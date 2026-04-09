import { getUserOrders } from "../../services/profile";

export async function initProfileOrders() {
  const container = document.getElementById("profile-orders-list");
  if (!container) return;

  try {
    const orders = await getUserOrders();

    if (!orders.length) {
      container.innerHTML = `<p>No orders yet</p>`;
      return;
    }

    container.innerHTML = orders
      .map((order) => {
        const status = order.status || "pending";

        return `
          <div class="profile-orders__item">
            <a href="./checkout.html?id=${order.id}" class="profile-orders__id">
              #${order.id}
            </a>

            <span class="profile-orders__status profile-orders__status--${status}">
              ${status}
            </span>
          </div>
        `;
      })
      .join("");

  } catch (err) {
    console.error("Orders load error:", err);
    container.innerHTML = `<p>Failed to load orders</p>`;
  }
}