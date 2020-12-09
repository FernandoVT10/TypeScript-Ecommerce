import React from "react";

import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import Navbar from "@/components/Navbar";

import styles from "./Dashboard.module.scss";

const Dashboard = () => {
    return (
	<div>
	    <Navbar/>

	    <div className={styles.dashboard}>
		<DashboardNavbar fullname={`Jhon Wick`}/>
	    </div>
	</div>
    );
}

export default Dashboard;
