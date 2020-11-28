import React from "react";
import { useRouter } from "next/router";
import { PayPalButton } from "react-paypal-button-v2";

import ApiController from "@/services/ApiController";
import ShoppingCartController from "@/services/ShoppingCartController";

interface APIResponses {
    executeOrder: {
	data: {
	    message: string
	},
	error: string,
	message: string
    },
    createOrder: {
	data: {
	    orderId: string
	}
    }
}

const BuyButton = ({ paypalClientId }: { paypalClientId: string }) => {
    const router = useRouter();

    const onSuccess = async (_, data) => {
	const res = await ApiController.post<APIResponses["executeOrder"]>("payment/execute", {
	    body: {
		orderId: data.orderID
	    }
	});

	if(res.error) {
	    alert(res.message);
	    return;
	}

	ShoppingCartController.clear();
	console.log(res.data.message);
    }

    const paypalOptions = {
	clientId: paypalClientId
    }

    const createOrder = async () => {
	const cartItems = ShoppingCartController.getItems();

	const res = await ApiController.post<APIResponses["createOrder"]>("payment/create", {
	    body: {
	    	cartItems
	    }
	});

	return res.data.orderId;
    }

    const onCancel = async (data) => {
	await ApiController.post("payment/cancel", {
	    body: {
		orderId: data.orderID
	    }
	});

	router.push("/cart/");
    }

    return (
	<PayPalButton
	createOrder={createOrder}
	onSuccess={onSuccess}
	onCancel={onCancel}
	options={paypalOptions}/>
    );
}

export default BuyButton;
