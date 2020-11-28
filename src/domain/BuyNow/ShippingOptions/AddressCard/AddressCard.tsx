import React from "react";

import styles from "./AddressCard.module.scss";

interface AddressCardProps {
    address: {
	fullName: string,
	phoneNumber: string,
	state: string,
	postalCode: string,
	municipality: string,
	street: string,
	additionalInformation: string
    },
    handleOnClick: () => {},
    isSelected: boolean
}

function AddressCard({ address, handleOnClick, isSelected }: AddressCardProps) {
    const addressCardClass= isSelected ? styles.selected : "";

    return (
	<div className={`${styles.addressCard} ${addressCardClass}`} onClick={handleOnClick}>
	    <div className={styles.address}>
		<p className={styles.firstDetail}>{ address.street }</p>

		{ address.additionalInformation.length > 0 &&
		    <p className={styles.details}>
			{ address.additionalInformation }
		    </p>
		}

		<p className={styles.details}>
		    { address.state }({ address.postalCode }), { address.municipality }
		</p>

		<p className={styles.details}>
		    { address.fullName } - { address.phoneNumber }
		</p>
	    </div>

	    <span className={styles.checkbox}></span>
	</div>
    );
}
export default AddressCard;
