import { InferGetServerSidePropsType } from "next";

import Head from "next/head";

import ApiController from "@/services/ApiController";

import Home from "@/domain/Home";
import { CarouselProps } from "@/domain/Home/Carousel";
import { PromoCardProps } from "@/domain/Home/PromoCard";

import { ProductCardProps } from "@/components/ProductCard";

export async function getServerSideProps() {
    try {
        const carouselResponse = await ApiController.get<{
            carousel: CarouselProps[]
        }>("carousel");

        const promotionsResponse = await ApiController.get<{
            promotions: PromoCardProps[]
        }>("promotions");

        const recentProductsResponse = await ApiController.get<{
            products: ProductCardProps[]
        }>("products?limit=10");

        const discountProductsResponse = await ApiController.get<{
            products: ProductCardProps[]
        }>("products?discountsOnly=true&limit=10");
    
        return {
            props: {
                carouselData: carouselResponse.data.carousel,
                promotions: promotionsResponse.data.promotions,
                recentProducts: recentProductsResponse.data.products,
                discountProducts: discountProductsResponse.data.products
            }
        }
    } catch {
        return {
            props: {
                carouselData: [],
                promotions: [],
                recentProducts: [],
                discountProducts: []
            }
        }
    }
}

function IndexPage({
    carouselData,
    promotions,
    recentProducts,
    discountProducts
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            <Head>
                <title>TypeScript Ecommerce - Home</title>
            </Head>
            
            <Home
            carouselData={carouselData}
            promotions={promotions}
            recentProducts={recentProducts}
            discountProducts={discountProducts}/>
        </div>
    );
}

export default IndexPage;