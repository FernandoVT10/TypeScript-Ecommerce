import Head from "next/head"
import { InferGetServerSidePropsType } from "next";

import Carousel, { CarouselProps } from "@/domain/Dashboard/Management/Carousel";

import withAuth from "@/hoc/withAuth";
import ApiController from "@/services/ApiController";

interface APIResponse {
    data: {
        carouselItems: CarouselProps["carouselItems"]
    }
}

export const getServerSideProps = async () => {
    try {
        const res = await ApiController.get<APIResponse>("carousel");

        if(res.data) {
            return {
                props: {
                    carouselItems: res.data.carouselItems
                }
            }
        }
    } catch {}

    return {
        props: {
            carouselItems: []
        }
    }
}

const OrdersPage = ({ carouselItems }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
	<div>
	    <Head>
	    	<title>Carousel Management - TypeScript Ecommerce</title>
	    </Head>

            <Carousel carouselItems={carouselItems}/>
	</div>
    );
}

export default withAuth( OrdersPage, "ADMIN");
