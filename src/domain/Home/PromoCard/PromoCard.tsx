import React from "react";

import styles from "./PromoCard.module.scss";

export interface PromoCardProps {
    _id: string,
    image: string,
    title: string,
    link: string
}

function PromoCard({ promotionDetails }: { promotionDetails: PromoCardProps }) {
    return (
        <div className={styles.promoCard}>
            <div className={styles.imageContainer}>
                <img src={`/img/promotions/thumb-${promotionDetails.image}`} alt="Promo Image"/>
            </div>
            <div className={styles.detailsContainer}>
                <p className={styles.title}>
                    { promotionDetails.title }
                </p>

                <a href={promotionDetails.link} className={styles.link}>
                    See more
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    );
}

export default PromoCard;
