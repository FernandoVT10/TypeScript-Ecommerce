import React, { useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";

import Link from "next/link";

import UserContext from "@/contexts/UserContext";

import CartController from "@/services/ShoppingCartController";
import ApiController from "@/services/ApiController";

import styles from "./Navbar.module.scss";

interface APIResponse {
    data: {}
}

function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const [cartItemsCount, setCartItemCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const userData = useContext(UserContext);

    useEffect(() => {
	const getUserData = async () => {
	    const apiResponse = await ApiController.get<APIResponse>("account/getUserData");

	    if(!apiResponse.data) return;

	    setIsLoggedIn(true);
	}

	if(userData) {
	    setIsLoggedIn(true);
	} else {
	    getUserData();
	}

	setCartItemCount(CartController.getItems().length);
    }, []);

    const router = useRouter();

    const toggleNavbar = () => {
        if(!isActive) {
            window.scroll(0, 0);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        setIsActive(!isActive);
    }

    const navbarClass = isActive ? styles.navbarActive : "";
    const toggleButtonClass = isActive ? "fa-times" : "fa-bars";

    return (
        <nav className={`${styles.navbar} ${navbarClass}`} data-testid="navbar">
            <div className={styles.leftContainer}>
                <Link href="/">
                    <a className={styles.logo}>
                        <img src="/favicon.png" alt="Icon"/>
                        <h3>Commerce</h3>
                    </a>
                </Link>

                <div className={`${styles.searchProduct} search-input`}>
                    <form action="/products/">
                        <input
                        type="search"
                        name="search"
                        placeholder="Search a product"
                        defaultValue={router.query.search}
                        autoComplete="search"/>

                        <button type="submit">
                            <i className="fas fa-search" aria-hidden="true"></i>
                        </button>
                    </form>
                </div>
            </div>

            <div className={styles.menu}>
                <ul className={styles.items}>
		    { !isLoggedIn &&
			<li>
			    <Link href="/login/">
				<a className={styles.item}>Login</a>
			    </Link>
			</li>
		    }

		    { !isLoggedIn &&
			<li>
			    <Link href="/register/">
				<a className={styles.item}>Register</a>
			    </Link>
			</li>
		    }

                    <li>
                        <Link href="/cart/">
                            <a className={`${styles.item} ${styles.shoppingCart}`}>
                                <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                                <span>{ cartItemsCount }</span>
                            </a>
                        </Link>
                    </li>

		    { isLoggedIn &&
			<li>
			    <div className={styles.dropdown}>
				<i className="fas fa-user-circle" aria-hidden="true"></i>
				My Profile

				<div className={styles.dropdownItems}>
				    <Link href="/dashboard/profile/edit/">
					<a className={styles.dropdownItem}>
					    <i className="fas fa-user-circle" aria-hidden="true"></i>
					    Edit Profile
					</a>
				    </Link>

				    <Link href="/dashboard/notifications/">
					<a className={styles.dropdownItem}>
					    <i className="fas fa-bell" aria-hidden="true"></i>
					    Notifications
					</a>
				    </Link>

				    <Link href="/dashboard/orders/">
					<a className={styles.dropdownItem}>
					    <i className="fas fa-shopping-bag" aria-hidden="true"></i>
					    Your Orders
					</a>
				    </Link>
				</div>
			    </div>
			</li>
		    }
                    
                    <li>
                        <a
                        className={`${styles.item} ${styles.toggleButton}`}
                        data-testid="navbar-toggle-button"
                        onClick={toggleNavbar}>
                            <i className={`fas ${toggleButtonClass}`} aria-hidden="true"></i>
                        </a>
                    </li>
                </ul>
            </div>

            {/* This is the menu for smartphones or tablets */}

            <div className={styles.mobileMenu}>
                <ul className={styles.items}>
                    <li>
                        <div className={`${styles.searchProduct} search-input`}>
                            <form action="/products/">
                                <input
                                type="search"
                                name="search"
                                placeholder="Search a product"
                                defaultValue={router.query.search}
                                autoComplete="search"/>

                                <button type="submit">
                                    <i className="fas fa-search" aria-hidden="true"></i>
                                </button>
                            </form>
                        </div>
                    </li>

		    { !isLoggedIn &&
			<li>
			    <Link href="/login/">
				<a className={styles.item}>Login</a>
			    </Link>
			</li>
		    }

		    { !isLoggedIn &&
			<li>
			    <Link href="/register/">
				<a className={styles.item}>Register</a>
			    </Link>
			</li>
		    }

		    <Link href="/dashboard/profile/edit/">
			<a className={styles.item}>
			    <i className="fas fa-user-circle" aria-hidden="true"></i>
			    Edit Profile
			</a>
		    </Link>

		    <Link href="/dashboard/notifications/">
			<a className={styles.item}>
			    <i className="fas fa-bell" aria-hidden="true"></i>
			    Notifications
			</a>
		    </Link>

		    <Link href="/dashboard/orders/">
			<a className={styles.item}>
			    <i className="fas fa-shopping-bag" aria-hidden="true"></i>
			    Your Orders
			</a>
		    </Link>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
