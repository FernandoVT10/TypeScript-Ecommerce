import React from "react";

import Layout from "@/components/Dashboard/Layout";

import useInputHandling from "@/hooks/useInputHandling";

import ProductForm from "../ProductForm";

import styles from "./EditProduct.module.scss";

export interface EditProductProps {
    product: {
	images: Array<string>,
	title: string,
	price: number,
	discount: number,
	inStock: number,
	warranty: string,
	description: string
    }
}

const EditProduct = ({ product }: EditProductProps) => {
    const titleHandler = useInputHandling(product.title);
    const priceHandler = useInputHandling(product.price.toString());
    const discountHandler = useInputHandling(product.discount.toString());
    const inStockHandler = useInputHandling(product.inStock.toString());
    const warrantyHandler = useInputHandling(product.warranty);
    const descriptionHandler = useInputHandling(product.description);

    return (
	<Layout>
	    <div className={styles.editProduct}>
		<ProductForm
		    images={product.images}
		    titleHandler={titleHandler}
		    priceHandler={priceHandler}
		    discountHandler={discountHandler}
		    inStockHandler={inStockHandler}
		    warrantyHandler={warrantyHandler}
		    descriptionHandler={descriptionHandler}
		/>
	    </div>
	</Layout>
    );
}

export default EditProduct;
