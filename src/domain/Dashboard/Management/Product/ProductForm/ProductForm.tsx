import React from "react";

import Input from "@/components/Formulary/Input";
import Textarea from "@/components/Formulary/Textarea";

import { InputHadnlingResponse } from "@/hooks/useInputHandling";

import Carousel from "./Carousel";

interface ProductForm {
    images: Array<string>,
    titleHandler: InputHadnlingResponse<string>,
    priceHandler: InputHadnlingResponse<string>,
    discountHandler: InputHadnlingResponse<string>,
    inStockHandler: InputHadnlingResponse<string>,
    warrantyHandler: InputHadnlingResponse<string>
    descriptionHandler: InputHadnlingResponse<string>
}

import styles from "./ProductForm.module.scss";

const ProductForm = ({
    images,
    titleHandler,
    priceHandler,
    discountHandler,
    inStockHandler,
    warrantyHandler,
    descriptionHandler
}: ProductForm) => {
    return (
	<div className={styles.productForm}>
	    <div className={styles.carousel}>
		<Carousel images={images}/>
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

		    <button className={styles.discount}>{ discountHandler.value }%</button>

		    <input
			type="number"
			className={styles.discountInput}
			min={0}
			max={100}
			value={discountHandler.value}
			setValue={discountHandler.setValue}
		    />
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
	</div>
    );
}

export default ProductForm;
