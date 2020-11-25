import React from "react";

import Head from "next/head";

import { InferGetServerSidePropsType } from "next";

import BuyNow from "@/domain/BuyNow";

export async function getServerSideProps() {
    return {
	props: {
	    paypalClientId: process.env.PAYPAL_CLIENT_ID
	}
    };
}

function BuyNowPage({ paypalClientId }:InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
	<div>
	    <Head>
	    	<title>Buy Now - TypeScript Ecommerce</title>
	    </Head>

	    <BuyNow paypalClientId={paypalClientId}/>
	</div>
    );
}

export default BuyNowPage;
