import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Dashboard/Layout";

import ApiController from "@/services/ApiController";

import ProductCard, { ProductCardProps } from "./ProductCard";
import Filter from "./Filter";

import styles from "./Products.module.scss";

type Products = Array<ProductCardProps["product"]>;

interface ApiResponse {
    data: {
	products: Products
    }
}

const Products = () => {
    const [products, setProducts] = useState<Products>([]);

    const router = useRouter();

    useEffect(() => {
	const getProducts = async () => {
	    const res = await ApiController.get<ApiResponse>(`products${window.location.search}`);

	    if(!res.data) return setProducts([]);
	    setProducts(res.data.products);
	}

	getProducts();
    }, [router.query]);

    return (
	<Layout>
	    <div className={styles.products}>
		<h3 className={styles.title}>Products</h3>

		<div className={styles.container}>
		    <div className={styles.filterOptions}>
			<Filter />
		    </div>

		    <div className={styles.products}>
			{products.map((product, index) => {
			    return <ProductCard product={product} key={index}/>;
			})}
		    </div>
		</div>
	    </div>
	</Layout>
    );
}

export default Products;
