import React, { useState } from "react";

import Textarea from "@/components/Formulary/Textarea";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";

import { Review } from "../ReviewsList";
import SelectCalification from "./SelectCalification";

import styles from "./AddReview.module.scss";

interface AddReviewProps {
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
    productId: string,
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>
}

interface APIResponse {
    error: string,
    message: string,
    data: {
	createdReview: Review
    }
}

function AddReview({ setReviews, productId, isActive, setIsActive }: AddReviewProps) {
    const reviewHandler = useInputHandling("");
    const [calification, setCalification] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const handleForm = async (e: React.FormEvent<HTMLElement>) => {
	e.preventDefault();

	if(!calification) {
	    setErrorMessage("The calification is required");
	    return;
	}

	setLoading(true);

	const res = await ApiController.post<APIResponse>(`products/${productId}/reviews/`, {
	    body: {
		content: reviewHandler.value,
		calification
	    }
	});

	setLoading(false);

	if(res.error) {
	    return setErrorMessage(res.message);
	}

	setReviews(prevReviews => [res.data.createdReview, ...prevReviews]);
	setIsActive(false);
    }

    if(!isActive) return null;

    return (
	<div className={styles.addReview}>
	    <form onSubmit={handleForm}>
		<p className={styles.title}>What did you think of the product?</p>

		<Textarea
		id="review-input"
		name="review"
		label="Write your review"
		maxLength={500}
		value={reviewHandler.value}
		setValue={reviewHandler.setValue}/>

		<SelectCalification calification={calification} setCalification={setCalification}/>

		{errorMessage.length > 0 &&
		    <p className={styles.error}>
			{ errorMessage }
		    </p>
		}

		{ loading ?
		    <div className={styles.loaderContainer}>
			<span className={`${styles.loader} loader`}></span>
		    </div>
		:
		    <button className={`${styles.addReview} submit-button`}>Add Review</button>
		}
	    </form>
	</div>
    );
}

export default AddReview;
