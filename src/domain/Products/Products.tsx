import React, {useEffect, useState} from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import ProductList, { ProductListProps } from "./ProductList";
import SearchDetails, { SearchDetailsProps } from "./SearchDetails";
import { useRouter } from "next/router";

import styles from "./Products.module.scss";

export interface ProductsProps {
    productsResponse: ProductListProps & {
        totalProducts: SearchDetailsProps["totalProducts"]
    },
    categories: SearchDetailsProps["categories"]
}

function Products({ productsResponse, categories }: ProductsProps) {
    const [productNotFound, setProductNotFound] = useState(false);

    const router = useRouter();

    useEffect(() => {
	const hash = router.asPath.split("#")[1];

	if(hash === "product_not_found") {
	    setProductNotFound(true);
	}
    }, [router.asPath])

    return (
        <div>
            <Navbar/>

            <div className="wrapper">
		{ productNotFound &&
		    <div className={`container ${styles.productNotFound}`}>
			The product you are looking for doesn't exists
		    </div>
		}

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
