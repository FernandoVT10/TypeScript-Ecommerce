import React from "react";

import Navbar from "@/components/Navbar";

import ImagesCarousel, { ImagesCarouselProps } from "./ImagesCarousel";
import ProductDetails, { ProductDetailsProps } from "./ProductDetails";

import styles from "./Product.module.scss";

export interface ProductProps {
    product: ProductDetailsProps["product"] & {
	images: ImagesCarouselProps["images"],
	description: string
    }
}

function Product({ product }: ProductProps) {
    return (
	<div>
	    <Navbar/>

	    <div className={`container ${styles.container}`}>
		<div className={styles.product}>
		    <div className={styles.imageCarousel}>
			<ImagesCarousel images={product.images}/>
		    </div>
		    <div className={styles.productDetails}>
			<ProductDetails product={product}/>
		    </div>
		    <div className={styles.description}>
			<h3 className={styles.subtitle}>Description</h3>
			<p className={styles.content}>
			    { product.description }
			</p>
		    </div>
		</div>
	    </div>
	</div>
    );
}

export default Product;
