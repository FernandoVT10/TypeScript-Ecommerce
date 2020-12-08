import React from "react";

import { InferGetServerSidePropsType } from "next";
import Head from "next/head";

import withAuth from "@/hoc/withAuth";

import BuyNow from "@/domain/BuyNow";

interface APIResponse {
    data: {
	isLogged: boolean
    }
}

export async function getServerSideProps() {
    return {
	props: {
	    paypalClientId: process.env.PAYPAL_CLIENT_ID || ""
	}
    }
}

function BuyNowPage({ paypalClientId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
	<div>
	    <Head>
	    	<title>Buy Now - TypeScript Ecommerce</title>
	    </Head>

	    <BuyNow paypalClientId={paypalClientId}/>
	</div>
    );
}

export default withAuth(BuyNowPage);
