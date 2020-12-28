import React, { useEffect, useState } from "react";

import Layout from "@/components/Dashboard/Layout";

import ApiController from "@/services/ApiController";

import ProductCard, { ProductCardProps } from "./ProductCard";

import styles from "./Products.module.scss";

type Products = Array<ProductCardProps["product"]>;

interface ApiResponse {
    data: {
	products: Products
    }
}

const Products = () => {
    const [products, setProducts] = useState<Products>([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
	const getProducts = async () => {
	    const res = await ApiController.get<ApiResponse>("products");
	    const c = await ApiController.get<any>("categories");
	    setCategories(c.data.categories);

	    if(!res.data) return setProducts([]);

	    setProducts(res.data.products);
	}

	getProducts();
    }, []);

    return (
	<Layout>
	    <div className={styles.products}>
		<h3 className={styles.title}>Products</h3>

		<div className={styles.container}>
		    <div className={styles.filterOptions}>
			<form>
			    <div className={`${styles.searchProduct} search-input`}>
				<input
				type="search"
				name="search"
				placeholder="Search a product"
				autoComplete="search"/>

				<button type="submit">
				    <i className="fas fa-search" aria-hidden="true"></i>
				</button>
			    </div>
			    <span className={styles.totalProducts}>97 products</span>

			    <button type="button" className={styles.filterButton}>
				Filter
			    	<i className="fas fa-sort-amount-down-alt" aria-hidden="true"></i>
			    </button>

			    <div className={styles.filter}>
			    	<div className={styles.categoriesFilter}>
			    	    <p className={styles.subtitle}>Categories</p>

				    <div className={styles.categories}>
					{categories.map((category, index) => {
					    return (
					    	<button type="button" className={styles.category} key={index}>
						    { category.name }
					    	</button>
					    );
					})}
				    </div>
			    	</div>

				<div className={styles.pageFilter}>
				    <p className={styles.subtitle}>Products per page</p>

				    <input type="range" className={styles.rangeInput} min={1} max={25}  />
				    <span className={styles.rangeValue}>20 / 25</span>
				</div>
			    </div>
			</form>
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
