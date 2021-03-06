import React from "react";

import styles from "./CalificationStars.module.scss";

function CalificationStars({ calification }: { calification: number }) {
    const getFullStars = () => {
	const fullStars: JSX.Element[] = [];

	let numOfFUllStars = Math.floor(calification);

	while(numOfFUllStars > 0) {
	    fullStars.push(
		<i className="fas fa-star" aria-hidden="true" key={numOfFUllStars}></i>
	    );
	    numOfFUllStars--;
	}

	return fullStars;
    }

    const getEmptyStars = () => {
	const emptyStars: JSX.Element[] = [];

	let numOfEmptyStars = calification % 1 >= 0.5 ? Math.ceil(5 - calification) - 1 : Math.ceil(5 - calification);

	while(numOfEmptyStars > 0) {
	    emptyStars.push(
		<i className="far fa-star" aria-hidden="true" key={numOfEmptyStars}></i>
	    );
	    numOfEmptyStars--;
	}

	return emptyStars;
    }

    return (
	<div className={styles.calification}>
	    { getFullStars() }
	    {calification % 1 >= 0.5 &&
		<i className="fas fa-star-half-alt" aria-hidden="true"></i>
	    }
	    { getEmptyStars() }
	</div>
    );
}

export default CalificationStars;
