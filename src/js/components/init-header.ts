import { getCurrentUser } from "../services/auth";
import { updateCartIcon } from "./init-cart-icons";
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

export async function initHeader() {
  const header = document.querySelector("header") as HTMLElement;
  if (!header) return;

  const currentPage = document.body.dataset.page;
  
  if (!currentPage) return;
  
  const activeLink = header.querySelector(`.header__nav-link[data-page="${currentPage}"]`);
  const activeMenuLink = document.querySelector(`.header-menu__nav-link[data-page="${currentPage}"]`);
  //   const allLinks = header.querySelectorAll(".header__nav-link");
  //   allLinks.forEach(link => link.classList.remove("active"));

  if (activeLink || activeMenuLink) {
    activeLink?.classList.add("active");
    activeMenuLink?.classList.add("active");
  }

  const headerWrapper = document.querySelector(".header__wrapper") as HTMLElement;
  const headerBurgerOpen = document.querySelector(".header__burger-open") as HTMLElement;
  const headerBurgerClose = document.querySelector(".header__burger-close") as HTMLElement;
  const headerMenu = document.querySelector(".header-menu__wrapper") as HTMLElement;
  const headerCart = header.querySelector(".header__cart") as HTMLElement;
  const headerMenuCart = document.querySelector(".header-menu__cart") as HTMLElement;

  headerCart.addEventListener("click", ()=> {
    window.location.href = "./cart.html"
  })

  headerMenuCart.addEventListener("click", ()=> {
    window.location.href = "./cart.html"
  })


  headerBurgerOpen.addEventListener("click", ()=> {
    headerWrapper.classList.add("hidden");
    disablePageScroll();
    setTimeout(()=> {
      headerMenu.classList.add("active");
    },300)

  })

  headerBurgerClose.addEventListener("click", ()=> {
    headerWrapper.classList.remove("hidden");
      setTimeout(()=> {
      headerMenu.classList.remove("active");
    },300)
  })

  window.addEventListener("resize", ()=> {
    headerWrapper.classList.remove("hidden");
    enablePageScroll();
      setTimeout(()=> {
      headerMenu.classList.remove("active");
    },300)
  })

  const user = await getCurrentUser();
  const updateAuthLinks = (container: HTMLElement) => {
    const signIn = container.querySelector('[href="./login.html"]');
    const signUp = container.querySelector('[href="./register.html"]');
    const profile = container.querySelector('.profile');

    if (user) {
      signIn?.classList.add("hidden");
      signUp?.classList.add("hidden");
      profile?.classList.add("active");
    } else {
      signIn?.classList.remove("hidden");
      signUp?.classList.remove("hidden");
      profile?.classList.remove("active");
    }
  };

  const desktopAuth = header.querySelector(".header__auth") as HTMLElement;
  const mobileAuth = headerMenu?.querySelector(".header-menu__auth") as HTMLElement;
  
  if (desktopAuth) updateAuthLinks(desktopAuth);
  if (mobileAuth) updateAuthLinks(mobileAuth);
  
  updateCartIcon();


}