import React from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProductCardProps } from "@/components/ProductCard";

import Carousel, { CarouselProps } from "./Carousel";
import ProductsCarousel from "./ProductsCarousel";
import PromoCard from "./PromoCard";

import styles from "./Home.module.scss";
import { PromoCardProps } from "./PromoCard";

interface HomeProps {
    carouselData: CarouselProps[],
    promotions: PromoCardProps[],
    recentProducts: ProductCardProps[],
    discountProducts: ProductCardProps[]
}

function Home({ carouselData, promotions, recentProducts, discountProducts }: HomeProps) {
    return (
        <div>
            <Navbar/>

            <Carousel carouselData={carouselData}/>

            <div className={`container ${styles.container}`}>
                <h2 className={`subtitle ${styles.subtitle}`}>Recent Products</h2>

                <ProductsCarousel products={recentProducts}/>

                <h2 className={`subtitle ${styles.subtitle}`}>The Best Discounts</h2>

                <ProductsCarousel products={discountProducts}/>

                <div className={styles.promoCardsContainer}>
                    {promotions.map(promotion => {
                        return (
                            <div className={styles.promoCard} key={promotion.image}>
                                <PromoCard promotionDetails={promotion}/>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default Home;