import React, { useContext } from "react";

import UserContext from "@/contexts/UserContext";

import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import Navbar from "@/components/Navbar";

import styles from "./Layout.module.scss";

const Layout = ({ children }: { children: JSX.Element | string }) => {
    const user = useContext(UserContext);

    return (
	<div>
	    <Navbar/>

	    <div className={styles.dashboard}>
		<DashboardNavbar name={user.name}/>

		<div className={styles.container}>
		    { children }
		</div>
	    </div>
	</div>
    );
}

export default Layout;
