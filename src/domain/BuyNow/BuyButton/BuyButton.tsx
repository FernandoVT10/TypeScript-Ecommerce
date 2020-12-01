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

interface BuyButtonProps {
    paypalClientId: string,
    addressId: string,
    setErrorMessage: React.Dispatch<string>
}

const BuyButton = ({ paypalClientId, addressId, setErrorMessage }: BuyButtonProps) => {
    const router = useRouter();

    const paypalOptions = {
	clientId: paypalClientId
    }

    const onSuccess = async (_, data: { orderID: string }) => {
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
	router.push("/dashboard/orders");
    }

    const createOrder = async () => {
	const cartItems = ShoppingCartController.getItems();

	const res = await ApiController.post<APIResponses["createOrder"]>("payment/create", {
	    body: {
		cartItems,
		addressId
	    }
	});

	return res.data.orderId;
    }

    const cancelOrder = async (orderId: string) => {
	await ApiController.post("payment/cancel", {
	    body: {
		orderId
	    }
	});
    }

    const onCancel = (data: { orderID: string }) => cancelOrder(data.orderID);

    const onError = (data: { orderID: string }) => {
	cancelOrder(data.orderID);

	setErrorMessage("An error has ocurred in the server. Please try again later.");
    }

    return (
	<PayPalButton
	createOrder={createOrder}
	onSuccess={onSuccess}
	onCancel={onCancel}
	onError={onError}
	options={paypalOptions}/>
    );
}

export default BuyButton;
