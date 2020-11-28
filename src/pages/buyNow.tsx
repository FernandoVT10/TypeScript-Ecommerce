import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import ApiController from "@/services/ApiController";

import BuyNow from "@/domain/BuyNow";

import { getTokenFromCookies } from "@/services/cookie";

interface APIResponse {
    data: {
	isLogged: boolean
    }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    try {
	const token = getTokenFromCookies(ctx.req);

	const apiResponse = await ApiController.get<APIResponse>("account/isLogged", token);

	if(apiResponse.data.isLogged) {
	    return {
		props: {
		    paypalClientId: process.env.PAYPAL_CLIENT_ID
		}
	    }
	}
    } catch { }

    const { res } = ctx;

    res.statusCode = 302;
    res.setHeader("location", "/login/");
    res.end();

    return {
	props: {
	    paypalClientId: ""
	}
    };
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

export default BuyNowPage;
