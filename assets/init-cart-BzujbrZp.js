import{n as e}from"./chunk-Dv4lwO5Z.js";import"./supabase-BhA3ARm0.js";import"./auth-B6NOqR3_.js";import{a as t,i as n,o as r}from"./init-cart-icons-B1HDIqy3.js";import{n as i}from"./products-DgNcVXwQ.js";import{t as a}from"./handlebars-D9rcRd2d.js";import{t as o}from"./just-validate.es-CwbAVOgW.js";import{t as s}from"./show-toast-Bbzd08DT.js";import{c,l,s as u,t as d}from"./checkout-Budbq3so.js";var f=e(a(),1).default.compile(`<div \r
  class="cart-product" \r
  data-id="{{id}}"\r
  data-product-id="{{product_id}}"\r
  data-color="{{selected_color}}"\r
  data-size="{{selected_size}}"\r
>\r
  <div class="cart-product__image-wrapper">\r
    <img class="cart-product__image" src="{{imageUrl}}" alt="{{title}}" />\r
\r
    <div class="cart-product__info">\r
      <h4>{{title}}</h4>\r
\r
      <span \r
        class="cart-product__color {{selected_color}}" \r
        data-color="{{selected_color}}"\r
        data-action="change-color"\r
      ></span>\r
\r
    </div>\r
  </div>\r
\r
  <div class="cart-product__price">\r
    {{price}} EUR\r
  </div>\r
\r
  <div class="cart-product__size" data-action="change-size">\r
    {{#if sizeLabel}}\r
      {{sizeLabel}}\r
    {{else}}\r
      —\r
    {{/if}}\r
  </div> \r
  \r
\r
  <div class="cart-product__quantity">\r
    <button class="cart-product__quantity-btn-menus" data-action="decrease"></button>\r
      <span class="cart-product__quantity-span">{{quantity}}</span>\r
    <button class="cart-product__quantity-btn-plus" data-action="increase"></button>\r
  </div>\r
\r
  <div class="cart-product__total">\r
    {{total}} EUR\r
  </div>\r
\r
  <div class="cart-product__actions">\r
    <button class="cart-product__actions-btn like" data-action="like">\r
      <svg class="cart-product__actions-icon">\r
        <use href="#icon-crisp_cart_like"></use>\r
      </svg>\r
    </button>\r
    <button class="cart-product__actions-btn update" data-action="update">\r
      <svg class="cart-product__actions-icon">\r
        <use href="#icon-crisp_cart_update"></use>\r
      </svg>\r
    </button>\r
    <button class="cart-product__actions-btn remove" data-action="remove">\r
      <div class="cart-product__actions-icon-x">\r
      </div>\r
    </button>\r
  </div>\r
</div>`),p={Charcoal:`Charcoal`,Ivory:`Ivory`,"Navy Blue":`Navy-Blue`,"Deep Teal":`Deep-Teal`,"Warm Gray":`Warm-Gray`,"Muted Indigo":`Muted-Indigo`,"Cool Gray":`Cool-Gray`,Burgundy:`Burgundy`,Mustard:`Mustard`,Brown:`Brown`,"Dusty Rose":`Dusty-Rose`,Turquoise:`Turquoise`};function m(e){return{...e,total:e.price*e.quantity,imageUrl:e.image?`./img/main/products/${e.image}.webp`:`./img/main/products/crisp_product_dress-1.webp`,sizeLabel:e.selected_size?`W${e.selected_size}`:void 0,selected_color:p[e.selected_color]??e.selected_color}}function h(e,t){let n=t.map(m);if(n.length===0){e.innerHTML=`<p style="font-size:20px; color:red;">No items!</p>`;return}e.innerHTML=n.map(e=>f(e)).join(``)}var g=[],_={Charcoal:`Charcoal`,Ivory:`Ivory`,"Navy Blue":`Navy-Blue`,"Deep Teal":`Deep-Teal`,"Warm Gray":`Warm-Gray`,"Muted Indigo":`Muted-Indigo`,"Cool Gray":`Cool-Gray`,Burgundy:`Burgundy`,Mustard:`Mustard`,Brown:`Brown`,"Dusty Rose":`Dusty-Rose`,Turquoise:`Turquoise`};async function v(){let e=document.querySelector(`.cart__items`),a=document.querySelector(`[data-action="clear"]`);if(!e)return;let c=await t();g=c,h(e,c),E(),e.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-action]`);if(!t)return;let a=t.dataset.action,o=t.closest(`.cart-product`);if(!o)return;let c=o.dataset.id,l=g.find(e=>e.id===c)||g.find(e=>e.product_id===o.dataset.productId&&e.selected_color===o.dataset.color&&Number(e.selected_size)===Number(o.dataset.size));if(l){if((a===`increase`||a===`decrease`)&&(a===`increase`&&l.quantity++,a===`decrease`&&l.quantity>1&&l.quantity--,y(o,l)),a===`change-size`||a===`change-color`){let e=o.dataset.productId;if(!e)return;let t=await i(e);a===`change-size`&&b(o,t.sizes,l),a===`change-color`&&x(o,t.colors,l)}a===`remove`&&(await n({id:l.id,product_id:l.product_id,selected_color:l.selected_color||void 0,selected_size:l.selected_size||void 0}),g=g.filter(e=>e!==l),o.remove(),E()),a===`update`&&(await r({id:l.id,product_id:l.product_id,quantity:l.quantity,selected_color:l.selected_color||void 0,selected_size:l.selected_size||void 0}),s(`UPDATED`,`success`),E()),a===`like`&&(u(l.product_id),s(`Toggle Favourite`,`success`))}}),a?.addEventListener(`click`,async()=>{if(confirm(`Clear cart?`)){for(let e of g)await n({id:e.id,product_id:e.product_id,selected_color:e.selected_color||void 0,selected_size:e.selected_size||void 0});g=[],e.innerHTML=``,E()}}),w(document.querySelector(`.cart__accordion-content`));let l=document.querySelector(`.cart__form`);if(l){let e=new o(l,{errorFieldCssClass:`is-invalid`});e.addField(`[name="zip"]`,[{validator:e=>!e||e.trim()===``?!0:/^\d+$/.test(e),errorMessage:`ZIP must contain only numbers`}]),e.onSuccess(async e=>{if(e.preventDefault(),g.length===0){s(`Cart is empty`,`error`);return}let t=T(g),n=new FormData(l),r=l.querySelector(`[data-select="country"] .cart-select__selected`),i=l.querySelector(`[data-select="state"] .cart-select__selected`),a=n.get(`zip`),o=n.get(`shipping`)||void 0,c=document.querySelector(`input[name="discountCode"]`)?.value||void 0,u=r?.dataset.value||r?.textContent||``,f=i?.dataset.value||i?.textContent||``,p={cart:g,totals:t,shipping:{country:u,state:f,zip:Number(a)},shippingMethod:o,discountCode:c};console.log(p);try{let e=await d(p);if(e.error){s(`Checkout error at ${e.error.stage}: ${e.error.message}`,`error`);return}let{order:t}=e;s(`Order #${t.id} created successfully!`,`success`),setTimeout(()=>{window.location.href=`./checkout?id=${t.id}`},500)}catch(e){s(`Unexpected error: ${e.message}`,`error`)}})}let f=document.querySelector(`.cart__accordion`),p=document.querySelector(`.cart__accordion-content`),m=document.querySelector(`.cart__accordion-btn`);f&&p&&m&&f.addEventListener(`click`,()=>{p.classList.toggle(`active`),m.classList.toggle(`active`)})}function y(e,t){let n=e.querySelector(`.cart-product__quantity-span`),r=e.querySelector(`.cart-product__total`);n&&(n.textContent=String(t.quantity)),r&&(r.textContent=`${(t.price*t.quantity).toFixed(2)} EUR`)}function b(e,t,n){let r=e.querySelector(`.cart-product__size`);if(!r)return;let i=r.querySelector(`.size-dropdown`);if(i){i.remove();return}let a=document.createElement(`div`);a.className=`size-dropdown`,a.innerHTML=t.map(e=>`
        <div 
          class="size-option ${e===n.selected_size?`active`:``}"
          data-size="${e}"
        >
          W${e}
        </div>
      `).join(``),r.appendChild(a),a.addEventListener(`click`,t=>{let i=t.target.dataset.size;i&&(n.selected_size=Number(i),e.dataset.size=i,r.textContent=`W${i}`,S(n),a.remove())}),document.addEventListener(`click`,e=>{r.contains(e.target)||a.remove()},{once:!0})}function x(e,t,n){let r=e.querySelector(`.cart-product__color`);if(!r)return;let i=r.querySelector(`.color-dropdown`);if(i){i.remove();return}let a=document.createElement(`div`);a.className=`color-dropdown`,a.innerHTML=t.map(e=>`
        <span 
          class="color-option ${_[e]} ${e===n.selected_color?`active`:``}"
          data-color="${e}"
        ></span>
      `).join(``),r.appendChild(a),a.addEventListener(`click`,t=>{let i=t.target.dataset.color;i&&(n.selected_color=i,e.dataset.color=i,r.className=`cart-product__color ${_[i]}`,S(n),a.remove())}),document.addEventListener(`click`,e=>{r.contains(e.target)||a.remove()},{once:!0})}async function S(e){let t=g.find(t=>t!==e&&t.product_id===e.product_id&&t.selected_color===e.selected_color&&t.selected_size===e.selected_size);t&&(t.quantity+=e.quantity,y(document.querySelector(`.cart-product[data-id="${t.id}"]`),t),g=g.filter(t=>t!==e),await r({id:t.id,product_id:t.product_id,quantity:t.quantity,selected_color:t.selected_color||void 0,selected_size:t.selected_size||void 0}),await n({id:e.id,product_id:e.product_id,selected_color:e.selected_color||void 0,selected_size:e.selected_size||void 0}),document.querySelector(`.cart-product[data-id="${e.id}"]`)?.remove(),E(),s(`Items merged`,`success`))}function C(e,t,n,r){let i=e.querySelector(`.cart-select__selected`),a=e.querySelector(`.cart-select__dropdown`);if(a.innerHTML=t.map(e=>`
      <div class="cart-select__option" data-value="${e.value}">
        ${e.label}
      </div>
    `).join(``),r){let e=t.find(e=>e.value===r);e&&(i.textContent=e.label)}i.addEventListener(`click`,()=>{e.classList.toggle(`open`)}),a.addEventListener(`click`,t=>{let r=t.target.closest(`.cart-select__option`);if(!r)return;let a=r.dataset.value;i.textContent=r.textContent,e.classList.remove(`open`),n(a)})}function w(e){let t=e.querySelector(`[data-select="country"]`),n=e.querySelector(`[data-select="state"]`);if(!t||!n)return;let r=l.getAllCountries(),i=`US`;C(t,r.map(e=>({label:e.name,value:e.isoCode})),e=>{i=e,a(e)},`US`);function a(e){let t=c.getStatesOfCountry(e);C(n,t.map(e=>({label:e.name,value:e.isoCode})),()=>{},t[0]?.isoCode)}a(i)}function T(e){let t=e.reduce((e,t)=>e+t.price*t.quantity,0),n=t*.03;return{subtotal:t,tax:n,total:t+n}}function E(){let e=document.querySelector(`.cart__subtotal span:last-child`),t=document.querySelector(`.cart__tax span:last-child`),n=document.querySelector(`.cart__total span:last-child`),{subtotal:r,tax:i,total:a}=T(g);e&&(e.textContent=`${r.toFixed(2)} EUR`),t&&(t.textContent=`${i.toFixed(2)} EUR`),n&&(n.textContent=`${a.toFixed(2)} EUR`)}export{v as initCart};