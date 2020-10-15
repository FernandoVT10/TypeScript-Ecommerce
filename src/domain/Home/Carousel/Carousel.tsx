import React, { useRef, useState } from "react";

import styles from "./Carousel.module.scss";

export interface CarouselProps {
    _id: string,
    image: string,
    link: string
}

function Carousel({ carouselData }: { carouselData: CarouselProps[] }) {
    const [itemActive, setItemActive] = useState(0);
    const carouselDirection = useRef("left");

    const handleControl = (num: number) => {
        if(itemActive + num < 0) {
            setItemActive(carouselData.length - 1);
        } else if(itemActive + num > carouselData.length - 1) {
            setItemActive(0);
        } else {
            setItemActive(itemActive + num);
        }

        if(num > 0) {
            carouselDirection.current = "right";
        } else {
            carouselDirection.current = "left";
        }
    }

    const handleIndicator = itemIndex => {
        if(itemIndex > itemActive) {
            carouselDirection.current = "right";
        } else {
            carouselDirection.current = "left";
        }

        setItemActive(itemIndex);
    }

    return (
        <div className={styles.carousel}>
            <div className={styles.items}>
                {carouselData.map((item, index) => {
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
            onClick={() => handleControl(-1)}>
                <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button
            className={`${styles.control} ${styles.rightControl}`}
            data-testid="carousel-button"
            onClick={() => handleControl(1)}>
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>

            <div className={styles.indicators}>
                {carouselData.map((_, index) => {
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