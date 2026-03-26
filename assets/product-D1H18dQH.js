import{i as e,n as t,r as n,s as r,t as i}from"./render-main-products-catalogue-BMZSfGfu.js";import{i as a,n as o,t as s}from"./autoplay--GYZKAZc.js";function c(){new a(`.product-featured__slider`,{modules:[o,s],slidesPerView:5,spaceBetween:30,loop:!0,autoplay:{delay:5e3,disableOnInteraction:!1},navigation:{nextEl:`.product-featured-next`,prevEl:`.product-featured-prev`},breakpoints:{0:{slidesPerView:1},480:{slidesPerView:2},1024:{slidesPerView:5}}})}async function l(){let e=document.querySelector(`.product-featured__items`);e&&(i(await n(),e,{append:!1,asSwiper:!0}),c())}var u=r(t(),1).default.compile(`<article \r
  class="product"\r
  data-id="{{id}}"\r
  data-code="{{product_code}}"\r
  data-price="{{price}}"\r
  data-brand="{{brand}}"\r
  data-tags="{{#if tags}}{{tags}}{{/if}}"\r
  data-colors="{{#if colors}}{{colors}}{{/if}}"\r
  data-sizes="{{#if sizes}}{{sizes}}{{/if}}"\r
>\r
\r
  <div class="product__wrapper">\r
\r
    <!-- GALLERY -->\r
    <div class="product__gallery">\r
      \r
      <div class="product__thumbnails">\r
        {{#each image}}\r
          <img \r
            class="product__thumbnail"\r
            src="./img/main/products/{{this}}.webp"\r
            data-src="./img/main/products/{{this}}.webp"\r
            alt="thumbnail"\r
          />\r
        {{/each}}\r
      </div>\r
\r
      <div class="product__main-image-wrapper">\r
        <img \r
          class="product__main-image"\r
          src="{{#if image}}./img/main/products/{{image.[0]}}.webp{{/if}}" \r
          alt="{{title}}"\r
        />\r
        <div class="product__zoom-lens"></div>\r
        <div class="product__zoom-label"><img src="./img/products/hero/crisp-zoom.jpg" alt=""></div>\r
      </div>\r
      <div class="product__share">\r
        <p class="product__share-phrase">Share:</p>\r
        <ul class="product__share-list">\r
          <li class="product__share-item">\r
            <svg class="product__share-icon">\r
              <use href="#icon-crisp_facebook"></use>\r
            </svg>\r
          </li>\r
          <li class="product__share-item">\r
            <svg class="product__share-icon">\r
              <use href="#icon-crisp_twitter"></use>\r
            </svg>\r
          </li>\r
          <li class="product__share-item">\r
            <svg class="product__share-icon">\r
              <use href="#icon-crisp_pinterest"></use>\r
            </svg>\r
          </li>\r
          <li class="product__share-item">\r
            <svg class="product__share-icon">\r
              <use href="#icon-crisp_instagram"></use>\r
            </svg>\r
          </li>\r
        </ul>\r
      </div>\r
    </div>\r
\r
    <!-- INFO -->\r
    <div class="product__info">\r
\r
      <p class="product__breadcrumbs">\r
        Home / Womens Dress / {{title}}\r
      </p>\r
\r
      {{#if brand}}\r
        <p class="product__brand">{{brand}}</p>\r
      {{/if}}\r
\r
      <h1 class="product__title">{{title}}</h1>\r
\r
\r
      <!-- COLORS -->\r
      {{#if colors}}\r
        <div class="product__colors">\r
          <p class="product__label">SELECT COLOR</p>\r
          <div class="product__colors-list">\r
            {{#each colors}}\r
              <span class="product__color {{this}}"></span>\r
            {{/each}}\r
          </div>\r
        </div>\r
      {{/if}}\r
\r
      <!-- SIZES -->\r
      {{#if sizes}}\r
        <div class="product__sizes">\r
\r
          <div class="product__sizes-header">\r
            <p class="product__label">SELECT SIZE (INCHES)</p>\r
            <a href="https://thoughtsocks.com/pages/size-guide-mens"  rel="noopener" rel="noreferrer" class="product__sizes-link">Size guide</a>\r
          </div>\r
\r
          <div class="product__sizes-list" data-sizes="{{sizes}}">\r
            {{#each allSizes}}\r
              <span \r
                class="product__size \r
                  {{#if available}}available{{else}}disabled{{/if}}"\r
                data-size="{{value}}"\r
              >\r
                {{label}}\r
              </span>\r
            {{/each}}\r
          </div>\r
        </div>\r
      {{/if}}\r
\r
      <!-- PRICE -->\r
      <div class="product__pricing">\r
        <div class="product__pricing-quantity">\r
          <p class="product__pricing-quantity-phrase product__label">QUANTITY</p>\r
          <div class="product__pricing-quantity-actions">\r
            <button class="product__pricing-quantity-btn-menus"></button>\r
            <span class="product__pricing-quantity-span">1</span>\r
            <button class="product__pricing-quantity-btn-plus"></button>\r
          </div>\r
        </div>\r
\r
        <div class="product__price">\r
            <p class="product__label">PRICE TOTAL</p>\r
            <div class="product__price-wrapper">\r
              {{#if discount_percent}}\r
                <span class="product__price--new" data-price="{{price}}">{{price}} EUR</span>\r
                <span class="product__price--old">{{oldPrice}} EUR</span>\r
                {{!-- <span class="product__discount">-{{discount_percent}}%</span> --}}\r
              {{else}}\r
                <span class="product__price--regular" data-price="{{price}}">{{price}} EUR</span>\r
              {{/if}}\r
            </div>\r
\r
        </div>\r
      </div>\r
\r
      <!-- ACTIONS -->\r
      <div class="product__actions">\r
        <button class="product__add-to-cart">ADD TO BAG</button>\r
        <button class="product__wishlist"><svg><use href="#icon-crisp_heart-outline"></use></svg> SAVE</button>\r
      </div>\r
\r
      <!-- Tags -->\r
        <div class="product__tags">\r
          <div class="product__tags-content">\r
            <h4 class="product__tags-head arrow"></h4>\r
            <p class="product__tags-phrase">FREE SHIPPING</p>\r
          </div>\r
          <div class="product__tags-content">\r
            <h4 class="product__tags-head">PRODUCT CODE:</h4>\r
            <p class="product__tags-phrase">{{product_code}}</p>\r
          </div>\r
          <div class="product__tags-content">\r
            <h4 class="product__tags-head">TAGS:</h4>\r
            <p class="product__tags-phrase">{{category}}</p>\r
          </div>\r
        </div>\r
\r
    </div>\r
\r
  </div>\r
\r
</article>`),d=[0,26,27,28,29,30,31,32,33,34,35,36,38,40,42,44,48,50,52],f={best:`BEST SELLERS`,new:`NEW ARRIVALS`,top:`TOP WOMAN`,summer:`COLLECTION: SUMMER`,spring:`COLLECTION: SPRING`,trending:`TRENDING`},p=e=>e===0?`OSFA`:`W`+e;function m(e,t){if(!e){t.innerHTML=`<p>Product not found</p>`;return}let n={...e};n.discount_percent&&(n.oldPrice=n.price,n.price=Number((n.price*(1-n.discount_percent/100)).toFixed(2))),n.tags?.length&&(n.category=n.tags.map(e=>f[e]).filter(e=>!!e).join(`, `));let r={Charcoal:`Charcoal`,Ivory:`Ivory`,"Navy Blue":`Navy-Blue`,"Deep Teal":`Deep-Teal`,"Warm Gray":`Warm-Gray`,"Muted Indigo":`Muted-Indigo`,"Cool Gray":`Cool-Gray`,Burgundy:`Burgundy`,Mustard:`Mustard`,Brown:`Brown`,"Dusty Rose":`Dusty-Rose`,Turquoise:`Turquoise`};n.colors=n.colors?.map(e=>r[e]??e);let i=n.sizes||[];n.isOSFA=i.length===1&&i[0]===0,n.allSizes=d.map(e=>({value:e,label:p(e),available:i.includes(e)})),n.image?.length||(n.image=[`crisp_product_dress-1`]),t.innerHTML=u(n)}function h(e){let t=e.querySelector(`.product__main-image`),n=e.querySelectorAll(`.product__thumbnail`);!t||!n.length||n.forEach(e=>{e.addEventListener(`click`,()=>{let r=e.getAttribute(`data-src`);r&&(t.src=r,n.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`))})})}function g(e){e&&e.querySelectorAll(`.product-main__accordion-item`).forEach(e=>{let t=e.querySelector(`.product-main__accordion-header`),n=e.querySelector(`.product-main__accordion-opener`);t&&t.addEventListener(`click`,()=>{let t=e.classList.contains(`active`);e.classList.toggle(`active`),n&&n.classList.toggle(`active`,!t)})})}function _(e){let t=e.querySelector(`.product__main-image`),n=e.querySelector(`.product__zoom-lens`);!t||!n||e.addEventListener(`mousemove`,r=>{let i=e.getBoundingClientRect(),a=r.clientX-i.left,o=r.clientY-i.top,s=n.offsetWidth,c=n.offsetHeight,l=a-s/2,u=o-c/2;l<0&&(l=0),u<0&&(u=0),l>i.width-s&&(l=i.width-s),u>i.height-c&&(u=i.height-c),n.style.left=`${l}px`,n.style.top=`${u}px`,n.style.backgroundImage=`url(${t.src})`,n.style.backgroundPosition=`-${l}px -${u}px`,n.style.backgroundSize=`${t.width}px ${t.height}px`})}async function v(){let t=document.querySelector(`.product-main-content`),n=new URLSearchParams(window.location.search).get(`id`);if(!n)return;try{m(await e(n),t)}catch{t.innerHTML=`<p>Error loading product</p>`}let r=document.querySelector(`.product__gallery`),i=document.querySelector(`.product-main__accordion`),a=t.querySelector(`.product__thumbnail`),o=document.querySelector(`.product__main-image-wrapper`);a?.classList.add(`active`),h(r),g(i),o&&_(o)}async function y(){v(),l()}export{y as initProductPage};