export interface PaymentProps {
    orderId: string;
    paymentMethodId: string;
    initiator?: "merchant";
  }
  
export class PaymentModel {
    orderId: string;
    paymentMethodId: string;
    initiator: "merchant";
  
    constructor({ orderId, paymentMethodId, initiator = "merchant" }: PaymentProps) {
      this.orderId = orderId;
      this.paymentMethodId = paymentMethodId;
      this.initiator = initiator;
    }
  
    toRevolutPaymentPayload() {
      return {
        saved_payment_method: {
          type: "revolut_pay",
          id: this.paymentMethodId,
          initiator: this.initiator,
        },
      };
    }
}
  