import React from "react";

import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import Pagination, { PaginationProps } from "@/components/Pagination";

import styles from "./ProductList.module.scss";

interface ProductListProps {
    products: ProductCardProps[],
    pagination: PaginationProps
}

function ProductList({ products, pagination }: ProductListProps) {
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

            <Pagination pagination={pagination}/>
        </div>
    );
}

export default ProductList;