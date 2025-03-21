export interface OrderProps {
    orderId?: string;
    amount: number;
    currency: string;
    description: string;
    customerId?: string;
    state?: string;
    publicOrderId?: string;
    email?: string;
}

export class OrderModel {
    orderId?: string;
    amount: number;
    currency: string;
    description: string;
    customerId?: string;
    state?: string;
    publicOrderId?: string;
    email?: string;
    
    constructor({ orderId, amount, currency, description, customerId, state, publicOrderId, email }: OrderProps) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.customerId = customerId;
        this.state = state;
        this.publicOrderId = publicOrderId;
        this.email = email;
    }

    setResponseData(response: any) {
        this.orderId = response.id;
        this.publicOrderId = response.token;
        this.state = response.state;
        if (response.customer) {
          this.customerId = response.customer.id;
        }
    }
    
    toRevolutPayload() {
        return {
          description: this.description,
          amount: this.amount,
          currency: this.currency,
          customer: this.customerId 
            ? { id: this.customerId } 
            : { email: this.email }
        };
    }
}