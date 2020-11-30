import React, { useState } from "react";

import ConfimationModal from "@/components/ConfirmationModal";

import styles from "./AddressCard.module.scss";

interface AddressCardProps {
    address: {
	_id: string,
	fullName: string,
	phoneNumber: string,
	state: string,
	postalCode: string,
	municipality: string,
	street: string,
	additionalInformation: string
    },
    deleteAddress: () => void,
    editAddress: () => void,
    handleOnClick: () => void,
    isSelected: boolean
}

function AddressCard({ address, deleteAddress, editAddress, handleOnClick, isSelected }: AddressCardProps) {
    const [isModalActive, setIsModalActive] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleDeleteAddress = () => {
	setLoading(true);
	deleteAddress();
    }

    const addressCardClass = isSelected ? styles.selected : "";

    return (
	<div className={`${styles.addressCard} ${addressCardClass}`} onClick={handleOnClick}>
	    <ConfimationModal
	    message="Are you sure to delete this address?"
	    isActive={isModalActive}
	    setIsActive={setIsModalActive}
	    onConfirm={handleDeleteAddress}/>

	    { loading && 
		<div className={styles.loaderContainer}>
		    <span className={`loader ${styles.loader}`}></span>
		</div>
	    }

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

		<div className={styles.options}>
		    <button
		    className={styles.option}
		    onClick={() => editAddress()}>
			Edit
		    </button>

		    <button
		    className={styles.option}
		    onClick={() => setIsModalActive(true)}>
			Delete
		    </button>
		</div>
	    </div>

	    <span className={styles.checkbox}></span>
	</div>
    );
}
export default AddressCard;
