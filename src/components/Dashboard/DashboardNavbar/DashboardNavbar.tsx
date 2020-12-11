import React, { useEffect, useState } from "react";

import Link from "next/link";

import MobileMenu from "./MobileMenu";

import styles from "./DashboardNavbar.module.scss";

const DashboardNavbar = ({ name }: { name: string }) => {
    const [isActive, setIsActive] = useState(true);
    const [dropdownIsActive, setDropdownIsActive] = useState(false);

    useEffect(() => {
	const handleResize = () => {
	    if(window.innerWidth > 1200) {
		return setIsActive(true);
	    }

	    setIsActive(false);
	}

	handleResize();

	window.addEventListener("resize", handleResize);

	return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
	if(isActive && window.innerWidth <= 1200) {
	    document.body.style.overflow = "hidden";
	} else {
	    document.body.style.overflow = "auto";
	}
    }, [isActive]);

    const navbarClass = isActive ? styles.active : "";
    const dropdownClass = dropdownIsActive ? styles.active : "";
    const arrowDirection = dropdownIsActive ? "up" : "down";

    return (
	<div>
	    <div className={`${styles.dashboardNavbar} ${navbarClass}`}>
		<div
		className={styles.navbarBackground}
		onClick={() => setIsActive(false)}></div>

		<ul className={styles.items}>
		    <li className={`${styles.item} ${styles.mainItem}`}>
			<button
			className={styles.toggleButton}
			onClick={() => setIsActive(!isActive)}>
			    <i className="fas fa-bars" aria-hidden="true"></i>
			</button>

			<span className={styles.name}>{ name }</span>
		    </li>
		    <li className={styles.item}>
			<Link href="/dashboard/profile/edit/">
			    <a className={styles.link}>
				<span className={styles.icon}>
				    <i className="fas fa-user-circle" aria-hidden="true"></i>
				</span>

				Edit Profile
			    </a>
			</Link>
		    </li>
		    <li className={styles.item}>
			<Link href="/dashboard/notifications/">
			    <a className={styles.link}>
				<span className={styles.icon}>
				    <i className="fas fa-bell" aria-hidden="true"></i>
				</span>

				Notifications
			    </a>
			</Link>
		    </li>
		    <li className={styles.item}>
			<Link href="/dashboard/orders/">
			    <a className={styles.link}>
				<span className={styles.icon}>
				    <i className="fas fa-shopping-bag" aria-hidden="true"></i>
				</span>

				Your Orders
			    </a>
			</Link>
		    </li>
		    <li>
			<div
			className={`${styles.item} ${styles.dropdownItem}`}
			onClick={() => setDropdownIsActive(!dropdownIsActive)}>
			    <span className={styles.icon}>
				<i className="fas fa-cog" aria-hidden="true"></i>
			    </span>

			    Management

			    <span className={styles.arrow}>
				<i className={`fas fa-chevron-${arrowDirection}`} aria-hidden="true"></i>
			    </span>
			</div>

			<div className={`${styles.dropdown} ${dropdownClass}`}>
			    <Link href="/dashboard/management/orders/">
				<a className={styles.link}>Orders</a>
			    </Link>
			    <Link href="/dashboard/management/products/">
				<a className={styles.link}>Products</a>
			    </Link>
			    <Link href="/dashboard/management/users/">
				<a className={styles.link}>Users</a>
			    </Link>
			</div>
		    </li>
		</ul>
	    </div>

	    <MobileMenu isActive={isActive} setIsActive={setIsActive}/>
	</div>
    );
}

export default DashboardNavbar;
