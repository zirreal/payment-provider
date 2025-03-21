export interface CustomerProps {
    customerId: string;
    paymentId?: string;
}
  
  
export class CustomerModel {
    customerId: string;
    paymentId?: string;
  
    constructor({ customerId }: CustomerProps) {
      this.customerId = customerId;
    }

    setPaymentId(response: any) {
        const savedPaymentMethods = response[0]
        this.paymentId = savedPaymentMethods.id
    }
}
  