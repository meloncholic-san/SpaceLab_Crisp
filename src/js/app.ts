import '@scss/styles.scss';
import { initHeader } from './components/init-header';
import { initFooter } from './components/init-footer';






// import { initLazyImages } from './components/init-lazyimages.js';
// import { useLoadFunction } from 'lazy-viewport-loader';


document.addEventListener('DOMContentLoaded', async () => {

  const page = document.body.dataset.page;
  initHeader();
  initFooter();

  if (page === 'main') {
    const { initMain } = await import('./pages/main');
    initMain();   
  }
  if (page === 'products') {
    const { initProducts } = await import ('./pages/products');
    initProducts();
  }

  if (page === 'product') {
    const { initProductPage } = await import('./pages/product');
    initProductPage();
  }
  if (page === 'article') {
    const { initArticlePage } = await import('./pages/article');
    initArticlePage();
  }

  if (page === 'register') {
    const { initRegister } = await import('./pages/auth/init-register');
    initRegister();
  }

  if (page === 'login') {
    const { initLogin } = await import('./pages/auth/init-login');
    initLogin();
  }

  if (page === 'cart') {
    const { initCart } = await import('./pages/cart/init-cart');
    initCart();
  }

  if (page === 'checkout') {
    const { initCheckout } = await import('./pages/checkout/init-checkout');
    initCheckout();
  }

  if (page === 'profile') {
    const { initProfile } = await import('./pages/profile');
    initProfile();
  }

});