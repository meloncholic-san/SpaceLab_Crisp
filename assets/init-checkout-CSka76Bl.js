import{n as e}from"./chunk-Dv4lwO5Z.js";import"./supabase-BhA3ARm0.js";import{t}from"./auth-B6NOqR3_.js";import{a as n,r}from"./init-cart-icons-B1HDIqy3.js";import{t as i}from"./handlebars-D9rcRd2d.js";import{t as a}from"./just-validate.es-CwbAVOgW.js";import{a as o,c as s,i as c,l,n as u,o as d,r as f,t as p}from"./checkout-Budbq3so.js";var m=e(i(),1),h=`<section class="checkout">\r
  <p class="checkout__breadcrumbs">Home / Create Order</p>\r
\r
  <div class="checkout__steps">\r
    <div class="checkout__step active">\r
      <div class="checkout__step-inner">\r
          <div class="checkout__step-line"></div>\r
          <div class="checkout__step-number first"><p></p></div>\r
      </div>\r
      <p class="checkout__step-phrase">Shipping</p>\r
    </div>\r
\r
    <div class="checkout__step">\r
      <div class="checkout__step-inner">\r
          <div class="checkout__step-line"></div>\r
          <div class="checkout__step-number"><p>2</p></div>\r
      </div>\r
      <p class="checkout__step-phrase">Review & Payments</p>\r
    </div>\r
  </div>\r
\r
\r
  <div class="checkout__wrapper">\r
\r
    <div class="checkout__content first">\r
      <div class="checkout__form-wrapper">\r
\r
        <h2 class="checkout__login-title">Shipping Address</h2>\r
\r
        <form class="checkout__login" id="checkout__login">\r
\r
          <div class="checkout__field">\r
            <label>Email <span>*</span></label>\r
            <input type="email" name="email" required />\r
          </div>\r
\r
          <div class="checkout__field">\r
            <label>Password</label>\r
            <input type="password" name="password" />\r
          </div>\r
\r
          <p class="checkout__login-phrase">You already have an account with us. Sign in or continue as guest.</p>\r
\r
          <div class="checkout__login-inner">\r
            <button type="button" class="checkout__login-btn">LOGIN</button>\r
            <a class="checkout__login-forgot" href="">Forgot Your Password</a>\r
          </div>\r
\r
        </form>\r
\r
        <form class="checkout__shipping" id="checkout__shipping">\r
\r
          <div class="checkout__field">\r
            <label>First Name <span>*</span></label>\r
            <input type="text" name="firstName" required />\r
          </div>\r
\r
          <div class="checkout__field">\r
            <label>Last Name <span>*</span></label>\r
            <input type="text" name="lastName" required />\r
          </div>\r
\r
          <div class="checkout__field">\r
            <label>Street Address <span>*</span></label>\r
            <input type="text" name="street" required />\r
          </div>\r
\r
          <div class="checkout__field">\r
            <label>Zip/Postal Code</label>\r
            <input type="text" name="zip" />\r
          </div>\r
\r
\r
          <div class="checkout__field">\r
            <label>Country <span>*</span></label>\r
            <div class="cart-select checkout-select" data-select="country">\r
              <div class="cart-select__selected">United States</div>\r
              <div class="cart-select__dropdown"></div>\r
            </div>\r
          </div>\r
\r
          <div class="checkout__field">\r
            <label>State/Province <span>*</span></label>\r
            <div class="cart-select checkout-select" data-select="state">\r
              <div class="cart-select__selected">Select state</div>\r
              <div class="cart-select__dropdown"></div>\r
            </div>\r
          </div>\r
\r
          <div class="checkout__radios">\r
            <h3>Shipping Methods</h3>\r
            <div class="checkout__radios-inner">\r
              <label class="checkout__shipping-method">\r
                <input type="radio" name="shipping" value="flat" class="checkout__shipping-method__radio" checked>\r
                <span class="checkout__shipping-method__custom"></span>\r
                <div class="checkout__shipping-method__content">\r
                  <span class="checkout__shipping-method__price">$5.00</span>\r
                  <span class="checkout__shipping-method__title">Fixed</span>\r
                  <span class="checkout__shipping-method__desc">Flat Rate</span>\r
                </div>\r
              </label>\r
\r
              <label class="checkout__shipping-method">\r
                <input type="radio" name="shipping" value="best" class="checkout__shipping-method__radio">\r
                <span class="checkout__shipping-method__custom"></span>\r
                <div class="checkout__shipping-method__content">\r
                  <span class="checkout__shipping-method__price">$10.00</span>\r
                  <span class="checkout__shipping-method__title">Table Rate</span>\r
                  <span class="checkout__shipping-method__desc">Best Way</span>\r
                </div>\r
              </label>\r
            </div>\r
          </div>\r
          \r
          <div class="checkout__shipping-actions">\r
            <button type="submit" class="checkout__shipping-next">\r
              NEXT\r
            </button>\r
            <a class="checkout__shipping-back" href="./cart.html">BACK</a>\r
          </div>\r
\r
\r
        </form>\r
\r
      </div>\r
    </div>\r
\r
    <div class="checkout__content hidden second">\r
      <h2 class="checkout__content-title">Payment Method:</h2>\r
      <p class="checkout__content-phrase">Check / Money order</p>\r
      \r
      <div class="checkout__content-checkbox-wrapper">\r
        <label class="checkout__custom-checkbox">\r
          <input type="checkbox" class="checkout__custom-checkbox__input" checked>\r
          <span class="checkout__custom-checkbox__custom"></span>\r
          <span class="checkout__custom-checkbox__label">My billing and shipping address are the same</span>\r
        </label>\r
      </div>\r
      \r
      <div class="checkout__payment">\r
        <p class="checkout__payment-phrase">\r
          <span class="firstname">{{firstName}}</span>\r
          <span class="lastname">{{lastName}}</span>\r
        </p>\r
        <p class="checkout__payment-phrase">\r
          <span class="street"></span>\r
        </p>\r
        <p class="checkout__payment-phrase">\r
          <span class="region"></span>\r
          <span class="zip"></span>\r
        </p>\r
        <p class="checkout__payment-phrase">\r
          <span class="country"></span>\r
        </p>\r
      </div>\r
\r
      <div class="checkout__payment-actions">\r
        <button type="submit" class="checkout__payment-order">PLACE ORDER</button>\r
        <button class="checkout__payment-back">BACK</button>\r
      </div>\r
\r
      <div class="checkout__payment-discount">\r
        <h3>Apply Discount Code</h3>\r
        <input name="discountCode" placeholder="Enter discount code" />\r
        <button>Apply Discount</button>\r
      </div>\r
    </div>\r
\r
\r
    <div class="checkout__summary">\r
      <div class="checkout__summary-inner">\r
        <h3 class="checkout__summary-title">Order Summary</h3>\r
\r
        <div class="checkout__totals">\r
          <div class="checkout__subtotal">\r
            <span>Subtotal</span>\r
            <span>{{subtotal}} EUR</span>\r
          </div>\r
\r
          <div class="checkout__shipping-cost">\r
            <span>Shipping</span>\r
            <span id="shipping-cost">{{shippingCost}} EUR</span>\r
          </div>\r
\r
          <div class="checkout__shipping-method-name">\r
            <span></span>\r
            <span id="shipping-method-display">{{shippingMethodLabel}}</span>\r
          </div>\r
        </div>\r
\r
        <div class="checkout__pricing">\r
          <div class="checkout__total">\r
            <span>Order Total</span>\r
            <span id="order-total">{{total}} EUR</span>\r
          </div>\r
          <div class="checkout__cart-toggle">\r
            <p>{{itemCount}} item(s) in Cart!</p>\r
            <button class="checkout__toggle-items" type="button"></button>\r
          </div>\r
        </div>\r
\r
        <div class="checkout__items hidden">\r
          {{#each items}}\r
            {{> components/checkout-item this}}\r
          {{/each}}\r
        </div>\r
      </div>\r
\r
\r
      <div class="checkout__summary-stage">\r
        <div class="checkout__summary-stage-inner">\r
          <h2 class="checkout__content-title">Payment Method:</h2>\r
\r
          <div class="checkout__payment">\r
            <p class="checkout__payment-phrase">\r
              <span class="firstname">{{firstName}}</span>\r
              <span class="lastname">{{lastName}}</span>\r
            </p>\r
            <p class="checkout__payment-phrase">\r
              <span class="street"></span>\r
            </p>\r
            <p class="checkout__payment-phrase">\r
              <span class="region"></span>\r
              <span class="zip"></span>\r
            </p>\r
            <p class="checkout__payment-phrase">\r
              <span class="country"></span>\r
            </p>\r
\r
            <button class="checkout__summary-back"></button>\r
          </div>\r
\r
        </div>\r
\r
        <div class="checkout__summary-stage-inner">\r
          <p class="checkout__payment-phrase">{{shipmentMethod}}</p>\r
        </div>\r
\r
      </div>\r
\r
    </div>\r
\r
  </div>\r
</section>`;m.default.registerPartial(`components/checkout-item`,`<article class="checkout-item">\r
  <img class="checkout-item__image" src="{{imageUrl}}" alt="{{title}}" />\r
\r
  <div class="checkout-item__content">\r
    <div class="checkout-item__inner">\r
      <h4 class="checkout-item__title">{{title}}</h4>\r
      <p class="checkout-item__total">{{total}} EUR</p>\r
    </div>\r
\r
    <p class="checkout-item__quantity">QTY: <span>{{quantity}}</span></p>\r
    <div class="checkout-item__opener">View Details <span></span></div>\r
    <div class="checkout-item__details">\r
      {{#if selected_color}}\r
        <span class="checkout-item__color {{colorClass}}"></span>\r
      {{/if}}\r
\r
      {{#if sizeLabel}}\r
        <span>{{sizeLabel}}</span>\r
      {{/if}}\r
    </div>\r
\r
  </div>\r
\r
\r
</article>`);var g=m.default.compile(h),_=[],v=null;function y(e){return e.map(e=>({...e,total:e.price*e.quantity,imageUrl:e.image?`./img/main/products/${e.image}.webp`:`./img/main/products/crisp_product_dress-1.webp`,sizeLabel:e.selected_size?`W${e.selected_size}`:void 0,colorClass:e.selected_color?e.selected_color.replace(/\s+/g,`-`):void 0}))}function b(e){return e===`flat`?5:10}function x(e){return e===`flat`?`Flat Rate - Fixed`:`Best Way - Table Rate`}function S(){if(!v)return;let e=v.totals.subtotal,t=b(v.shippingMethod),n=v.totals.tax,r=e+t+n,i=document.querySelector(`.checkout__subtotal span:last-child`),a=document.getElementById(`shipping-cost`),o=document.querySelector(`.checkout__tax span:last-child`),s=document.getElementById(`order-total`),c=document.querySelector(`.checkout__cart-toggle p`),l=document.getElementById(`summary-shipping-method`);if(i&&(i.textContent=`${e.toFixed(2)} EUR`),a&&(a.textContent=`${t.toFixed(2)} EUR`),o&&(o.textContent=`${n.toFixed(2)} EUR`),s&&(s.textContent=`${r.toFixed(2)} EUR`),c){let e=_.reduce((e,t)=>e+t.quantity,0);c.textContent=`${e} item${e===1?``:`s`} in Cart!`}l&&(l.textContent=x(v.shippingMethod))}function C(){document.querySelectorAll(`.checkout-item`).forEach(e=>{let t=e.querySelector(`.checkout-item__opener`),n=e.querySelector(`.checkout-item__details`),r=t?.querySelector(`span`);!t||!n||(n.classList.add(`hidden`),t.addEventListener(`click`,()=>{n.classList.toggle(`hidden`),r?.classList.toggle(`active`)}))})}function w(){if(!v)return;let e=v.shipping,t=document.querySelector(`.checkout__content.second .firstname`),n=document.querySelector(`.checkout__content.second .lastname`),r=document.querySelector(`.checkout__content.second .street`),i=document.querySelector(`.checkout__content.second .region`),a=document.querySelector(`.checkout__content.second .zip`),o=document.querySelector(`.checkout__content.second .country`);t&&(t.textContent=e.firstName||``),n&&(n.textContent=e.lastName||``),r&&(r.textContent=e.street||``),i&&(i.textContent=e.state||``),a&&(a.textContent=e.zip||``),o&&(o.textContent=e.country||``);let s=document.querySelector(`.checkout__summary-stage .firstname`),c=document.querySelector(`.checkout__summary-stage .lastname`),l=document.querySelector(`.checkout__summary-stage .street`),u=document.querySelector(`.checkout__summary-stage .region`),d=document.querySelector(`.checkout__summary-stage .zip`),f=document.querySelector(`.checkout__summary-stage .country`);s&&(s.textContent=e.firstName||``),c&&(c.textContent=e.lastName||``),l&&(l.textContent=e.street||``),u&&(u.textContent=e.state||``),d&&(d.textContent=e.zip||``),f&&(f.textContent=e.country||``)}function T(e){let t=b(e),n=x(e),r=document.getElementById(`shipping-cost`),i=document.getElementById(`shipping-method-display`),a=document.getElementById(`order-total`);if(r&&(r.textContent=`${t} EUR`),i&&(i.textContent=n),v){let n=v.totals.subtotal,r=v.totals.tax,i=n+t+r;a&&(a.textContent=`${i.toFixed(2)} EUR`),v.shippingMethod=e,v.totals.total=i}}function E(){document.querySelectorAll(`input[name="shipping"]`).forEach(e=>{e.addEventListener(`change`,e=>{let t=e.target;t.checked&&T(t.value)})});let e=document.querySelector(`input[name="shipping"]:checked`);e&&T(e.value)}function D(){let e=document.querySelector(`.checkout__toggle-items`),t=document.querySelector(`.checkout__items`);e?.addEventListener(`click`,()=>{t?.classList.toggle(`hidden`),e.classList.toggle(`active`)})}function O(e){let t=document.querySelectorAll(`.checkout__step`),n=document.querySelector(`.checkout__content.first`),r=document.querySelector(`.checkout__content.second`),i=document.querySelector(`.checkout__summary-inner`),a=document.querySelector(`.checkout__summary-stage`),o=document.querySelector(`.checkout__items`),s=document.querySelector(`.checkout__toggle-items`);t.forEach((t,n)=>{n===e-1?t.classList.add(`active`):t.classList.remove(`active`)}),e===1?(n?.classList.remove(`hidden`),r?.classList.add(`hidden`),i?.classList.remove(`hidden`),a?.classList.add(`hidden`),o&&s&&(o.classList.contains(`hidden`)?s.classList.add(`active`):s.classList.remove(`active`))):(n?.classList.add(`hidden`),r?.classList.remove(`hidden`),a?.classList.remove(`hidden`),o&&s&&(o.classList.contains(`hidden`)?s.classList.add(`active`):s.classList.remove(`active`)),w(),S())}function k(e,n){let r=document.getElementById(`checkout__shipping`);if(!r)return;let i=new a(r,{errorFieldCssClass:`is-invalid`});i.addField(`[name="firstName"]`,[{rule:`required`,errorMessage:`First name is required`},{validator:e=>/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(e),errorMessage:`First name must contain only letters`}]).addField(`[name="lastName"]`,[{rule:`required`,errorMessage:`Last name is required`},{validator:e=>/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(e),errorMessage:`First name must contain only letters`}]).addField(`[name="street"]`,[{rule:`required`,errorMessage:`Street is required`}]).addField(`[name="zip"]`,[{validator:e=>e?/^\d+$/.test(e):!0,errorMessage:`ZIP must be numeric`}]),i.onSuccess(async i=>{i.preventDefault();let a=new FormData(r),o=e.querySelector(`[data-select="country"] .cart-select__selected`),s=e.querySelector(`[data-select="state"] .cart-select__selected`),l=o?.textContent?.trim()||``,u=s?.textContent?.trim()||``,d=a.get(`shipping`)||`flat`,p=n.reduce((e,t)=>e+t.price*t.quantity,0),m=p*.03,h=b(d),g=p+m+h;v={cart:n.map(e=>({...e,total:e.price*e.quantity,imageUrl:e.image?`./img/main/products/${e.image}.webp`:`./img/main/products/crisp_product_dress-1.webp`,sizeLabel:e.selected_size?`W${e.selected_size}`:void 0})),shipping:{firstName:a.get(`firstName`),lastName:a.get(`lastName`),email:a.get(`email`),street:a.get(`street`),country:l,state:u,zip:a.get(`zip`)},shippingMethod:d,totals:{subtotal:p,tax:m,total:g}};try{await t()&&(await f({firstName:v.shipping.firstName,lastName:v.shipping.lastName}),await c({country:l,state:u,address:v.shipping.street,zip:Number(v.shipping.zip)}))}catch(e){console.error(`Shipping save error:`,e)}sessionStorage.setItem(`checkoutData`,JSON.stringify(v)),S(),T(d),O(2)})}function A(){let e=document.querySelector(`.checkout__payment-order`),t=document.querySelector(`.checkout__payment-back`),n=document.querySelector(`.checkout__payment-discount button`),i=document.querySelector(`.checkout__payment-discount input`);t?.addEventListener(`click`,()=>{O(1)}),n?.addEventListener(`click`,()=>{let e=i?.value;console.log(`Apply discount:`,e)}),e?.addEventListener(`click`,async()=>{if(!v){alert(`No order data found. Please go back to shipping step.`);return}let t=e;t.disabled=!0,t.textContent=`Processing...`;try{let e=await p({cart:_,totals:v.totals,shipping:v.shipping,shippingMethod:v.shippingMethod});if(e.error){alert(`Error: ${e.error.message}`),t.disabled=!1,t.textContent=`PLACE ORDER`;return}await u(e.order.id,`completed`),alert(`Order #${e.order.id} created successfully!`),r(),sessionStorage.removeItem(`checkoutData`),setTimeout(()=>{window.location.href=`./`},500)}catch(e){alert(`Checkout failed: ${e.message}`),t.disabled=!1,t.textContent=`PLACE ORDER`}})}async function j(){let e=document.querySelector(`.checkout`);if(!e)return;if(_=await n(),!_.length){window.location.href=`./cart.html`;return}let t=y(_),r=_.reduce((e,t)=>e+t.quantity,0),i=t.reduce((e,t)=>e+t.total,0),a=i*.03,o=i+a+5;e.innerHTML=g({items:t,itemCount:r,subtotal:i.toFixed(2),tax:a.toFixed(2),shippingCost:5 .toFixed(2),total:o.toFixed(2),firstName:``,lastName:``,street:``,state:``,zip:``,country:``,shippingMethodLabel:`Flat Rate`});let s=sessionStorage.getItem(`checkoutData`);s&&(v=JSON.parse(s)),await M(e),P(e),await N(e),E(),k(e,_),A(),D(),C(),await F();let c=document.querySelector(`.checkout__items`),l=document.querySelector(`.checkout__toggle-items`);c&&l&&(c.classList.remove(`hidden`),l.classList.remove(`active`)),O(1)}async function M(e){try{let t=await d();if(!t)return;let n=e.querySelector(`[name="firstName"]`),r=e.querySelector(`[name="lastName"]`);n&&t.first_name&&(n.value=t.first_name),r&&t.last_name&&(r.value=t.last_name)}catch(e){console.error(`Failed to load profile:`,e)}}async function N(e){try{let t=await o();if(!t)return;let n=e.querySelector(`[name="street"]`),r=e.querySelector(`[name="zip"]`);n&&t.address&&(n.value=t.address),r&&t.zip&&(r.value=String(t.zip));let i=e.querySelector(`[data-select="country"] .cart-select__selected`),a=e.querySelector(`[data-select="state"] .cart-select__selected`);i&&t.country&&(i.textContent=t.country,i.dataset.value=t.country),a&&t.state&&(a.textContent=t.state,a.dataset.value=t.state)}catch(e){console.error(`Failed to load shipping:`,e)}}function P(e){let t=e.querySelector(`[data-select="country"]`),n=e.querySelector(`[data-select="state"]`);if(!t||!n)return;let r=l.getAllCountries(),i=()=>{if(!v)return;let e=t.querySelector(`.cart-select__selected`),r=n.querySelector(`.cart-select__selected`),i=e?.textContent?.trim()||``,a=r?.textContent?.trim()||``;v.shipping.country=i,v.shipping.state=a,document.querySelector(`.checkout__content.second:not(.hidden)`)&&w()},a=()=>{let e=t.querySelector(`.cart-select__selected`),n=t.querySelector(`.cart-select__dropdown`);if(!e||!n)return;n.innerHTML=r.map(e=>`
          <div class="cart-select__option" data-value="${e.isoCode}">
            ${e.name}
          </div>
        `).join(``);let a=r.find(e=>e.isoCode===`US`);a&&(e.textContent=a.name,e.dataset.value=a.isoCode),e.addEventListener(`click`,e=>{e.stopPropagation(),t.classList.toggle(`open`)}),n.addEventListener(`click`,n=>{let r=n.target.closest(`.cart-select__option`);if(!r)return;let a=r.dataset.value;e.textContent=r.textContent,e.dataset.value=a,t.classList.remove(`open`),c(a),i(),v&&sessionStorage.setItem(`checkoutData`,JSON.stringify(v))})},o=()=>{let e=n.querySelector(`.cart-select__selected`),t=n.querySelector(`.cart-select__dropdown`);!e||!t||(e.addEventListener(`click`,e=>{e.stopPropagation(),n.classList.toggle(`open`)}),t.addEventListener(`click`,t=>{let r=t.target.closest(`.cart-select__option`);if(!r)return;let a=r.dataset.value;e.textContent=r.textContent,e.dataset.value=a,n.classList.remove(`open`),i(),v&&sessionStorage.setItem(`checkoutData`,JSON.stringify(v))}))},c=e=>{let t=s.getStatesOfCountry(e),r=n.querySelector(`.cart-select__dropdown`),i=n.querySelector(`.cart-select__selected`);!r||!i||(r.innerHTML=t.map(e=>`
          <div class="cart-select__option" data-value="${e.isoCode}">
            ${e.name}
          </div>
        `).join(``),t.length>0?(i.textContent=t[0].name,i.dataset.value=t[0].isoCode):(i.textContent=`Select state`,i.dataset.value=``))};document.addEventListener(`click`,()=>{t.classList.remove(`open`),n.classList.remove(`open`)}),a(),o(),c(`US`)}async function F(){let e=await t(),n=document.querySelector(`.checkout__login`);e?n?.classList.add(`hide`):n?.classList.remove(`hide`)}export{j as initCheckout};