const URL = process.env.PRS_URL
const HEADERS = {
    "Content-Type": "application/json",
  }

export class PRSService {
    async saveCustomerData({ email, cid, orderId }) {
        const response = await fetch(`${URL}/saveCustomerData/${email}`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify({
              cid: cid,
              order_id: orderId,
            }),
        })
        if (!response.ok) {
            throw new Error("Failed to saveCustomerData in PRS");
        }
    }

    async updateLastPaid(orderId: string) {
        const response = await fetch(`${URL}/updateLastPaid`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
              order_id: orderId,
            }),
        })
        if (!response.ok) {
            throw new Error("Failed to updateLastPaid in PRS");
        }
    }

    async setUnpaid(orderId: string) {
        const response = await fetch(`${URL}/setUnpaid`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
              order_id: orderId,
            }),
        })
        if (!response.ok) {
            throw new Error("Failed to setUnpaid in PRS");
        }
    }

    async updateOrderId({ orderId, cid }) {
        const response = await fetch(`${URL}/updateOrderId/${cid}`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify({
              order_id: orderId
            }),
        })
        if (!response.ok) {
            throw new Error("Failed to updateOrderId in PRS");
        }
    }

}