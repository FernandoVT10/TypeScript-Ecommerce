import React from "react";
import Link from "next/link";

import AddSpacesToNumber from "@/services/AddSpacesToNumber";

import styles from "./ProductCard.module.scss";

export interface ProductCardProps {
    _id: string,
    images: string[],
    title: string,
    price: number,
    discount: number,
    description: string
}

function ProductCard({ product }: { product: ProductCardProps }) {
    return (
        <div className={styles.productCard}>
            <Link href={`/products/${product._id}`}>
                <a>
                    {product.discount > 0 &&
                        <span className={styles.discount}>
                            { product.discount }%
                        </span>
                    }

                    <img
                    className={styles.image}
                    src={`/img/products/thumb-${product.images[0]}`}
                    loading="lazy"
                    alt={product.title}/>

                    <div className={styles.hoverContainer}>
                        <p className={styles.title}>
                            { product.title }
                        </p>

                        <p className={styles.description}>
                            { product.description }
                        </p>
                    </div>

                    <div className={styles.footer}>
                        <span className={styles.title}>
                            { product.title.slice(0, 12) }
                        </span>
                        <span className={styles.price}>
                            $ { AddSpacesToNumber(product.price) }
                        </span>
                    </div>
                </a>
            </Link>
        </div>
    );
}

export default ProductCard;