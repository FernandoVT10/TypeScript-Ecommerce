import React from "react";

import Layout from "@/components/Dashboard/Layout";

import ChangePasswordForm from "./ChangePasswordForm";
import EditForm from "./EditForm";

import styles from "./EditProfile.module.scss";

const EditProfile = () => {

    return (
	<Layout>
	    <div className={styles.editProfile}>
	    	<h3 className={styles.title}>Edit Profile</h3>
		<EditForm/>

	    	<h3 className={styles.title}>Change Password</h3>
		<ChangePasswordForm/>
	    </div>
	</Layout>
    );
}

export default EditProfile;
