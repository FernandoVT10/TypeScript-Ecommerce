import React, {useContext, useState} from "react";
import { useRouter } from "next/router";

import AlertsContext from "@/contexts/AlertsContext";

import Layout from "@/components/Dashboard/Layout";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";

import ProductForm from "../ProductForm";

import styles from "./EditProduct.module.scss";

export interface EditProductProps {
    product: {
        _id: string,
	images: Array<string>,
	title: string,
	price: number,
	discount: number,
	inStock: number,
	warranty: string,
	description: string,
	categories: {
	    name: string
	}[]
    }
}

interface ApiResponse {
    error: string,
    message: string,
    data: {
        updatedProduct: EditProductProps["product"]
    }
}

const EditProduct = ({ product }: EditProductProps) => {
    const titleHandler = useInputHandling(product.title);
    const priceHandler = useInputHandling(product.price.toString());
    const discountHandler = useInputHandling(product.discount);
    const inStockHandler = useInputHandling(product.inStock.toString());
    const warrantyHandler = useInputHandling(product.warranty);
    const descriptionHandler = useInputHandling(product.description);

    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState(
	product.categories.map(caategory => caategory.name)
    );
    const [loading, setLoading] = useState(false);

    const alertOptions = useContext(AlertsContext);
    const router = useRouter();

    const handleEditProduct = async () => {
        const formData = new FormData;

        formData.append("title", titleHandler.value);
        formData.append("price", priceHandler.value);
        formData.append("discount", discountHandler.value.toString());
        formData.append("inStock", inStockHandler.value);
        formData.append("warranty", warrantyHandler.value);
        formData.append("description", descriptionHandler.value);

        deletedImages.forEach(deletedImage => formData.append("deletedImages", deletedImage));
        newImages.forEach(newImage => formData.append("newImages", newImage));

        setLoading(true);
        
        const res = await ApiController.put<ApiResponse>(`products/${product._id}`, {
            formData
        });

        setLoading(false);

        if(res.error) return alertOptions.createAlert("danger", res.message);

        router.push("/dashboard/management/products/");
    }

    return (
	<Layout>
	    <div className={styles.editProduct}>
		<ProductForm
		    images={product.images}
                    setNewImages={setNewImages}
                    setDeletedImages={setDeletedImages}
		    titleHandler={titleHandler}
		    priceHandler={priceHandler}
		    discountHandler={discountHandler}
		    inStockHandler={inStockHandler}
		    warrantyHandler={warrantyHandler}
		    descriptionHandler={descriptionHandler}
		    selectedCategories={selectedCategories}
		    setSelectedCategories={setSelectedCategories}
                    handleOnSubmit={handleEditProduct}
                    loading={loading}
		/>
	    </div>
	</Layout>
    );
}

export default EditProduct;
