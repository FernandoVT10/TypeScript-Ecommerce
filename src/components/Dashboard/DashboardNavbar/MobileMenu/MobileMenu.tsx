import React from "react";

import Link from "next/link";

import styles from "./MobileMenu.module.scss";

interface MobileMenuProps {
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>
}

const MobileMenu = ({ isActive, setIsActive }: MobileMenuProps) => {
    return (
	<div className={styles.mobileMenu}>
	    <ul className={styles.menu}>
		<li className={styles.item}>
		    <button
			className={styles.toggleButton}
			onClick={() => setIsActive(!isActive)}>
			<i className="fas fa-bars" aria-hidden="true"></i>
		    </button>
		</li>
		<li className={styles.item}>
		    <Link href="/dashboard/profile/edit/">
			<a className={styles.link}>
			    <i className="fas fa-user-circle" aria-hidden="true"></i>
			</a>
		    </Link>
		</li>
		<li className={styles.item}>
		    <Link href="/dashboard/profile/edit/">
			<a className={styles.link}>
			    <i className="fas fa-bell" aria-hidden="true"></i>
			</a>
		    </Link>
		</li>
		<li className={styles.item}>
		    <Link href="/dashboard/profile/edit/">
			<a className={styles.link}>
			    <i className="fas fa-shopping-bag" aria-hidden="true"></i>
			</a>
		    </Link>
		</li>
		<li className={styles.item}>
		    <Link href="/dashboard/profile/edit/">
			<a className={styles.link}>
			    <i className="fas fa-cog" aria-hidden="true"></i>
			</a>
		    </Link>
		</li>
	    </ul>
	</div>
    );
}

export default MobileMenu;
