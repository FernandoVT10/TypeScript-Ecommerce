import React from "react";

import { useRouter } from "next/router";
import { PayPalButton } from "react-paypal-button-v2";

import ShoppingCartController from "@/services/ShoppingCartController";
import ApiController from "@/services/ApiController";

import styles from "./BuyNow.module.scss";

interface BuyNowProps {
    paypalClientId: string
}

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

function BuyNow({ paypalClientId }: BuyNowProps) {
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
	<div className={styles.buyNow}>
	    <PayPalButton
	    createOrder={createOrder}
	    onSuccess={onSuccess}
	    onCancel={onCancel}
	    options={paypalOptions}/>
	</div>
    );
}

export default BuyNow;
