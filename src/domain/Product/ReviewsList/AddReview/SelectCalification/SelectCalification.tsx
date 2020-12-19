import React, {useState} from "react";

import styles from "./SelectCalification.module.scss";

interface SelectCalificationProps {
    calification: number,
    setCalification: React.Dispatch<number>
}

const SelectCalification = ({ calification, setCalification }: SelectCalificationProps) => {
    const [hoverStar, setHoverStar] = useState(0);

    const stars: JSX.Element[] = [];

    for(let star = 1; star <= 5; star++) {
	let starStyle = star <= calification ? "fas" : "far";

	if(hoverStar > 0) {
	    starStyle = star <= hoverStar ? "fas" : "far";
	}

	stars.push(
	    <i
	    className={`${starStyle} fa-star ${styles.star}`}
	    onClick={() => setCalification(star)}
	    onMouseEnter={() => setHoverStar(star)}
	    onMouseLeave={() => setHoverStar(0)}
	    aria-hidden="true"
	    key={star}></i>
	);
    }

    const calificationCountClass = calification ? styles.active : "";

    return (
    	<div className={styles.selectCalification}>
    	    <div className={styles.stars}>{ stars }</div>
	    <div className={`${styles.calificationCount} ${calificationCountClass}`}>
		{ calification } / 5
	    </div>
    	</div>
    );
}

export default SelectCalification;
