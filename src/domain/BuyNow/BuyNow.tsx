import React, { useEffect, useState } from "react";

import { AddSpacesToNumber, getDiscountedPrice } from "@/services/FormatsForNumber";
import ShoppingCartController from "@/services/ShoppingCartController";

import ProductCard, { ProductCardProps } from "./ProductCard";
import ShippingOptions from "./ShippingOptions";
import BuyButton from "./BuyButton";

import styles from "./BuyNow.module.scss";

function BuyNow ({ paypalClientId }: { paypalClientId: string }) {
    const [products, setProducts] = useState<ProductCardProps["product"][]>([]);

    useEffect(() => {
	async function getProducts () {
	    const products = await ShoppingCartController.getProductsFromServer<ProductCardProps["product"]>();

	    setProducts(products);
	}

	getProducts();
    }, []);

    const total = products.reduce((acc, product) => {
	const discountedPrice = getDiscountedPrice(product.price, product.discount);
	return acc + discountedPrice * product.quantity;
    }, 0)

    return (
	<div className={`container ${styles.buyNow}`}>
	    <div className={styles.shippingOptions}>
		<ShippingOptions/>
	    </div>

	    <div className={styles.productList}>
		{products.map((product, index) => {
		    return <ProductCard product={product} key={index}/>;
		})}

		<div className={styles.total}>
		    <span>Total</span>
		    <span>$ { AddSpacesToNumber(total) }</span>
		</div>
	    </div>

	    { /* <BuyButton paypalClientId={paypalClientId}/> */ }
	</div>
    );
}

export default BuyNow;
