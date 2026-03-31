export function initHeader() {
  const header = document.querySelector("header") as HTMLElement;
  if (!header) return;

  const currentPage = document.body.dataset.page;
  
  if (!currentPage) return;
  
  const activeLink = header.querySelector(`.header__nav-link[data-page="${currentPage}"]`);
  
//   const allLinks = header.querySelectorAll(".header__nav-link");
//   allLinks.forEach(link => link.classList.remove("active"));

  if (activeLink) {
    activeLink.classList.add("active");
  }
}