import React, { useState } from "react";
import Link from "next/link";

import Input from "@/components/Formulary/Input";
import Textarea from "@/components/Formulary/Textarea";

import { InputHadnlingResponse } from "@/hooks/useInputHandling";

import { AddSpacesToNumber, getDiscountedPrice } from "@/services/FormatsForNumber";

import Carousel from "./Carousel";
import Categories from "./Categories";

import styles from "./ProductForm.module.scss";

interface ProductForm {
    images: Array<string>,
    setNewImages: React.Dispatch<React.SetStateAction<File[]>>,
    setDeletedImages: React.Dispatch<React.SetStateAction<string[]>>,
    titleHandler: InputHadnlingResponse<string>,
    priceHandler: InputHadnlingResponse<string>,
    discountHandler: InputHadnlingResponse<number>,
    inStockHandler: InputHadnlingResponse<string>,
    warrantyHandler: InputHadnlingResponse<string>
    descriptionHandler: InputHadnlingResponse<string>,
    selectedCategories: string[],
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>,
    handleOnSubmit: () => void,
    loading: boolean
}

const ProductForm = ({
    images,
    setNewImages,
    setDeletedImages,
    titleHandler,
    priceHandler,
    discountHandler,
    inStockHandler,
    warrantyHandler,
    descriptionHandler,
    selectedCategories,
    setSelectedCategories,
    handleOnSubmit,
    loading
}: ProductForm) => {
    const [isActiveDiscountInput, setIsActiveDiscountInput] = useState(false);

    const handleDiscount = (value: string) => {
	const discount = parseInt(value) || 0;

	if(discount <= 0) {
	    return discountHandler.setValue(0);
	}

	if(discount > 100) {
	    return discountHandler.setValue(100);
	}

	discountHandler.setValue(discount);
    }

    const handleOnClick = () => {
        let error = false;

        window.scroll(0, 0);

        if(!titleHandler.value) {
            titleHandler.setError("The title is required");
            error = true;
        }

        if(!priceHandler.value) {
            priceHandler.setError("The price is required");
            error = true;
        }

        if(!inStockHandler.value) {
            inStockHandler.setError("The stock is required");
            error = true;
        }

        if(!warrantyHandler.value) {
            warrantyHandler.setError("The warranty is required");
            error = true;
        }

        if(!descriptionHandler.value) {
            descriptionHandler.setError("The description is required");
            error = true;
        }

        if(error) return;

        handleOnSubmit();
    }

    const price = parseInt(priceHandler.value) || 0;
    const discountedPrice = getDiscountedPrice(price, discountHandler.value);

    return (
	<div className={styles.productForm}>
            { loading &&
                <div className={styles.loaderContainer}>
                    <span className="loader"></span>
                </div>
            }

	    <div className={styles.carousel}>
		<Carousel 
                    images={images}
                    setNewImages={setNewImages}
                    setDeletedImages={setDeletedImages}
                />
	    </div>

	    <div className={styles.productDetails}>
		<div className={styles.title}>
		    <Input
			type="text"
			id="title"
			name="title"
			label="Title"
			value={titleHandler.value}
			setValue={titleHandler.setValue}
			errorMessage={titleHandler.error}
		    />
		</div>

		<div className={styles.price}>
		    <div className={styles.input}>
			<Input
			    type="number"
			    id="price"
			    name="price"
			    label="Price"
			    value={priceHandler.value}
			    setValue={priceHandler.setValue}
			    errorMessage={priceHandler.error}
			/>
		    </div>

		    <div className={styles.discountContainer}>
			<button
			    className={styles.discount}
			    onClick={() => setIsActiveDiscountInput(true)}
			>
			    { discountHandler.value }%
			</button>

			{ isActiveDiscountInput && 
			    <input
				type="number"
				className={styles.discountInput}
				value={discountHandler.value}
				onChange={({ target: { value } }) => handleDiscount(value)}
				onBlur={() => setIsActiveDiscountInput(false)}
				autoFocus
			    />
			}
		    </div>

		    { discountHandler.value > 0 &&
			<span className={styles.discountedPrice}>
			    $ { AddSpacesToNumber(discountedPrice) }
			</span>
		    }
		</div>

		<div className={styles.inStock}>
		    <Input
			type="number"
			id="inStock"
			name="inStock"
			label="In Stock"
			value={inStockHandler.value}
			setValue={inStockHandler.setValue}
			errorMessage={inStockHandler.error}
		    />
		</div>

		<div className={styles.warranty}>
		    <Textarea
			id="warranty"
			label="Warranty"
			maxLength={250}
			name="warranty"
			value={warrantyHandler.value}
			setValue={warrantyHandler.setValue}
			errorMessage={warrantyHandler.error}
		    />
		</div>
	    </div>

	    <div className={styles.description}>
		<Textarea
		    id="description"
		    label="Description"
		    maxLength={1000}
		    name="description"
		    value={descriptionHandler.value}
		    setValue={descriptionHandler.setValue}
		    errorMessage={descriptionHandler.error}
		/>
	    </div>

	    <div className={styles.categories}>
		<Categories
		    selectedCategories={selectedCategories}
		    setSelectedCategories={setSelectedCategories}
		/>
	    </div>

            <div className={styles.buttonsContainer}>
                <button
                    className={`${styles.button} submit-button`}
                    onClick={handleOnClick}
                >
                    Save Changes
                </button>

                <Link href="/dashboard/management/products">
                    <button className={`${styles.button} submit-button secondary`}>Cancel</button>
                </Link>
            </div>
	</div>
    );
}

export default ProductForm;
