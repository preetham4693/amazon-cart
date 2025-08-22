import { cart } from "../../data/cart.js";
import { getProducts } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOption.js";
import { formatCurrency } from "../utils/money.js";


export function renderPayment(){
  let productPriceCents=0;
  let shippingPricents=0;

  cart.forEach((item) => {
    const product = getProducts(item.productId);
    productPriceCents+= product.priceCents* item.quantity;

    const deliveryOption= getDeliveryOption(item.deliveryOptionId);
    shippingPricents+=deliveryOption.priceCents;
  });

    const totalBeforeTax= productPriceCents+shippingPricents;

    const taxCents = totalBeforeTax*0.1;

    const totalCents = totalBeforeTax + taxCents;

    
const paymentSummaryHtml=`
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items ${cart.reduce((total, item) => total + item.quantity, 0)}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPricents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
`;
document.querySelector('.js-payment-summary').innerHTML =     paymentSummaryHtml;
};



