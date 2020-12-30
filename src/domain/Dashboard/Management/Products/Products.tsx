import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Dashboard/Layout";
import Pagination, { PaginationProps } from "@/components/Pagination";

import ApiController from "@/services/ApiController";

import ProductCard, { ProductCardProps } from "./ProductCard";
import Filter from "./Filter";

import styles from "./Products.module.scss";

type Products = Array<ProductCardProps["product"]>;

interface ApiResponse {
    data: {
	products: Products,
	totalProducts: number
    } & PaginationProps
}

const Products = () => {
    const [products, setProducts] = useState<Products>([]);
    const [pagination, setPagination] = useState<PaginationProps>(null);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
	const getProducts = async () => {
	    setLoading(true);

	    const res = await ApiController.get<ApiResponse>(`products${window.location.search}`);

	    setLoading(false);

	    if(!res.data) return setProducts([]);

	    setProducts(res.data.products);
	    setTotalProducts(res.data.totalProducts);
	    setPagination(res.data);
	}

	getProducts();
    }, [router.query]);

    return (
	<Layout>
	    <div className={styles.products}>
		<h3 className={styles.title}>Products</h3>

		<div className={styles.container}>
		    <div className={styles.filterOptions}>
			<Filter totalProducts={totalProducts} />
		    </div>

		    { loading && 
			<div className={styles.loaderContainer}>
			    <span className="loader"></span>
			</div>
		    }

		    { products.length === 0 && !loading &&
			<div className={styles.notFound}>
			    Products not found
			</div>
		    }

		    { !loading && 
			<div className={styles.products}>
			    {products.map((product, index) => {
				return <ProductCard product={product} key={index}/>;
			    })}
			</div>
		    }

		    { pagination && !loading && products.length > 0 &&
			<div className={styles.pagination}>
			    <Pagination pagination={pagination}/>
			</div>
		    }
		</div>
	    </div>
	</Layout>
    );
}

export default Products;
