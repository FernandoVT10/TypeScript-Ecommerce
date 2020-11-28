import React, { useEffect, useState } from "react";

import ProductItem, { ProductItemProps } from "./ProductItem";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import ShoppingCartController from "@/services/ShoppingCartController";
import { AddSpacesToNumber, getDiscountedPrice } from "@/services/FormatsForNumber";

import styles from "./ShoppingCart.module.scss";

function ShoppingCart() {
    const [products, setProducts] = useState<ProductItemProps["product"][]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
	async function getProducts() {
	    const products = await ShoppingCartController.getProductsFromServer<ProductItemProps["product"]>();

	    setLoading(false);
	    setProducts(products);
	}

	getProducts();
    }, [])

    const removeProductFromCart = (productId: string) => {
	ShoppingCartController.deleteItem(productId);

	setProducts(
	    products.filter(product => product._id !== productId)
	);
    }

    const updateQuantityOnCart = (productId: string, quantity: number) => {
	ShoppingCartController.updateItem(productId, quantity);

	setProducts(
	     products.map(product => {
		 if(product._id === productId) {
		     product.quantity = quantity;
		 }

		 return product;
	     })
	);
    }

    const totalPrice = products.reduce((acc, product) => {
	acc += getDiscountedPrice(product.price * product.quantity, product.discount);
	return acc;
    }, 0);

    return (
	<div>
	    <Navbar/>

	    <div className="wrapper">
		<div className={`container ${styles.shoppingCart}`}>
		    <h3 className="subtitle">Shopping Cart</h3>

		    { loading && 
			<div className={styles.loaderContainer}>
			    <span className={`loader ${styles.loader}`}></span>
			</div>
		    }

		    { products.length > 0 &&
			<div className={styles.productList}>
			    {products.map((product, index) => {
				return (
				    <ProductItem
				    product={product}
				    removeProductFromCart={removeProductFromCart}
				    updateQuantityOnCart={updateQuantityOnCart}
				    key={index}/>
				);
			    })}

			    <div className={styles.totalPrice}>
				<span className={styles.label}>Total</span>
				<span className={styles.price}>$ { AddSpacesToNumber(totalPrice) }</span>
			    </div>
			</div>
		    }

		    { products.length === 0 && !loading &&
			<div className={styles.emptyShoppingCart}>
			    There are not products in your shopping cart
			</div>
		    }

		    { products.length > 0 &&
			<button className={`continue-button ${styles.continueButton}`}>
			    Continue
			    <i className="fas fa-arrow-right" aria-hidden="true"></i>
			</button>
		    }
		</div>
	    </div>

	    <Footer/>
	</div>
    );
}

export default ShoppingCart;
