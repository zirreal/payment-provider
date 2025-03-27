import RevolutCheckout from "https://unpkg.com/@revolut/checkout/esm";

// import RevolutCheckout from '@revolut/checkout'

import {
  addNotification,
  addModalNotification,
} from "./utils.js";

import {
  AMOUNT,
  CURRENCY,
  NAME,
  JWT_PAYLOAD
} from "../../src/constants.js";



document.addEventListener("DOMContentLoaded", async () => {
  // adding data to layout
  const price = document.querySelector('.price')
  const product = document.querySelector('#product_name');

  price.innerText = "€" + AMOUNT;
  product.innerText = NAME;

  const revolutPublicKey = REVOLUT_API_PUBLIC_KEY;
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email") || "test@example.com";
  console.log("Email from URL:", email);

  if (!revolutPublicKey) {
    addNotification(
      "No public key is defined in your .env file. Please check and try again",
    );
    alert("Please set your Revolut Public Key in the .env file");
    return;
  }

  

  const { revolutPay } = await RevolutCheckout.payments({
    locale: "en", // Optional, defaults to 'auto'
    mode: "sandbox", // Optional, defaults to 'prod'
    publicToken: revolutPublicKey, // Merchant public API key
  });

  const paymentOptions = {
    currency: CURRENCY,
    totalAmount: AMOUNT,
    savePaymentMethodForMerchant: true,
    customer: {email: email},

    mobileRedirectUrls: {
      success: `${window.location.origin}/success`,
      failure: `${window.location.origin}/failure`,
      cancel: `${window.location.origin}/cancel`,
    },

    createOrder: async () => {
        const response = await fetch(`${FETCH_URL}/api/newOrder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: AMOUNT,
            currency: CURRENCY,
            name: NAME || 'name', 
            email: email
          }),
        });
        console.log(response)
        const order = await response.json();
        console.log("Order created", order);

      return { publicId: order.revolutPublicOrderId };
    },
  };
  

  // Mount Revolut Pay Button
  revolutPay.mount(document.getElementById("revolut-pay"), paymentOptions);

  // Event handlers
  revolutPay.on("payment", async (event) => {
    switch (event.type) {
      case "cancel": {
        console.log("payment canceled");
        addModalNotification(
          "Canceled Payment",
          `Order canceled ${event.orderId ? `- orderId: ${event.orderId}` : ""}`,
        );
        break;
      }

      case "success":
        console.log("payment successful");
        console.log(event);
        addModalNotification(
          "Payment complete",
          `Order completed ${event.orderId ? `- orderId: ${event.orderId}` : ""}`,
        );
        break;

      case "error":
        console.log("error in payment");
        console.log(event)
        addModalNotification(
          "Error in payment",
          `Error in order ${event.orderId ? `- orderId: ${event.orderId}` : ""}`,
        );
        break;
    }
  });
});
