import React from "react";

import Link from "next/link";

import { AddSpacesToNumber, getDiscountedPrice } from "@/services/FormatsForNumber";

import styles from "./ProductCard.module.scss";

export interface ProductCardProps {
    product: {
	_id: string,
	title: string,
	images: Array<string>,
	price: number,
	discount: number,
	inStock: number
    }
}

const ProductCard = ({ product }: ProductCardProps) => {
    const discountedPrice = getDiscountedPrice(product.price, product.discount);

    return (
	<div className={styles.productCard}>
	    <div className={styles.detailsContainer}>
		<img
		src={`/img/products/thumb-${product.images[0]}`}
		className={styles.image}
		alt="Product Card Image" />

		<div className={styles.details}>
		    <p className={styles.inStock}>In Stock: { product.inStock }</p>

		    <Link href={`/products/${product._id}`}>
			<a className={styles.title}>
			    { product.title }
			</a>
		    </Link>

		    <div className={styles.options}>
		    	<button className={styles.option}>
		    	    Delete
		    	</button>

			<Link href={`/dashboard/management/products/${product._id}/edit`}>
			    <button className={styles.option}>
				Edit
			    </button>
			</Link>
		    </div>
		</div>
	    </div>

	    <div className={styles.priceContainer}>
		{ product.discount > 0 &&
		    <p className={styles.discount}>%{ product.discount }</p>
		}

		<div className={styles.price}>
		    <p className={styles.discountedPrice}>$ { AddSpacesToNumber(discountedPrice) }</p>

		    { product.discount > 0 &&
			<s className={styles.notDicountedPrice}>$ { product.price }</s>
		    }
		</div>
	    </div>
	</div>
    );
}

export default ProductCard;
