import React from "react";

import CalificationStars from "@/components/CalificationStars";

import styles from "./CalificationTable.module.scss";

export interface CalificationTableProps {
    calification: number,
    reviewsCount: {
	oneStar: number,
	twoStars: number,
	threeStars: number,
	fourStars: number,
	fiveStars: number,
	totalReviews: number
    }
}

const BAR_WIDTH = 100;

function CalificationTable({ calification, reviewsCount }: CalificationTableProps) {
    const getReviewsCount = (title: string, count: number) => {
	const barWidth = count / reviewsCount.totalReviews * BAR_WIDTH || 0;

	return (
	    <div className={styles.reviewsCount}>
		<span className={styles.text}>{ title }</span>
		<span className={styles.barContainer}>
		    <span className={styles.bar} style={{ width: barWidth }}></span>
		</span>
		<span className={styles.text}>{ count }</span>
	    </div>
	);
    }

    return (
	<div className={styles.calificationTable}>
	    <h3 className={styles.subtitle}>Calification and reviews</h3>

	    <div className={styles.table}>
		<div className={styles.calification}>
		    <span className={styles.number}>{ calification }</span>
		    <CalificationStars calification={calification}/>
		    <span className={styles.reviewsCount}>{ reviewsCount.totalReviews } reviews</span>
		</div>

		<div className={styles.reviewsCountList}>
		    { getReviewsCount("5 stars", reviewsCount.fiveStars) }
		    { getReviewsCount("4 stars", reviewsCount.fourStars) }
		    { getReviewsCount("3 stars", reviewsCount.threeStars) }
		    { getReviewsCount("2 stars", reviewsCount.twoStars) }
		    { getReviewsCount("1 stars", reviewsCount.oneStar) }
		</div>
	    </div>
	</div>
    );
}

export default CalificationTable;
