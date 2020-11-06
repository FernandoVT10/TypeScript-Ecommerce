import React, { useState } from "react";

import QuantitySelector from "./QuantitySelector";

import styles from "./ProductItem.module.scss";
import AddSpacesToNumber from "@/services/AddSpacesToNumber";

export interface ProductItemProps {
    product: {
	title: string,
	image: string,
	price: number,
	quantity: number,
	discount: number,
	inStock: number
    }
}

function ProductItem({ product }: ProductItemProps) {
    const [quantity, setQuantity] = useState(product.quantity);

    const discountedPrice = product.price * (product.discount / 100);

    return (
	<div className={styles.productItem}>
	    <div className={styles.productDetails}>
		<img src={`/img/products/thumb-${product.image}`} className={styles.image} alt="Product Item Image" />

		<div className={styles.optionsContainer}>
		    <p className={styles.title}>{ product.title }</p>

		    <a href="#" className={styles.option}>Remove</a>
		    <a href="#" className={styles.option}>Buy Now</a>
		</div>
	    </div>

	    <QuantitySelector quantity={quantity} setQuantity={setQuantity} inStock={product.inStock}/>

	    <div className={styles.priceContainer}>
		{ product.discount > 0 && 
		    <span className={styles.discount}>{ product.discount }%</span>
		}

		{ product.discount > 0 &&
		    <div className={styles.price}>
			<span className={styles.currentPrice}>$ { AddSpacesToNumber(discountedPrice) }</span>
			<s className={styles.oldPrice}>$ { AddSpacesToNumber(product.price) }</s>
		    </div>
		}

		{ product.discount === 0 && 
		    <div className={styles.price}>
			<span className={styles.currentPrice}>$ { AddSpacesToNumber(product.price) }</span>
		    </div>
		}

	    </div>
	</div>
    );
}

export default ProductItem;
