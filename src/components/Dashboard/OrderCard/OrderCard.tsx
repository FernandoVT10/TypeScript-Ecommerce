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
	user: {
	    _id: string,
	    username: string
	},
	products: Array<ProductCardProps["product"]>
    },
    isManageCard?: boolean
}

const OrderCard = ({ order, isManageCard = false }: OrderCardProps) => {
    const [isShippingDetailsActive, setIsShippingDetailsActive] = useState(false);

    const { shipping } = order;

    const orderCardClass = order.status === "COMPLETED" ? styles.completed : "";

    const lastShippingStatus = shipping.history[shipping.history.length - 1].content;

    const sendMessageLink = isManageCard
	? `/dashboard/chat/${order.user._id}`
	: `/dashboard/chat?help_with_order=${order._id}`;

    return (
	<div className={`${styles.orderCard} ${orderCardClass}`}>
	    { order.status === "SHIPPING" &&
		<ShippingDetails
		orderId={order._id}
		address={order.address}
		shipping={order.shipping}
		isActive={isShippingDetailsActive}
		setIsActive={setIsShippingDetailsActive}
		isManageCard={isManageCard}/>
	    }

	    <div className={styles.products}>
		{order.products.map((product, index) => {
		    return <ProductCard product={product} key={index}/>;
		})}
	    </div>

	    <div className={styles.total}>
		<span>Total</span>
		<span>$ { AddSpacesToNumber(order.total) }</span>
	    </div>

	    <div className={styles.shippingDetails}>
		<div className={styles.details}>
		    { shipping.arrivesIn && !isManageCard && order.status === "SHIPPING" && 
			<span className={styles.arrivesIn}>
			    Arrives in:
			    <span className={styles.date}>{ shipping.arrivesIn }</span>
			</span>
		    }

		    { isManageCard && 
			<span className={styles.usernameContainer}>
			    User:
			    <span className={styles.username}>
				{ order.user.username }
			    </span>
			</span>
		    }

		    <span className={styles.shippingStatus}>
			Shipping Status:
			<span className={styles.status}>{ lastShippingStatus }</span>
		    </span>
		</div>

		{ order.status === "SHIPPING" &&
		    <div className={styles.options}>
			<button
			className={styles.option}
			onClick={() => setIsShippingDetailsActive(true)}>
			    See more shipping details
			</button>

			<Link href={sendMessageLink}>
			    <button className={styles.option}>
				Send a message
			    </button>
			</Link>
		    </div>
		}
	    </div>

	    <p className={styles.orderId}>Order Id: { order._id }</p>
	</div>
    );
}

export default OrderCard;
