import React from "react";

import Link from "next/link";

import styles from "./Footer.module.scss";

function Footer() {
    return (
        <footer className={styles.footer}>
            <Link href="/">
                <a className={styles.logo}>
                    <img src="/favicon.png" alt="Icon"/>
                    <h3>Commerce</h3>
                </a>
            </Link>

            <p className={styles.copyright}>© 2020 TypeScript Ecommerce</p>

            <Link href="#">
                <a className={styles.termsAndConditions}>
                    Terms and conditions    
                </a>
            </Link>
        </footer>
    );
}

export default Footer;