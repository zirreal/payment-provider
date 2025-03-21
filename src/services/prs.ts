import { generateToken } from "../utils/jwt.js"

const URL = process.env.PRS_URL
const HEADERS = {
    "Content-Type": "application/json",
  }

export class PRSService {
    async saveCustomerData({ email, cid, orderId }) {
        const token = generateToken()
        const response = await fetch(`${URL}/saveCustomerData/${email}`, {
            method: "PUT",
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${token}`
            },
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
        const token = generateToken()
        const response = await fetch(`${URL}/updateLastPaid`, {
            method: "POST",
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              order_id: orderId,
            }),
        })
        if (!response.ok) {
            throw new Error("Failed to updateLastPaid in PRS");
        }
    }

    async setUnpaid(orderId: string) {
        const token = generateToken()
        const response = await fetch(`${URL}/setUnpaid`, {
            method: "POST",
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              order_id: orderId,
            }),
        })
        if (!response.ok) {
            throw new Error("Failed to setUnpaid in PRS");
        }
    }

    async updateOrderId({ orderId, cid }) {
        const token = generateToken()
        const response = await fetch(`${URL}/updateOrderId/${cid}`, {
            method: "PUT",
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              order_id: orderId
            }),
        })
        if (!response.ok) {
            throw new Error("Failed to updateOrderId in PRS");
        }
    }

}