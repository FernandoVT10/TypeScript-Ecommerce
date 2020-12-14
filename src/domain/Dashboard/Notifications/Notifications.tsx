import React, { useEffect, useState } from "react";

import Layout from "@/components/Dashboard/Layout";

import ApiController from "@/services/ApiController";

import NotificationCard, { NotificationCardProps } from "./NotificationCard";

import styles from "./Notifications.module.scss";

type Notification = NotificationCardProps["notification"];

interface APIResonses {
    getNotifications: {
	data: {
	    notifications: Array<Notification>
	}
    },
    deleteNotification: {
	error: string,
	message: string,
    }
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<Array<Notification>>([]);

    useEffect(() => {
	const getNotifications = async () => {
	    const apiResponse = await ApiController.get<APIResonses["getNotifications"]>("account/notifications");

	    if(apiResponse.data) {
		setNotifications(apiResponse.data.notifications);
	    }
	}

	getNotifications();
    }, []);

    const deleteNotification = async (notificationId: string) => {
	const apiREsponse = await ApiController.delete<APIResonses["deleteNotification"]>(`account/notifications/${notificationId}`);

	if(apiREsponse.error) return;

	setNotifications(
	    prevNotifications => prevNotifications.filter(
		notification => notification._id !== notificationId
	    )
	);
    }

    const getNotifications = () => {
	if(!notifications.length) {
	    return (
	    	<div className={styles.emptyMessage}>
	    	    <p>You don't have notifications</p>
	    	</div>
	    );
	}

	return notifications.map((notification, index) => {
	    return (
		<NotificationCard
		notification={notification}
		deleteNotification={deleteNotification}
		key={index}/>
	    );
	});
    }

    return (
	<Layout>
	    <div className={styles.notifications}>
		<h2 className={styles.title}>Notifications</h2>

		{ getNotifications() }
	    </div>
	</Layout>
    );
}

export default Notifications;
