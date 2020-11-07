import React, { useState } from "react";
import { useRouter } from "next/router";

import SelectQuantity, { SelectQuantityProps } from "./SelectQuantity";

import CalificationStars from "@/components/CalificationStars";

import AddSpacesToNumber from "@/services/AddSpacesToNumber";
import ShoppingCartController from "@/services/ShoppingCartController";

import styles from "./ProductDetails.module.scss";

export interface ProductDetailsProps {
    product: {
	_id: string,
	title: string,
	calification: number,
	price: number,
	inStock: SelectQuantityProps["inStock"],
	discount: number,
	arrivesIn: string,
	warranty: string
    },
    totalReviews: number
}

function ProductDetails({ product, totalReviews }: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1);

    const router = useRouter();

    const handleAddToShoppingCart = () => {
	ShoppingCartController.setItem({
	    productId: product._id,
	    quantity
	});

	router.push("/cart/");
    }

    const discountedPrice = product.price * (product.discount / 100);

    return (
	<div className={styles.productDetails}>
	    <h3 className={styles.title}>{ product.title }</h3>

	    <div className={styles.calification}>
		<CalificationStars calification={product.calification}/>
		<span className={styles.reviews}>{ totalReviews } reviews</span>
	    </div>

	    {product.discount > 0 ?
		<div className={styles.priceContainer}>
		    <span className={styles.price}>$ { AddSpacesToNumber(discountedPrice) }</span>
		    <s className={styles.oldPrice}>$ { AddSpacesToNumber(product.price) }</s>
		    <span className={styles.discount}>%{ product.discount } OFF</span>
		</div>
	    :
		<div className={styles.priceContainer}>
		    <span className={styles.price}>$ { AddSpacesToNumber(product.price) }</span>
		</div>
	    }

	    <SelectQuantity quantity={quantity} setQuantity={setQuantity} inStock={product.inStock}/>

	    <button className="submit-button">Buy Now</button>

	    <button
	    className="submit-button secondary"
	    onClick={handleAddToShoppingCart}>
		Add to Shopping Cart
	    </button>

	    <div className={styles.info}>
		<i className="fas fa-truck" aria-hidden="true"></i>
		Arrives free in { product.arrivesIn }

		<span className={styles.moreInfo}>
		    The product arrives in { product.arrivesIn } approximately
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
		    { product.warranty }
		</span>
	    </div>
	</div>
    );
}

export default ProductDetails;
