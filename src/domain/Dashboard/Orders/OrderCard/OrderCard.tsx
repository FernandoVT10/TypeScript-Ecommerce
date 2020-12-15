import React from "react";

import ProductCard, { ProductCardProps } from "./ProductCard";

import { AddSpacesToNumber } from "@/services/FormatsForNumber";

import styles from "./OrderCard.module.scss";

export interface OrderCardProps {
    order: {
	_id: string,
	total: number,
	products: Array<ProductCardProps["product"]>
    }
}

const OrderCard = ({ order }: OrderCardProps) => {
    return (
	<div className={styles.orderCard}>
	    <div className={styles.products}>
		{order.products.map((product, index) => {
		    return <ProductCard product={product} key={index}/>;
		})}
	    </div>

	    <div className={styles.total}>
		<span>Total</span>
		<span>$ { AddSpacesToNumber(order.total) }</span>
	    </div>

	    <p className={styles.purchaseId}>PurchaseId: { order._id }</p>
	</div>
    );
}

export default OrderCard;
