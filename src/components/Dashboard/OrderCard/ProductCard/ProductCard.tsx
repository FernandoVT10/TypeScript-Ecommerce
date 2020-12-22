import {AddSpacesToNumber, getDiscountedPrice} from "@/services/FormatsForNumber";
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
    const price = getDiscountedPrice(product.price, product.discount);

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
		    <span className={styles.currentPrice}>$ { AddSpacesToNumber(price) }</span>

		    { product.discount > 0 &&
			<span>
			    <s className={styles.oldPrice}>$ { AddSpacesToNumber(product.price) }</s>

			    <span className={styles.discount}>%{ product.discount }</span>
			</span>
		    }
		</div>

		<p className={styles.quantity}>Quantity: { product.quantity }</p>
	    </div>
	</div>
    );
}

export default ProductCard;
