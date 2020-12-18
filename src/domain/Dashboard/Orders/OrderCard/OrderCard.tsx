import React, { useState } from "react";

import ProductCard, { ProductCardProps } from "./ProductCard";

import { AddSpacesToNumber } from "@/services/FormatsForNumber";

import ShippingDetails, { ShippingDetailsProps } from "./ShippingDetails";

import styles from "./OrderCard.module.scss";
import Link from "next/link";

export interface OrderCardProps {
    order: {
	_id: string,
	total: number,
	status: "SHIPPING" | "COMPLETED",
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
    const [isShippingDetailsActive, setIsShippingDetailsActive] = useState(false);
    const { shipping } = order;

    const orderCardClass = order.status === "SHIPPING" ? styles.shipping : "";
    const lastShippingStatus = shipping.history[shipping.history.length - 1].content;

    return (
	<div className={`${styles.orderCard} ${orderCardClass}`}>
	    <ShippingDetails
	    address={order.address}
	    shipping={order.shipping}
	    isActive={isShippingDetailsActive}
	    setIsActive={setIsShippingDetailsActive}/>

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
			<button
			className={styles.option}
			onClick={() => setIsShippingDetailsActive(true)}>
			    See more shipping details
			</button>

			<Link href={`/dashboard/chat?help_with_order=${order._id}`}>
			    <button className={styles.option}>
				Send a message
			    </button>
			</Link>
		    </div>
		</div>
	    }

	    <p className={styles.orderId}>Order Id: { order._id }</p>
	</div>
    );
}

export default OrderCard;
