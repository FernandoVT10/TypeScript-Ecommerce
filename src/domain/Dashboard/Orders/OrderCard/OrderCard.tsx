import React from "react";

import Link from "next/link";

import ProductCard, { ProductCardProps } from "./ProductCard";

import { AddSpacesToNumber } from "@/services/FormatsForNumber";

import ShippingDetails, { ShippingDetailsProps } from "./ShippingDetails";

import styles from "./OrderCard.module.scss";

export interface OrderCardProps {
    order: {
	_id: string,
	total: number,
	status: "SHIPPING" | "COMPLETE",
	address: ShippingDetailsProps["address"],
	shipping: {
	    arrivesIn: string,
	    history: Array<{
		content: string,
		createdAt: string
	    }>
	},
	products: Array<ProductCardProps["product"]>
    }
}

const OrderCard = ({ order }: OrderCardProps) => {
    const { shipping } = order;

    const orderCardClass = order.status === "SHIPPING" ? styles.shipping : "";
    const lastShippingStatus = shipping.history[shipping.history.length - 1].content;

    return (
	<div className={`${styles.orderCard} ${orderCardClass}`}>
	    <ShippingDetails address={order.address} shipping={order.shipping}/>

	    <div className={styles.products}>
		{order.products.map((product, index) => {
		    return <ProductCard product={product} key={index}/>;
		})}
	    </div>

	    <div className={styles.total}>
		<span>Total</span>
		<span>$ { AddSpacesToNumber(order.total) }</span>
	    </div>

	    { order.status === "SHIPPING" &&
		<div className={styles.shippingDetails}>
		    <div className={styles.details}>
			{ shipping.arrivesIn && 
			    <span className={styles.arrivesIn}>
				Arrives in:
				<span className={styles.date}>{ shipping.arrivesIn }</span>
			    </span>
			}

			<span className={styles.shippingStatus}>
			    Shipping Status:
			    <span className={styles.status}>{ lastShippingStatus }</span>
			</span>
		    </div>

		    <div className={styles.options}>
			<Link href={`/dashboard/orders/${order._id}`}>
			    <button className={styles.option}>See more shipping details</button>
			</Link>
		    	<button className={styles.option}>Send a message</button>
		    </div>
		</div>
	    }

	    <p className={styles.purchaseId}>PurchaseId: { order._id }</p>
	</div>
    );
}

export default OrderCard;
