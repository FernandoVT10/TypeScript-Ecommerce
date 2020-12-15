import {AddSpacesToNumber} from "@/services/FormatsForNumber";
import Link from "next/link";
import React from "react";

import styles from "./ProductCard.module.scss";

export interface ProductCardProps {
    product: {
	discount: number,
	price: number,
	quantity: number,
	originalProduct: {
	    _id: string,
	    title: string,
	    images: Array<string>
	}
    }
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
	<div className={styles.product}>
	    <img
	    src={`/img/products/thumb-${product.originalProduct.images[0]}`}
	    className={styles.image}
	    alt="Product Image"/>

	    <div className={styles.details}>
		<Link href={`/products/${product.originalProduct._id}`}>
		    <a className={styles.title}>{ product.originalProduct.title }</a>
		</Link>

		<div className={styles.price}>
		    $ { AddSpacesToNumber(product.price) }
		</div>

		<p className={styles.quantity}>Quantity: { product.quantity }</p>
	    </div>
	</div>
    );
}

export default ProductCard;
