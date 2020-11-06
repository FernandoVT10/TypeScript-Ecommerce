import React from "react";

import ProductItem, { ProductItemProps } from "./ProductItem";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import styles from "./ShoppingCart.module.scss";

export interface ShoppingCartProps {
    products: ProductItemProps["product"][]
}

function ShoppingCart({ products }: ShoppingCartProps) {
    return (
	<div>
	    <Navbar/>'

	    <div className="wrapper">
		<div className={`container ${styles.shoppingCart}`}>
		    <h3 className="subtitle">Shopping Cart</h3>

		    <div className={styles.productList}>
			{products.map((product, index) => {
			    return <ProductItem product={product} key={index}/>;
			})}

			<div className={styles.totalPrice}>
			    <span className={styles.label}>Total</span>
			    <span className={styles.price}>$ 16 382</span>
			</div>
		    </div>

		    <button className={`continue-button ${styles.continueButton}`}>
			Continue
			<i className="fas fa-arrow-right" aria-hidden="true"></i>
		    </button>
		</div>
	    </div>

	    <Footer/>
	</div>
    );
}

export default ShoppingCart;
