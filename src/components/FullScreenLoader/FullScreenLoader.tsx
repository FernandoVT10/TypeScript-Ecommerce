import React from "react";

import styles from "./FullScreenLoader.module.scss";

const FullScreenLoader = () => {
    return (
	<div className={styles.fullScreenLoader}>
	    <span className={`loader ${styles.loader}`}></span>
	</div>
    );
}

export default FullScreenLoader;
