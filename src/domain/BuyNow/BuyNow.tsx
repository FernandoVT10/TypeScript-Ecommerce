import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { AddSpacesToNumber, getDiscountedPrice } from "@/services/FormatsForNumber";
import ShoppingCartController from "@/services/ShoppingCartController";

import ProductCard, { ProductCardProps } from "./ProductCard";
import ShippingOptions from "./ShippingOptions";
import BuyButton from "./BuyButton";

import styles from "./BuyNow.module.scss";
import ApiController from "@/services/ApiController";

type Product = ProductCardProps["product"];

interface APIResponse {
    data: {
        product: Product
    }
}

function BuyNow ({ paypalClientId }: { paypalClientId: string }) {
    const [products, setProducts] = useState<ProductCardProps["product"][]>([]);
    const [addressId, setAddressId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
	async function getProducts () {
            if(router.query.product) {
                const res = await ApiController.get<APIResponse>(`products/${router.query.product}`);

                if(res.data) {
                    const { product } = res.data;
                    product.quantity = 1;

                    return setProducts([ product ]);
                }
            }

	    const products = await ShoppingCartController.getProductsFromServer<Product>();

	    if(!products.length) {
		router.push("/cart/");
	    }

	    setProducts(products);
	}

	getProducts();
    }, []);

    const total = products.reduce((acc, product) => {
	const discountedPrice = getDiscountedPrice(product.price, product.discount);
	return acc + discountedPrice * product.quantity;
    }, 0);

    const isReadyToPay = addressId.length > 0;

    const buyNowContainerClass = isReadyToPay ? styles.readyToPay : "";

    return (
	<div className={`container ${styles.buyNow} ${buyNowContainerClass}`}>
	    { addressId.length === 0 &&
		<div className={styles.shippingOptions}>
		    <ShippingOptions setAddressId={setAddressId}/>
		</div>
	    }

	    <div className={styles.productList}>
		{products.map((product, index) => {
		    return <ProductCard product={product} key={index}/>;
		})}

		<div className={styles.total}>
		    <span>Total</span>
		    <span>$ { AddSpacesToNumber(total) }</span>
		</div>

		{ errorMessage.length > 0 &&
		    <p className={styles.errorMessage}>
			{ errorMessage }
		    </p>
		}

		{ isReadyToPay && 
		    <div className={styles.buyButton}>
			<BuyButton
			paypalClientId={paypalClientId}
			addressId={addressId}
			setErrorMessage={setErrorMessage}
			setLoading={setLoading}/>
		    </div>
		}

		{ loading &&
		    <div className={styles.loaderContainer}>
			<span className="loader"></span>
		    </div>
		}
	    </div>
	</div>
    );
}

export default BuyNow;
