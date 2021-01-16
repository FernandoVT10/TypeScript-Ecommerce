import React, {useContext, useState} from "react";
import { useRouter } from "next/router";

import AlertsContext from "@/contexts/AlertsContext";

import Layout from "@/components/Dashboard/Layout";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";

import ProductForm from "../ProductForm";

interface Product {
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

interface ApiResponse {
    error: string,
    message: string,
    data: {
        createdProduct: Product
    }
}

const CreateProduct = () => {
    const titleHandler = useInputHandling("");
    const priceHandler = useInputHandling("");
    const discountHandler = useInputHandling(0);
    const inStockHandler = useInputHandling("");
    const warrantyHandler = useInputHandling("");
    const descriptionHandler = useInputHandling("");

    const [newImages, setNewImages] = useState<File[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

        newImages.forEach(newImage => formData.append("images", newImage));
        selectedCategories.forEach(selectedCategory => formData.append("categories", selectedCategory));

        if(!newImages.length) return alertOptions.createAlert("danger", "An image is required");

        setLoading(true);
        
        const res = await ApiController.post<ApiResponse>(`products`, {
            formData
        });

        setLoading(false);

        if(res.error) return alertOptions.createAlert("danger", res.message);

        router.push("/dashboard/management/products/");
    }

    return (
	<Layout>
            <ProductForm
                images={[]}
                setNewImages={setNewImages}
                setDeletedImages={null}
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
	</Layout>
    );
}

export default CreateProduct;
