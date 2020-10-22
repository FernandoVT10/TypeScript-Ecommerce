import React, { useRef, useState } from "react";

import styles from "./Carousel.module.scss";

export interface CarouselProps {
    _id: string,
    image: string,
    link: string
}

function Carousel({ carouselItems }: { carouselItems: CarouselProps[] }) {
    const [itemActive, setItemActive] = useState(0);
    const carouselDirection = useRef("left");

    const handleLeftControl = () => {
        if(itemActive > 0) {
            setItemActive(itemActive - 1);
        } else {
            setItemActive(carouselItems.length - 1);
        }

        carouselDirection.current = "left";
    }

    const handleRightControl = () => {
        if(itemActive === carouselItems.length - 1) {
            setItemActive(0);
        } else {
            setItemActive(itemActive + 1);
        }

        carouselDirection.current = "right";
    }

    const handleIndicator = itemIndex => {
        if(itemIndex > itemActive) {
            carouselDirection.current = "right";
        } else {
            carouselDirection.current = "left";
        }

        setItemActive(itemIndex);
    }

    if(!carouselItems.length) {
        return null;
    }

    return (
        <div className={styles.carousel}>
            <div className={styles.items}>
                {carouselItems.map((item, index) => {
                    const itemClass = itemActive === index ? styles.active : "";
                    const itemDirection = carouselDirection.current === "left" ? "" : styles.right;

                    return (
                        <a href={item.link} key={index}>
                            <img
                            className={`${styles.item} ${itemClass} ${itemDirection}`}
                            srcSet={`
                                /img/carousel/small-${item.image} 500w,
                                /img/carousel/medium-${item.image} 1024w,
                                /img/carousel/large-${item.image} 1920w
                            `}
                            alt="Carousel Image"/>
                        </a>
                    );
                })}
            </div>

            <button
            className={styles.control}
            data-testid="carousel-button"
            onClick={handleLeftControl}>
                <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button
            className={`${styles.control} ${styles.rightControl}`}
            data-testid="carousel-button"
            onClick={handleRightControl}>
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>

            <div className={styles.indicators}>
                {carouselItems.map((_, index) => {
                    const indicatorClass = itemActive === index ? styles.active : "";

                    return (
                        <span
                        className={`${styles.indicator} ${indicatorClass}`}
                        data-testid="carousel-indicator"
                        onClick={() => handleIndicator(index)}
                        key={index}></span>
                    );
                })}
            </div>
        </div>
    );
}

export default Carousel;