import apiCall from "./apiCall";

const CURRENCY = "USD";

export interface IOrderItem {
    title: string,
    price: number,
    quantity: number
}

export default async (items: IOrderItem[]) => {
    const totalPrice = items.reduce((acc, item) => {
	return acc + item.quantity * item.price;
    }, 0);

    const orderItems = items.map(item => {
	return {
	    name: item.title,
	    unit_amount: {
		currency_code: CURRENCY,
		value: item.price.toFixed(2)
	    },
	    quantity: item.quantity.toString()
	};
    });

    try {
	const data = await apiCall("/v2/checkout/orders", {
	    intent: "CAPTURE",
	    purchase_units: [
		{
		    amount: {
			currency_code: CURRENCY,
			value: totalPrice.toFixed(2),
			breakdown: {
			    item_total: {
				currency_code: CURRENCY,
				value: totalPrice.toFixed(2)
			    }
			}
		    },
		    items: orderItems
		}
	    ]
	});

	if(!data.id) {
	    throw new Error("Payment couldn't be created"); 
	}

	return data.id;
    } catch(err) {
       throw new Error(err.message); 
    }
}
