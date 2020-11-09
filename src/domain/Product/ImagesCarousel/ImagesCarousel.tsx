import React, { useState } from "react";

import styles from "./ImagesCarousel.module.scss";

export interface ImagesCarouselProps {
    images: string[]
}

function ImagesCarousel({ images }: ImagesCarouselProps) {
    const [imageActive, setImageActive] = useState(0);

    const activeImageName = images[imageActive];

    return (
	<div className={styles.imagesCarousel}>
	    <div className={styles.imageList}>
		{images.map((image, index) => {
		    const imageClass = imageActive === index ? styles.active : "";

		    return (
			<img
			className={`${styles.image} ${imageClass}`}
			src={`/img/products/thumb-${image}`}
			onClick={() => setImageActive(index)}
			alt="Product Carousel Image"
			key={index}/>
		    );
		})}
	    </div>
	    <div className={styles.activeImageContainer}>
		<img
		className={styles.activeImage}
		srcSet={`
		    /img/products/medium-${activeImageName} 1024w,
		    /img/products/large-${activeImageName} 1920w
		`}
		alt="Product Carousel Image Active"/>
	    </div>
	</div>
    );
}

export default ImagesCarousel;
