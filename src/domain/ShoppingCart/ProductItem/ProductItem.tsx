import React from "react";

import Link from "next/link";

import { AddSpacesToNumber, getDiscountedPrice } from "@/services/FormatsForNumber";

import QuantitySelector from "./QuantitySelector";

import styles from "./ProductItem.module.scss";

export interface ProductItemProps {
    product: {
	_id: string,
	title: string,
	images: string[],
	price: number,
	quantity: number,
	discount: number,
	inStock: number
    },
    removeProductFromCart: (productId: string) => void,
    updateQuantityOnCart: (productId: string, quantity: number) => void
}

function ProductItem({ product, removeProductFromCart, updateQuantityOnCart }: ProductItemProps) {
    const discountedPrice = getDiscountedPrice(product.price * product.quantity, product.discount);

    const handleRemoveProduct = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
	e.preventDefault();

	removeProductFromCart(product._id);
    }

    const handleSetQuantity = (quantity: number) => {
	updateQuantityOnCart(product._id, quantity);
    }

    return (
	<div className={styles.productItem}>
	    <div className={styles.productDetails}>
		<img src={`/img/products/thumb-${product.images[0]}`} className={styles.image} alt="Product Item Image" />

		<div className={styles.optionsContainer}>
		    <Link href={`/products/${product._id}`}>
			<a className={styles.title}>{ product.title }</a>
		    </Link>

		    <a
		    href="#"
		    className={styles.option}
		    onClick={handleRemoveProduct}>
			Remove
		    </a>

		    <a href="#" className={styles.option}>Buy Now</a>
		</div>
	    </div>

	    <QuantitySelector quantity={product.quantity} setQuantity={handleSetQuantity} inStock={product.inStock}/>

	    <div className={styles.priceContainer}>
		{ product.discount > 0 && 
		    <span className={styles.discount}>{ product.discount }%</span>
		}

		{ product.discount > 0 &&
		    <div className={styles.price}>
			<span className={styles.currentPrice}>$ { AddSpacesToNumber(discountedPrice) }</span>
			<s className={styles.oldPrice}>$ { AddSpacesToNumber(product.price * product.quantity) }</s>
		    </div>
		}

		{ product.discount === 0 && 
		    <div className={styles.price}>
			<span className={styles.currentPrice}>$ { AddSpacesToNumber(product.price * product.quantity) }</span>
		    </div>
		}

	    </div>
	</div>
    );
}

export default ProductItem;
