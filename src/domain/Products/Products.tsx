import React from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import ProductList, { ProductListProps } from "./ProductList";
import SearchDetails, { SearchDetailsProps } from "./SearchDetails";

import styles from "./Products.module.scss";

export interface ProductsProps {
    productsResponse: ProductListProps & {
        totalProducts: SearchDetailsProps["totalProducts"]
    },
    categories: SearchDetailsProps["categories"]
}

function Products({ productsResponse, categories }: ProductsProps) {
    return (
        <div>
            <Navbar/>

            <div className="wrapper">
                <div className={`container ${styles.container}`}>
                    <div className={styles.searchDetailsContainer}>
                        <SearchDetails
                        totalProducts={productsResponse.totalProducts}
                        categories={categories}/>
                    </div>

                    <div className={styles.productsWrapper}>
                        <ProductList productsResponse={productsResponse}/>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default Products;