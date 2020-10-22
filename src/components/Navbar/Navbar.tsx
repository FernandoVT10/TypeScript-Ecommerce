import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Link from "next/link";

import styles from "./Navbar.module.scss";

function Navbar() {
    const [isActive, setIsActive] = useState(false);

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
                    <li>
                        <Link href="/login/">
                            <a className={styles.item}>Login</a>
                        </Link>
                    </li>

                    <li>
                        <Link href="/register/">
                            <a className={styles.item}>Register</a>
                        </Link>
                    </li>

                    <li>
                        <Link href="/cart/">
                            <a className={`${styles.item} ${styles.shoppingCart}`}>
                                <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                                <span>9</span>
                            </a>
                        </Link>
                    </li>
                    
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

                    <li>
                        <Link href="/login/">
                            <a className={styles.item}>Login</a>
                        </Link>
                    </li>

                    <li>
                        <Link href="/register/">
                            <a className={styles.item}>Register</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;