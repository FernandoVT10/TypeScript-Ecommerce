import React from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductCardProps } from "@/components/ProductCard";

import Carousel, { CarouselProps } from "./Carousel";
import ProductsCarousel from "./ProductsCarousel";
import PromoCard, { PromoCardProps } from "./PromoCard";

import styles from "./Home.module.scss";

interface HomeProps {
    carouselItems: CarouselProps[],
    promotions: PromoCardProps[],
    recentProducts: ProductCardProps[],
    discountProducts: ProductCardProps[]
}

function Home({ carouselItems, promotions, recentProducts, discountProducts }: HomeProps) {
    return (
        <div>
            <Navbar/>

            <div className="wrapper">
                <Carousel carouselItems={carouselItems}/>

                <div className={`container ${styles.container}`}>
                    <h2 className={`subtitle ${styles.subtitle}`}>Recent Products</h2>

                    <ProductsCarousel products={recentProducts}/>

                    <h2 className={`subtitle ${styles.subtitle}`}>The Best Discounts</h2>

                    <ProductsCarousel products={discountProducts}/>

                    <div className={styles.promoCardsContainer}>
                        {promotions.length > 0 &&
                            promotions.map(promotion => {
                                return (
                                    <div className={styles.promoCard} key={promotion.image}>
                                        <PromoCard promotionDetails={promotion}/>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default Home;