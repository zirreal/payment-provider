import RevolutCheckout from "https://unpkg.com/@revolut/checkout/esm";

import {
  staticProduct,
  addNotification,
  addModalNotification,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { revolutPublicKey } = await fetch("/paymentProvider/config").then((r) => r.json());
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
    currency: staticProduct.currency,
    totalAmount: staticProduct.amount,
    savePaymentMethodForMerchant: true,
    customer: {email: email},

    mobileRedirectUrls: {
      success: `${window.location.origin}/success`,
      failure: `${window.location.origin}/failure`,
      cancel: `${window.location.origin}/cancel`,
    },

    createOrder: async () => {
      const response = await fetch("/paymentProvider/api/newOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: staticProduct.amount,
          currency: staticProduct.currency,
          name: staticProduct.name, 
          email: email
        }),
      });

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
