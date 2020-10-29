import React from "react";

import SelectQuantity, { SelectQuantityProps } from "./SelectQuantity";
import Calification, { CalificationProps } from "./Calification"; 

import styles from "./ProductDetails.module.scss";

export interface ProductDetailsProps {
    product: {
	title: string,
	calification: CalificationProps["calification"],
	price: number,
	inStock: SelectQuantityProps["inStock"],
	discount: number,
	arrivesIn: string,
	warranty: string
    }
}

function ProductDetails({ product }: ProductDetailsProps) {
    const discountedPrice = product.price * (product.discount / 100);

    return (
	<div className={styles.productDetails}>
	    <h3 className={styles.title}>{product.title}</h3>

	    <Calification calification={product.calification}/>

	    {product.discount > 0 ?
		<div className={styles.priceContainer}>
		    <span className={styles.price}>$ {discountedPrice}</span>
		    <s className={styles.oldPrice}>$ {product.price}</s>
		    <span className={styles.discount}>%{product.discount} OFF</span>
		</div>
	    :
		<div className={styles.priceContainer}>
		    <span className={styles.price}>$ {product.price}</span>
		</div>
	    }

	    <SelectQuantity inStock={product.inStock}/>

	    <button className={styles.button}>Buy Now</button>
	    <button className={`${styles.button} ${styles.addToCart}`}>Add to Shopping Cart</button>

	    <div className={styles.info}>
		<i className="fas fa-truck" aria-hidden="true"></i>
		Arrives free in {product.arrivesIn}

		<span className={styles.moreInfo}>
		    The product arrives in {product.arrivesIn} approximately
		</span>
	    </div>

	    <div className={styles.info}>
		<i className="fab fa-paypal" aria-hidden="true"></i>
		Pay with PayPal

		<span className={styles.moreInfo}>
		    You can buy this product with paypal.
		</span>
	    </div>

	    <div className={styles.warranty}>
		Warranty

		<span className={styles.moreInfo}>
		    {product.warranty}
		</span>
	    </div>
	</div>
    );
}

export default ProductDetails;
