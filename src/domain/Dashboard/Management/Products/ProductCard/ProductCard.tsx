import React, { useContext, useState } from "react";

import Link from "next/link";

import AlertsContext from "@/contexts/AlertsContext";

import ConfimationModal from "@/components/ConfirmationModal";

import ApiController from "@/services/ApiController";
import { AddSpacesToNumber, getDiscountedPrice } from "@/services/FormatsForNumber";

import styles from "./ProductCard.module.scss";

interface Product {
    _id: string,
    title: string,
    images: Array<string>,
    price: number,
    discount: number,
    inStock: number
}

export interface ProductCardProps {
    product: Product,
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

interface APIResponse {
    error: string,
    message: string
}

const ProductCard = ({ product, setProducts }: ProductCardProps) => {
    const [isActiveConfirmModal, setIsActiveConfirmModal] = useState(false);

    const alertsController = useContext(AlertsContext);

    const deleteProduct = async () => {
        const res = await ApiController.delete<APIResponse>(`products/${product._id}`);

        if(res.error) return alertsController.createAlert("danger", res.message);

        alertsController.createAlert("success", "The product has been deleted successfully");
        setProducts(products => products.filter(
            localProduct => localProduct._id !== product._id
        ));
    }

    const discountedPrice = getDiscountedPrice(product.price, product.discount);

    return (
	<div className={styles.productCard}>
            <ConfimationModal
                isActive={isActiveConfirmModal}
                setIsActive={setIsActiveConfirmModal}
                message={`Are you sure to delete ${product.title}?`}
                onConfirm={deleteProduct}
            />

	    <div className={styles.detailsContainer}>
		<img
		src={`/img/products/thumb-${product.images[0]}`}
		className={styles.image}
		alt="Product Card Image" />

		<div className={styles.details}>
		    <p className={styles.inStock}>In Stock: { product.inStock }</p>

		    <Link href={`/products/${product._id}`}>
			<a className={styles.title}>
			    { product.title }
			</a>
		    </Link>

		    <div className={styles.options}>
                        <button className={styles.option} onClick={() => setIsActiveConfirmModal(true)}>
		    	    Delete
		    	</button>

			<Link href={`/dashboard/management/products/${product._id}/edit`}>
			    <button className={styles.option}>
				Edit
			    </button>
			</Link>
		    </div>
		</div>
	    </div>

	    <div className={styles.priceContainer}>
		{ product.discount > 0 &&
		    <p className={styles.discount}>%{ product.discount }</p>
		}

		<div className={styles.price}>
		    <p className={styles.discountedPrice}>$ { AddSpacesToNumber(discountedPrice) }</p>

		    { product.discount > 0 &&
			<s className={styles.notDicountedPrice}>$ { product.price }</s>
		    }
		</div>
	    </div>
	</div>
    );
}

export default ProductCard;
