import React, { useState, useEffect } from "react";

import ApiController from "@/services/ApiController";

import CalificationStars from "@/components/CalificationStars";

import AddReview from "./AddReview";

import styles from "./ReviewsList.module.scss";

export interface Review {
    content: string,
    calification: number
}

const REVIEWS_PER_PAGE = 3;

function ReviewsList({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]); 
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [canLoadMoreReviews, setCanLoadMoreReviews] = useState(true);

    useEffect(() => {
	setLoading(true);

	ApiController.get<{ reviews: Review[] }>(`products/${productId}/reviews?limit=${REVIEWS_PER_PAGE}&offset=${offset}`)
	.then(res => {
	    if(res.data) {
		const newReviews = res.data.reviews;

		if(newReviews.length < REVIEWS_PER_PAGE) {
		    setCanLoadMoreReviews(false);
		}
		
		setReviews(prevReviews => [...prevReviews, ...newReviews]);
	    }

	    setLoading(false);
	});
    }, [offset]);

    const loaderClass = loading ? styles.active : "";
    const loadMoreReviewsClass = canLoadMoreReviews && !loading ? styles.active : "";

    return (
	<div className={styles.reviewsList}>
	    <div className={styles.addReview}>
		<AddReview setReviews={setReviews} productId={productId}/>
	    </div>

	    <div className={styles.reviews}>
		{reviews.map((review, index) => {
		    return (
			<div className={styles.review} key={index}>
			    <CalificationStars calification={review.calification}/>

			    <p className={styles.content}>{ review.content }</p>
			</div> 
		    );
		})}

		{reviews.length === 0 &&
		    <p className={styles.notAvailable}>There are no reviews to display</p>
		}
	    </div>

	    <div className={`${styles.loaderContainer} ${loaderClass}` }>
		<span className={`${styles.loader} loader`}></span>
	    </div>

	    <button
	    className={`${styles.loadMore} ${loadMoreReviewsClass}`}
	    onClick={() => setOffset(offset + REVIEWS_PER_PAGE)}>
		Load more reviews
	    </button>
	</div>
    );
}

export default ReviewsList;
