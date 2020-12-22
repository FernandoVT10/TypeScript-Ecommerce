import React, {useState} from "react";

import moment from "moment";

import Modal from "@/components/Modal";

import AddShippingStatus from "./AddShippingStatus";

import styles from "./ShippingDetails.module.scss";

export interface ShippingDetailsProps {
    orderId: string,
    address: {
	fullName: string,
	postalCode: string,
	state: string,
	municipality: string,
	suburb: string,
	street: string,
	outdoorNumber: string,
	interiorNumber: string,
	phoneNumber: string,
	additionalInformation: string
    },
    shipping: {
	history: Array<{
	    content: string,
	    createdAt: string
	}>
    },
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>,
    isManageCard: boolean
}

const ShippingDetails = ({
    orderId,
    address,
    shipping,
    isActive,
    setIsActive,
    isManageCard
}: ShippingDetailsProps) => {
    const [history, setHistory] = useState(shipping.history);

    const reversedHistory = [ ...history ].reverse();

    return (
	<Modal isActive={isActive} setIsActive={setIsActive}>
	    <div className={styles.shippingDetails}>
		<div className={styles.address}>
		    <h3 className={styles.fullName}>{ address.fullName }</h3>

		    <p className={styles.state}>
			{ address.state } { address.municipality } ({ address.postalCode })
		    </p>

		    <p className={styles.street}>
			{ address.suburb } { address.street } #{ address.outdoorNumber }
			{ address.interiorNumber !== "W/0"
			    ? `(Interior: #${address.interiorNumber})`
			    : null
			}
		    </p>

		    <p className={styles.phoneNumber}>
			Phone Number:
			<span className={styles.number}>{ address.phoneNumber }</span>
		    </p>

		    <p className={styles.additionalInformation}>
			Aditional Information:
			<span className={styles.information}>{ address.additionalInformation }</span>
		    </p>
		</div>

		<div className={styles.shippingStatus}>
		    <h3 className={styles.title}>Shipping Status</h3>

		    { isManageCard && <AddShippingStatus orderId={orderId} setHistory={setHistory}/> }

		    <div className={styles.history}>
			{reversedHistory.map((state, index) => {
			    const date = new Date(state.createdAt);

			    return (
				<div className={styles.state} key={index}>
				    <span className={styles.circle}></span>

				    <span className={styles.date}>
					{ moment(date).format("D MMM") }
				    </span>

				    <span className={styles.content}>
					{ state.content }
				    </span>
				</div>
			    );
			})}
		    </div>
		</div>
	    </div>
	</Modal>
    );
}

export default ShippingDetails;
