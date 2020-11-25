import React from "react";

import { PayPalButton } from "react-paypal-button-v2";

import ShoppingCartController from "@/services/ShoppingCartController";
import ApiController from "@/services/ApiController";

import styles from "./BuyNow.module.scss";

interface BuyNowProps {
    paypalClientId: string
}

interface APIResponses {
    createOrder: {
	data: {
	    orderId: string
	}
    }
}

function BuyNow({ paypalClientId }: BuyNowProps) {
    const onSuccess = (details, data) => {
        console.log(details, data);
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

    return (
	<div className={styles.buyNow}>
	    <PayPalButton
	    amount="0.01"
	    createOrder={createOrder}
	    onSuccess={onSuccess}
	    options={paypalOptions}/>
	</div>
    );
}

export default BuyNow;
