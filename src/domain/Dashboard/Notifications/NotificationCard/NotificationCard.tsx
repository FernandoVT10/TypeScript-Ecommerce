import React from "react";
import moment from "moment";

import styles from "./NotificationCard.module.scss";

export interface NotificationCardProps {
    notification: {
	_id: string,
	from: string,
	message: string,
	viewed: string,
	createdAt: string
    },
    deleteNotification: (notificationId: string) => void
}

const NotificationCard = ({ notification, deleteNotification }: NotificationCardProps) => {
    const date = new Date(notification.createdAt);

    const notificationCardClass = notification.viewed ? "" : styles.noViewed;

    return (
	<div className={`${styles.notificationCard} ${notificationCardClass}`}>
	    <button
	    className={styles.deleteButton}
	    onClick={() => deleteNotification(notification._id)}>
	    	<i className="fas fa-times" aria-hidden="true"></i>
	    </button>
	    
	    <p className={styles.from}>
		From: <span>{ notification.from }</span>
	    </p>
	    <p className={styles.message}>
		{ notification.message }
	    </p>
	    <p className={styles.time}>
		{ moment(date).fromNow() }
	    </p>
	</div>
    );
}

export default NotificationCard;
