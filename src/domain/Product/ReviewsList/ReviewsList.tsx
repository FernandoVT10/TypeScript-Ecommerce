import React, { useState, useEffect } from "react";

import ApiController from "@/services/ApiController";

import CalificationStars from "@/components/CalificationStars";

import AddReview from "./AddReview";

import styles from "./ReviewsList.module.scss";

export interface Review {
    content: string,
    calification: number
}

interface APIResponses {
    getReviews: {
	data: {
	    reviews: Review[]
	}
    },
    userStatus: {
	data: {
	    canWriteAReview: boolean
	}
    }
}

const REVIEWS_PER_PAGE = 3;

function ReviewsList({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]); 
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [canLoadMoreReviews, setCanLoadMoreReviews] = useState(true);

    const [canWriteAReview, setCanWriteAReview] = useState(false);

    useEffect(() => {
    	const getUserStatus = async () => {
	    const res = await ApiController.get<APIResponses["userStatus"]>(
		`products/${productId}/reviews/userStatus`
	    );

	    if(!res.data) return;

	    setCanWriteAReview(res.data.canWriteAReview);
    	}

	getUserStatus();
    }, []);

    useEffect(() => {
	const getReviews = async () => {
	    setLoading(true);

	    const res = await ApiController.get<APIResponses["getReviews"]>(
		`products/${productId}/reviews?limit=${REVIEWS_PER_PAGE}&offset=${offset}`
	    );

	    if(res.data) {
		const newReviews = res.data.reviews;

		if(newReviews.length < REVIEWS_PER_PAGE) {
		    setCanLoadMoreReviews(false);
		}

		setReviews(prevReviews => [...prevReviews, ...newReviews]);
	    }

	    setLoading(false);
	}

	getReviews();
    }, [offset]);

    return (
	<div className={styles.reviewsList}>
	    <div className={styles.addReview}>
		<AddReview
		setReviews={setReviews}
		productId={productId}
		isActive={canWriteAReview}
		setIsActive={setCanWriteAReview}/>
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
	    </div>

	    { loading &&
		<div className={styles.loaderContainer}>
		    <span className={`${styles.loader} loader`}></span>
		</div>
	    }

	    { canLoadMoreReviews && !loading &&
		<button
		className={styles.loadMore}
		onClick={() => setOffset(offset + REVIEWS_PER_PAGE)}>
		    Load more reviews
		</button>
	    }
	</div>
    );
}

export default ReviewsList;
