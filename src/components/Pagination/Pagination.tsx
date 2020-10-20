import React from "react";

import { useRouter } from "next/router";

import styles from "./Pagination.module.scss";

export interface PaginationProps {
    hasPrevPage: boolean,
    prevPage: number,
    hasNextPage: boolean,
    nextPage: number,
    pages: {
        pageNumber: number,
        active: boolean
    }[]
}

function Pagination({ pagination }: { pagination: PaginationProps }) {
    const router = useRouter();

    const changePage = (page: number) => {
        const { query } = router;

        query.page = page.toString();

        router.push({
            pathname: router.pathname,
            query
        });
    }

    const leftArrowClass = pagination.hasPrevPage ? "" : styles.disabled;
    const rightArrowClass = pagination.hasNextPage ? "" : styles.disabled;


    return (
        <div className={styles.paginationWrapper}>
            <div className={styles.pagination}>
                <button
                className={`${styles.arrow} ${leftArrowClass}`}
                onClick={() => changePage(pagination.prevPage)}
                data-testid="pagination-button"
                disabled={!pagination.hasPrevPage}>
                    <i className="fas fa-chevron-left" aria-hidden="true"></i>
                </button>

                {pagination.pages.map((page, index) => {
                    const numberClass = page.active ? styles.active : "";
                    
                    return (
                        <span
                        className={`${styles.number} ${numberClass}`}
                        onClick={() => changePage(page.pageNumber)}
                        key={index}>
                            { page.pageNumber }
                        </span>
                    );
                })}

                <button
                className={`${styles.arrow} ${styles.right} ${rightArrowClass}`}
                onClick={() => changePage(pagination.nextPage)}
                data-testid="pagination-button"
                disabled={!pagination.hasNextPage}>
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}

export default Pagination;