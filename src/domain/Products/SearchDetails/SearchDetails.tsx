import React from "react";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import styles from "./SearchDetails.module.scss";

export interface Category {
    _id: string,
    name: string
}

interface SearchDetailsProps {
    totalResults: number,
    categories: Category[]
}

function SearchDetails({ totalResults, categories }: SearchDetailsProps) {
    const [filterIsActive, setFilterIsActive] = useState(false);
    const router = useRouter();

    const toggleFilter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if(!filterIsActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        setFilterIsActive(!filterIsActive);
    }

    const handleCategory = () => {
        setFilterIsActive(false);

        document.body.style.overflow = "auto";
    }

    const filterClass = filterIsActive ? styles.active : "";

    return (
        <div className={styles.searchDetails}>
            <h3 className={styles.search}>
                {router.query.search}
            </h3>

            <div className={`search-input ${styles.searchInput}`}>
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

            <p className={styles.results}>
                {totalResults > 1
                ? `${totalResults} products`
                : `${totalResults} product`}
            </p>

            <a
            href="#"
            onClick={toggleFilter}
            className={styles.filterButton}>
                Filter
                <i className="fas fa-sliders-h" aria-hidden="true"></i>
            </a>

            <div className={`${styles.filter} ${filterClass}`}>
                <h3 className={styles.filterBy}>Filter By</h3>

                <a
                href="#"
                className={styles.closeFilter}
                onClick={toggleFilter}>
                    <i className="fas fa-times" aria-hidden="true"></i>
                </a>

                <div className={styles.categories}>
                    <h3 className={styles.title}>Categories</h3>

                    {categories.length > 0 ?
                        categories.map(category => {
                            const categoryClass = router.query.category === category.name
                                ? styles.active
                                : "";
                            
                            return (
                                <Link
                                href={`/products?category=${category.name}`}
                                key={category._id}>
                                    <a
                                    className={`${styles.category} ${categoryClass}`}
                                    onClick={handleCategory}>
                                        { category.name }
                                    </a>
                                </Link>
                            );
                        })
                    :   <p className={styles.notFound}>No categories available</p>
                    }
                </div>
            </div>
        </div>
    );
}

export default SearchDetails;