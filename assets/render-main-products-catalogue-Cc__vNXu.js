import{n as e}from"./chunk-Dv4lwO5Z.js";import{t}from"./handlebars-D9rcRd2d.js";var n=`<article \r
  class="product-card"\r
  data-id="{{id}}"\r
  data-code="{{product_code}}"\r
  data-price="{{price}}"\r
  data-brand="{{brand}}"\r
  data-tags="{{#if tags}}{{tags}}{{/if}}"\r
  data-colors="{{#if colors}}{{colors}}{{/if}}"\r
  data-sizes="{{#if sizes}}{{sizes}}{{/if}}"\r
>\r
  <div class="product-card__wrapper">\r
\r
\r
      {{#if discount_percent}}\r
        <span class="product-card__sale">-{{discount_percent}}%</span>\r
      {{/if}}\r
      <a href="./product?id={{id}}" class="product-card__link">\r
        <div class="product-card__image-wrapper">\r
          <img\r
            class="product-card__image"\r
            src="{{#if image}}./img/main/products/{{image.[0]}}.webp{{else}}./img/main/products/crisp_product_dress-1.webp{{/if}}"\r
            alt="{{title}}"\r
            loading="lazy"\r
          />\r
        </div>\r
      </a>\r
      <div class="product-card__content">\r
        {{#if category}}\r
          <p class="product-card__category">\r
            {{category}}\r
          </p>\r
        {{/if}}\r
\r
        <h3 class="product-card__title">{{title}}</h3>\r
\r
        {{#if showBrand}}\r
          {{#if brand}}\r
            <p class="product-card__brand">{{brand}}</p>\r
          {{/if}}\r
        {{/if}}\r
\r
\r
        <div class="product-card__price">\r
          {{#if discount_percent}}\r
            <span class="product-card__price--new">{{price}} EUR</span>\r
            <span class="product-card__price--old">{{oldPrice}} EUR</span>\r
          {{else}}\r
            <span class="product-card__price--regular">{{price}} EUR</span>\r
          {{/if}}\r
        </div>\r
\r
        {{#if showColors}}\r
          {{#if colors}}\r
            <div class="product-card__colors">\r
              {{#each colors}}\r
                <span \r
                  class="product-card__color {{this}}"\r
                ></span>\r
              {{/each}}\r
            </div>\r
          {{/if}}\r
        {{/if}}\r
\r
      </div>\r
\r
  </div>\r
</article>`,r=`<div class="products-banner">\r
    <div class="products-banner__wrapper">\r
        <div class="products-banner__img-wrapper">\r
            <div class="products-banner__img-gradient">\r
\r
            </div>\r
            <img class="products-banner__img" src="./img/products/banner/products-banner.webp" />\r
        </div>\r
        <div class="products-banner__content">\r
            <h2 class="products-banner__headline">Shoping without limits.</h2>\r
            <p class="products-banner__phrase">You can choose the best option for you, and it does not matter whether you are in Prague or San Francisco. We will deliver your purchase anywhere!</p>\r
\r
            {{> components/order-btn \r
            order-btn-class="products-banner__order-btn" \r
            order-btn-linkTo="shop" \r
            order-btn-text="SHOP NOW"\r
            }}\r
        </div>\r
    </div>\r
</div>`,i=`<a class="order-btn {{order-btn-class}}" type="button" href="./{{order-btn-linkTo}}.html" >{{order-btn-text}}</a>`,a=e(t(),1);a.default.registerPartial(`components/order-btn`,i);var o=a.default.compile(n),s=a.default.compile(r),c={best:`BEST SELLERS`,new:`NEW ARRIVALS`,top:`TOP WOMAN`,summer:`COLLECTION: SUMMER`,spring:`COLLECTION: SPRING`,trending:`TRENDING`};function l(e,t,{append:n=!1,showColors:r=!1,showBrand:i=!1,filter:a=null,asSwiper:l=!1,insertBanner:u=void 0}={}){console.log(e);let d=e.map(e=>{let t={...e};t.discount_percent&&(t.oldPrice=t.price,t.price=Number((t.price*(1-t.discount_percent/100)).toFixed(2))),t.tags?.length&&(a?t.category=c[a]??a:t.category=t.tags.map(e=>c[e]).filter(e=>!!e).join(`, `));let n={Charcoal:`Charcoal`,Ivory:`Ivory`,"Navy Blue":`Navy-Blue`,"Deep Teal":`Deep-Teal`,"Warm Gray":`Warm-Gray`,"Muted Indigo":`Muted-Indigo`,"Cool Gray":`Cool-Gray`,Burgundy:`Burgundy`,Mustard:`Mustard`,Brown:`Brown`,"Dusty Rose":`Dusty-Rose`,Turquoise:`Turquoise`};return t.colors=t.colors?.map(e=>n[e]??e),t.showColors=r,t.showBrand=i,t});if(d.length===0){t.innerHTML=`<p style="font-size:20px; color:red;">No items!</p>`;return}let f=d.map((e,t)=>{let n=l?`<div class="swiper-slide">${o(e)}</div>`:o(e);return u!==void 0&&t===u&&(n+=`<div class="products-catalogue__banner">${s({})}</div>`),n}).join(``);l?t.innerHTML=f:n?t.insertAdjacentHTML(`beforeend`,f):t.innerHTML=f}export{l as t};