import '@scss/styles.scss';


// import { initLazyImages } from './components/init-lazyimages.js';
// import { useLoadFunction } from 'lazy-viewport-loader';


document.addEventListener('DOMContentLoaded', async () => {

  const page = document.body.dataset.page;
  
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


});