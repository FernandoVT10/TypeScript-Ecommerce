import React from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsCarousel, { ProductsCarouselProps } from "@/components/ProductsCarousel";

import ImagesCarousel, { ImagesCarouselProps } from "./ImagesCarousel";
import ProductDetails, { ProductDetailsProps } from "./ProductDetails";
import CalificationTable, { CalificationTableProps } from "./CalificationTable";
import ReviewsList from "./ReviewsList";

import styles from "./Product.module.scss";

export interface ProductProps {
    product: ProductDetailsProps["product"] & {
	_id: string,
	images: ImagesCarouselProps["images"],
	description: string
    },
    recommendedProducts: ProductsCarouselProps["products"],
    reviewsCount: CalificationTableProps["reviewsCount"]
}

function Product({ product, recommendedProducts, reviewsCount }: ProductProps) {
    return (
	<div>
	    <Navbar/>

	    <div className={`container ${styles.container}`}>
		<div className={styles.product}>
		    <div className={styles.imageCarousel}>
			<ImagesCarousel images={product.images}/>
		    </div>

		    <div className={styles.productDetails}>
			<ProductDetails product={product} totalReviews={ reviewsCount.totalReviews }/>
		    </div>

		    <div className={styles.description}>
			<h3 className={styles.subtitle}>Description</h3>
			<p className={styles.content}>
			    { product.description }
			</p>
		    </div>
		</div>

		<div className={styles.calificationTable}>
		    <CalificationTable calification={product.calification} reviewsCount={reviewsCount}/>
		</div>

		<ReviewsList productId={product._id}/>
	    </div>

	    {recommendedProducts.length > 0 &&
		<div className={`${styles.recommendedProducts} container`}>
		    <h3 className={`${styles.subtitle} subtitle`}>Products that may interest you</h3>

		    <ProductsCarousel products={recommendedProducts} />
		</div>
	    }

	    <Footer/>
	</div>
    );
}

export default Product;
