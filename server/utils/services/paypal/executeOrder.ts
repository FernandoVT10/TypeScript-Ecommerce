import apiCall from "./apiCall"

export default async (orderId: string) => {
    try {
	const data = await apiCall(`v2/checkout/orders/${orderId}/authorize`);

	if(data.status === "COMPLETED") {
	    return true;
	}

	return false;
    } catch (err) {
        throw new Error(err.message);
    }
}
