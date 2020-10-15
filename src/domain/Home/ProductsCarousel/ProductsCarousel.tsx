import React, { useEffect, useRef, useState } from "react";

import ProductCard, { ProductCardProps } from "@/components/ProductCard";

import styles from "./ProductsCarousel.module.scss";

function ProductsCarousel({ products }: { products: ProductCardProps[] }) {
    const [leftControlIsActive, setLeftControlIsActive] = useState(false);
    const [rightControlIsActive, setRightControlIsActive] = useState(false);
    const productsContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(productsContainer.current) {
            if(productsContainer.current.scrollWidth > 1200) {
                setRightControlIsActive(true);
            }
        }
    }, [productsContainer]);

    const handleCarouselScroll = (direction: number) => {
        const container = productsContainer.current;
        const scrollPosition = container.scrollLeft + 1220 * direction;

        if(scrollPosition > 0) {
            setLeftControlIsActive(true);
        } else {
            setLeftControlIsActive(false);
        }

        if(scrollPosition + 1200 < container.scrollWidth) {
            setRightControlIsActive(true);
        } else {
            setRightControlIsActive(false);
        }

        container.scroll({
            left: scrollPosition,
            behavior: "smooth"
        });
    }

    const leftControlClass = leftControlIsActive ? "" : styles.inactive;
    const rightControlClass = rightControlIsActive ? "" : styles.inactive;

    return (
        <div className={styles.productsCarousel}>
            <div
            className={styles.products}
            data-testid="products-carousel-products-container"
            ref={productsContainer}>
                {products.map(product => {
                    return (
                        <div className={styles.product} key={product._id}>
                            <ProductCard product={product}/>
                        </div>
                    );
                })}
            </div>

            <button
            className={`${styles.control} ${leftControlClass}`}
            data-testid="products-carousel-left-control"
            onClick={() => handleCarouselScroll(-1)}>
                <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>

            <button
            className={`${styles.control} ${styles.rightControl} ${rightControlClass}`}
            data-testid="products-carousel-right-control"
            onClick={() => handleCarouselScroll(1)}>
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
    );
}

export default ProductsCarousel;