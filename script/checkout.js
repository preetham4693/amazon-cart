import {cart, removeFromCart, updateDeliveryOpt} from "../data/cart.js";
import {products} from '../data/products.js';
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from "../data/deliveryOption.js";

function renderCart() {
  let cartSummaryHtml = '';
  cart.forEach((item) => {
    const matchingProducts = products.find(p => p.id === item.productId);
    if (!matchingProducts) return;

    const deliveryOptionId = item.deliveryOptionId;
    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    if (!deliveryOption) {
      deliveryOption = deliveryOptions[0];
    }

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );

    const datestring = deliveryDate.format(
      'dddd, MMMM D'
    );

    cartSummaryHtml +=
      `<div class="cart-item-container 
  js-cart-item-container-${matchingProducts.id}">
  <div class="delivery-date">
    Delivery date: ${datestring}
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image"
      src="${matchingProducts.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${matchingProducts.name}
      </div>
      <div class="product-price">
        ${formatCurrency(matchingProducts.priceCents)}
      </div>
      <div class="product-quantity">
        <span>
          Quantity: <span class="quantity-label">${item.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary">
          Update
        </span>
        <span class="delete-quantity-link link-primary 
        js-delete-quantity" 
        data-product-id='${matchingProducts.id}'>
          Delete
        </span>
      </div>
    </div>

  <div class="delivery-options">
    <div class="delivery-options-title">
      Choose a delivery option:
    </div>
    ${deliveryOptionHtml(matchingProducts, item)}
   </div>
  </div>
</div>`;
  });

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHtml;

  // Attach delete listeners
  document.querySelectorAll('.js-delete-quantity')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        renderCart();
        updateCartQuantity();
      });
    });

  // Attach delivery option listeners
  document.querySelectorAll('.js-delivery-option')
    .forEach((elements) => {
      elements.addEventListener('click', () => {
        const {productId, deliveryOptionId} = elements.dataset;
        updateDeliveryOpt(productId, deliveryOptionId);
        renderCart();
        updateCartQuantity();
      });
    });

  updateCartQuantity();
}

function deliveryOptionHtml(matchingProducts, item) {
  let Html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );

    const datestring = deliveryDate.format(
      'dddd, MMMM D'
    );
    const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)}`;

    const isChecked = deliveryOption.id === item.deliveryOptionId;

    Html += `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProducts.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProducts.id}">
        <div>
          <div class="delivery-option-date">
           ${datestring}
          </div>
          <div class="delivery-option-price">
           ${priceString} - Shipping
          </div>
        </div>
      </div>
    `;
  });
  return Html;
}

function updateCartQuantity() {
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.js-return-to-home-link').innerText = `${cartQuantity} item${cartQuantity !== 1 ? 's' : ''}`;
}

// Initial render on page load
renderCart();
