import { Request, Response } from "express";
import { OrderModel } from "../models/order.js";
import { CustomerModel } from "../models/customer.js";
import { RevolutService } from "../services/revolut.js";
import { PaymentModel } from "../models/payment.js";
import { PRSService } from "../services/prs.js";

export class ProcessingController {
    static async createOrder(req: Request, res: Response) {
        try {
            const { amount, currency, name, email } = req.body;
            const order = new OrderModel({ amount, currency, description: name, email });
            await RevolutService.createOrder(order);
            const { description, publicOrderId, state, customerId, orderId } = order;

            if (customerId) {
                try { 
                    await PRSService.saveCustomerData({email, cid: customerId,orderId });
                    console.log("Customer data saved successfully.");
                } catch (err) {
                    console.error("Failed to save customer data:", err);
                    res.status(500).json({
                        error: "Order creation failed",
                    })
                }
            }

            res.status(201).json({
                description,
                revolutPublicOrderId: publicOrderId,
                state
            })
        } catch (err) {
            console.error("Failed to create order:", err);
                res.status(500).json({
                    error: "Order creation failed",
            })
        }
    }

    static async paymentSuccessful(req: Request, res: Response) {
        const { order_id } = req.body;
        try {
            await PRSService.updateLastPaid(order_id)
            console.log("updateLastPaid successfully.");
            res.status(204).send()
        } catch (err) {
            console.error("Failed to updateLastPaid:", err);
            res.status(400).send("Internal Server Error")
        }
    }

    static async paymentFailed(req: Request, res: Response) {
        const { order_id } = req.body;
        try {
            await PRSService.setUnpaid(order_id);
            console.log("setUnpaid successfully.");
            res.status(204).send();
        } catch (err) {
            console.error("Failed to setUnpaid:", err);
            res.status(400).send("Internal Server Error");
        }
    }

    static async prolongation(req: Request, res: Response) {
        // const { cid } = req.body;
        const { body: { cid } } = req;

        const amount = 500;
        const currency = "EUR";
        const name = "Robo Subscription";

        const order: OrderModel = new OrderModel({ amount, currency, description: name, customerId: cid })

        try {
            await RevolutService.createOrder(order)
            console.log("updated order", order)
            
            const { orderId } = order
            if (!orderId) {
                console.error("Missing orderId in Revolut response");
                return res.status(500).send("Internal Server Error");
            }
            await PRSService.updateOrderId({orderId, cid})
            const customer = new CustomerModel({customerId: cid})
            await RevolutService.getSavedPaymentMethod(customer);
            console.log("updated customer", customer);
            const { paymentId } = customer;
            if (!paymentId) {
                console.error("Missing paymentId");
                return res.status(500).send("Internal Server Error");
            }
            const payment = new PaymentModel({orderId, paymentMethodId: paymentId})
            await RevolutService.payOrder(payment)
            return res.status(201).send()
        } catch (err) {
            console.error("Prolongation failed:", err);
            return res.status(500).send("Internal Server Error: Prolongation process failed");
        }
    }
}