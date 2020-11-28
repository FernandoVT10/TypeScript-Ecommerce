import React from "react";

import { AddSpacesToNumber, getDiscountedPrice } from "@/services/FormatsForNumber";

import styles from "./ProductCard.module.scss";

export interface ProductCardProps {
    product: {
	title: string,
	images: string[],
	price: number,
	discount: number,
	quantity: number
    }
}

const ProductCard = ({ product }: ProductCardProps) => {
    const discountedPrice = getDiscountedPrice(product.price, product.discount);

    return (
	<div className={styles.productCard}>
	    <img
	    className={styles.image}
	    src={`/img/products/thumb-${product.images[0]}`}
	    alt="Product Image"/>

	    <div className={styles.details}>
		<h3 className={styles.title}>{ product.title }</h3>

		{ product.discount === 0 &&
		    <div className={styles.priceContainer}>
			<span className={styles.price}>
			    $ { AddSpacesToNumber(product.price) }
			</span>
		    </div>
		}

		{ product.discount > 0 &&
		    <div className={styles.priceContainer}>
			<span className={styles.price}>
			    $ { AddSpacesToNumber(discountedPrice) }
			</span>

			<s className={styles.oldPrice}>$ { AddSpacesToNumber(product.price) }</s>

			<span className={styles.discount}>%{ product.discount }</span>
		    </div>
		}


		<span className={styles.quantity}>
		    Quantity: { product.quantity }
		</span>
	    </div>
	</div>
    );
}

export default ProductCard;
