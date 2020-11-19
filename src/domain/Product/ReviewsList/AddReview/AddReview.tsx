import React, { useState } from "react";

import ApiController from "@/services/ApiController";

import { Review } from "../ReviewsList";

import styles from "./AddReview.module.scss";

interface AddReviewProps {
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
    productId: string
}

function AddReview({ setReviews, productId }: AddReviewProps) {
    const [review, setReview] = useState("");
    const [calification, setCalification] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForm = (e: React.FormEvent<HTMLElement>) => {
	e.preventDefault();

	if(!calification) {
	    setErrorMessage("The calification is required");
	    return;
	}

	setLoading(true);

	ApiController.post<{
	    data: {
		createdReview: Review
	    }
	}>(`products/${productId}/reviews/`, {
	    body: { content: review, calification }
	})
	.then(res => {
	    if(res.data) {
		setReviews(prevReviews => [res.data.createdReview, ...prevReviews]);
	    }

	    setLoading(false);
	    setErrorMessage("");
	});
    }

    const getStars = () => {
	const stars: JSX.Element[] = [];

	for(let star = 1; star <= 5; star++) {
	    const starStyle = star <= calification ? "fas" : "far";

	    stars.push(
		<i
		className={`${starStyle} fa-star ${styles.star}`}
		onClick={() => setCalification(star)}
		aria-hidden="true"
		key={star}></i>
	    );
	}

	return stars;
    }

    const loaderClass = loading ? styles.active : "";

    return (
	<div className={styles.addReview}>
	    <div className={`${styles.loaderContainer} ${loaderClass}`}>
	    	<span className={`${styles.loader} loader`}></span>
	    </div>

	    <form onSubmit={handleForm}>
		<label className={styles.label} htmlFor="add-review">What did you think of the product?</label>

		<textarea
		className={styles.textarea}
		id="add-review"
		name="add-review-input"
		onChange={({ target: { value } }) => setReview(value)}
		maxLength={500}
		required></textarea>

		<div className={styles.starSelection}>
		    { getStars() }
		</div>

		{errorMessage.length > 0 &&
		    <p className={styles.error}>
			<i className="fas fa-info-circle"></i>
			{ errorMessage }
		    </p>
		}

		<button className={`${styles.addReview} submit-button`}>Add Review</button>
	    </form>
	</div>
    );
}

export default AddReview;
