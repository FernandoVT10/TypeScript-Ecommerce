import React, { useEffect, useState } from "react";

import AddressCard from "./AddressCard";
import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";

import ApiController from "@/services/ApiController";

import styles from "./ShippingOptions.module.scss";

export interface Address {
    _id: string,
    fullName: string,
    postalCode: string,
    state: string
    municipality: string
    suburb: string,
    street: string,
    outdoorNumber: string
    interiorNumber: string
    phoneNumber: string
    additionalInformation: string

}

interface APIResponses {
    getAddresses: {
	data: {
	    addresses: Address[]
	}
    },
    deleteAddress: {
	error: string,
	msessage: string,
	data: {
	    deletedAddress: Address
	}
    }
}

function ShippingOptions() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [editingAddress, setEditingAddress] = useState<Address>(null);

    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
	const getAddresses = async () => {
	    const res = await ApiController.get<APIResponses["getAddresses"]>("account/addresses/");

	    setAddresses(res.data.addresses);
	}

	getAddresses();
    }, []);

    const deleteAddress = async (addressId: string) => {
	const res = await ApiController.delete<APIResponses["deleteAddress"]>(`account/addresses/${addressId}`);

	if(res.error) {
	    return;
	}

	setAddresses(addresses.filter(address => address._id !== addressId));
    }

    const activateEditAddress = (address: Address) => {
	setEditingAddress(address);
	setIsEditing(true);
    }

    if(isAdding) {
	return (
	    <AddAddress setIsEditing={setIsAdding} setAddresses={setAddresses}/>
	);
    }
    
    if(isEditing && editingAddress) {
	return (
	    <EditAddress address={editingAddress} setIsEditing={setIsEditing} setAddresses={setAddresses}/>
	);
    }

    return(
	<div className={styles.shippingOptions}>
	    <h3 className={styles.subtitle}>Select an address</h3>

	    <div className={styles.selectAddress}>
		{addresses.map((address, index) => {
		    const isSelected = index === selectedAddress;

		    return (
			<AddressCard
			address={address}
			deleteAddress={() => deleteAddress(address._id)}
			editAddress={() => activateEditAddress(address)}
			isSelected={isSelected}
			handleOnClick={() => setSelectedAddress(index)}
			key={index}/>
		    );
		})}
	    </div>

	    <a
	    href="#"
	    className={styles.addNewAddress}
	    onClick={() => setIsAdding(true)}>
	    	Add New Address
	    </a>
	</div>
    );
}

export default ShippingOptions;
