import React, { useEffect, useRef, useState } from "react";

import ProductCard, { ProductCardProps } from "@/components/ProductCard";

import styles from "./ProductsCarousel.module.scss";

const SCROLL_WIDTH = 1220;

function ProductsCarousel({ products }: { products: ProductCardProps[] }) {
    const [leftControlIsActive, setLeftControlIsActive] = useState(false);
    const [rightControlIsActive, setRightControlIsActive] = useState(false);
    const productsContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(productsContainer.current) {
            if(productsContainer.current.scrollWidth > SCROLL_WIDTH) {
                setRightControlIsActive(true);
            }
        }
    }, [productsContainer]);

    const scrollToLeft = () => {
        const container = productsContainer.current;
        const currentScrollPosition = container.scrollLeft - SCROLL_WIDTH;

        if(currentScrollPosition > 0) {
            setLeftControlIsActive(true);
        } else {
            setLeftControlIsActive(false);
        }

        setRightControlIsActive(true);

        container.scroll({
            left: currentScrollPosition,
            behavior: "smooth"
        });
    }

    const scrollToRight = () => {
        const container = productsContainer.current;
        const currentScrollPosition = container.scrollLeft + SCROLL_WIDTH;

        if(currentScrollPosition + SCROLL_WIDTH < container.scrollWidth) {
            setRightControlIsActive(true);
        } else {
            setRightControlIsActive(false);
        }

        setLeftControlIsActive(true);

        container.scroll({
            left: currentScrollPosition,
            behavior: "smooth"
        });
    }

    const leftControlClass = leftControlIsActive ? "" : styles.inactive;
    const rightControlClass = rightControlIsActive ? "" : styles.inactive;

    if(!products.length) {
        return (
            <div className={styles.notFound}>
                <h3>Products not available</h3>
            </div>
        );
    }

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
            onClick={scrollToLeft}>
                <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>

            <button
            className={`${styles.control} ${styles.rightControl} ${rightControlClass}`}
            data-testid="products-carousel-right-control"
            onClick={scrollToRight}>
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
    );
}

export default ProductsCarousel;