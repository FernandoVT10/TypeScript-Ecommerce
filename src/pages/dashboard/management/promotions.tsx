import Head from "next/head"
import { InferGetServerSidePropsType } from "next";

import Promotions, { PromotionsProps } from "@/domain/Dashboard/Management/Promotions";

import withAuth from "@/hoc/withAuth";

import ApiController from "@/services/ApiController";

interface APIResponse {
    data: {
        promotions: PromotionsProps["promotions"]
    }
}

export const getServerSideProps = async () => {
    try {
        const res = await ApiController.get<APIResponse>("promotions");

        if(res.data) {
            return {
                props: {
                    promotions: res.data.promotions
                }
            }
        }
    } catch {}

    return {
        props: {
            promotions: []
        }
    }
}

const OrdersPage = ({ promotions }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
	<div>
	    <Head>
	    	<title>Promotions Management - TypeScript Ecommerce</title>
	    </Head>

            <Promotions promotions={promotions}/>
	</div>
    );
}

export default withAuth( OrdersPage, "ADMIN");
