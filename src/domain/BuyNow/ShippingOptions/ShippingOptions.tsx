import React, { useEffect, useState } from "react";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

import ApiController from "@/services/ApiController";

import styles from "./ShippingOptions.module.scss";

interface APIResponse {
    data: {
	addresses: { hola: 10 }[]
    }
}

function ShippingOptions() {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(0);

    useEffect(() => {
	const getAddresses = async () => {
	    const res = await ApiController.get<APIResponse>("account/addresses/");

	    setAddresses(res.data.addresses);
	}

	getAddresses();
    }, []);

    return(
	<div className={styles.shippingOptions}>
	    <div className={styles.selectAddress}>
		{addresses.map((address, index) => {
		    const isSelected = index === selectedAddress;

		    return (
			<AddressCard
			address={address}
			isSelected={isSelected}
			handleOnClick={() => setSelectedAddress(index)}
			key={index}/>
		    );
		})}
	    </div>
	</div>
    );
}

export default ShippingOptions;
