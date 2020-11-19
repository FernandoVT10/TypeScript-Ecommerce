import { InferGetServerSidePropsType } from "next";

import Head from "next/head";

import ApiController from "@/services/ApiController";

import Home, { HomeProps } from "@/domain/Home";

interface APIResponses {
    carousel: {
	data: {
            carousel: HomeProps["carouselItems"]
	}
    },
    promotions: {
	data: {
            promotions: HomeProps["promotions"]
	}
    },
    recentProducts: {
	data: {
            products: HomeProps["recentProducts"]
	}
    },
    discountProducts: {
	data: {
            products: HomeProps["discountProducts"]
	}
    }
}

export async function getServerSideProps() {
    try {
	const carouselResponse = await ApiController.get<
	    APIResponses["carousel"]
	>("carousel/getAllItems");

	const promotionsResponse = await ApiController.get<
	    APIResponses["promotions"]
	>("promotions");

	const recentProductsResponse = await ApiController.get<
	    APIResponses["recentProducts"]
	>("products?limit=10");

	const discountProductsResponse = await ApiController.get<
	    APIResponses["discountProducts"]
	>("products?discountsOnly=true&limit=10");
    
        return {
            props: {
                carouselItems: carouselResponse.data.carousel,
                promotions: promotionsResponse.data.promotions,
                recentProducts: recentProductsResponse.data.products,
                discountProducts: discountProductsResponse.data.products
            }
        }
    } catch {
        return {
            props: {
                carouselItems: [],
                promotions: [],
                recentProducts: [],
                discountProducts: []
            }
        }
    }
}

function IndexPage({
    carouselItems,
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
            carouselItems={carouselItems}
            promotions={promotions}
            recentProducts={recentProducts}
            discountProducts={discountProducts}/>
        </div>
    );
}

export default IndexPage;
