import React from "react";

import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import Pagination, { PaginationProps } from "@/components/Pagination";

import styles from "./ProductList.module.scss";

export interface ProductListProps extends PaginationProps {
    products: ProductCardProps[]
}

function ProductList({ productsResponse }: { productsResponse: ProductListProps }) {
    const { products } = productsResponse;

    if(!products.length) {
        return (
            <h3 className={styles.notFound}>Results not found</h3>
        );
    }

    return (
        <div>
            <div className={styles.productList}>
                {products.map(product => {
                    return (
                        <div className={styles.product} key={product._id}>
                            <ProductCard product={product}/>
                        </div>
                    );
                })}
            </div>

            <Pagination pagination={productsResponse}/>
        </div>
    );
}

export default ProductList;