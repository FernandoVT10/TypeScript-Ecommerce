import React from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PaginationProps } from "@/components/Pagination";
import { ProductCardProps } from "@/components/ProductCard";

import ProductList from "./ProductList";
import SearchDetails, { Category } from "./SearchDetails";

import styles from "./Products.module.scss";

interface ProductsProps {
    products: ProductCardProps[],
    totalResults: number,
    pagination: PaginationProps,
    categories: Category[]
}

function Products({ products, totalResults, pagination, categories }: ProductsProps) {
    return (
        <div>
            <Navbar/>

            <div className="wrapper">
                <div className={`container ${styles.container}`}>
                    <div className={styles.searchDetailsContainer}>
                        <SearchDetails totalResults={totalResults} categories={categories}/>
                    </div>

                    <div className={styles.productsWrapper}>
                        <ProductList products={products} pagination={pagination}/>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default Products;