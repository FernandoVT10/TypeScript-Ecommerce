import fetch from "node-fetch";

import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "../../../config";

const PAYPAL_API = "https://api.sandbox.paypal.com";

const authorization = `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`;
const base64Authorization = Buffer.from(authorization).toString("base64");

export default async (url: string, body: object = {}) => {
    const res = await fetch(PAYPAL_API + url, {
	method: "POST",
	headers: {
	    "Content-Type": "application/json",
	    "Authorization": `Basic ${base64Authorization}`
	},
	body: JSON.stringify(body)
    });
    
    return await res.json();
}
