import React, { useEffect, useState } from "react";

import Layout from "@/components/Dashboard/Layout";

import ApiController from "@/services/ApiController";

import OrderCard, { OrderCardProps } from "./OrderCard";

import styles from "./Orders.module.scss";

type Order = OrderCardProps["order"];

interface APIResponse {
    data: {
	orders: Array<Order>
    }
}

const Orders = () => {
    const [orders, setOrders] = useState<Array<Order>>([]);

    useEffect(() => {
	const getOrders = async () => {
	    const apiResponse = await ApiController.get<APIResponse>("account/orders/");

	    if(apiResponse.data) {
		setOrders(apiResponse.data.orders);
	    }
	}

	getOrders();
    }, []);

    return (
	<Layout>
	    <div className={styles.orders}>
	    	<h2 className={styles.title}>My Orders</h2>

		{orders.map((order, index) => {
		    return <OrderCard order={order} key={index}/>;
		})}

		{ orders.length === 0 &&
		    <div className={styles.emptyMessage}>
		    	You don't have orders
		    </div>
		}
	    </div>
	</Layout>
    );
}

export default Orders;
