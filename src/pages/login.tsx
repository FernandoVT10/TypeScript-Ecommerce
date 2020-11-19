import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import Head from "next/head";

import ApiController from "@/services/ApiController";

import Login from "@/domain/Login";

interface ActivateAccountResponse {
    error: string,
    message: string,
    data: {
	message: string
    }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { activeToken } = ctx.query;

    if(activeToken) {
	try {
	    const activateAccountResponse = await ApiController.get<ActivateAccountResponse>(
		`account/activate/${activeToken}`
	    );

	    if(activateAccountResponse.error) {
		return {
		    props: {
			activationStatus: "error"
		    }
		}
	    }

	    return {
		props: {
		    activationStatus: "success"
		}
	    }
	} catch {}
    }

    return {
	props: {
	    activationStatus: ""
	}
    };
}

function LoginPage({ activationStatus }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
	<div>
	    <Head>
	    	<title>TypeScript Ecommerce - Login</title>
	    </Head>

	    <Login activationStatus={activationStatus}/>
	</div>
    );
}

export default LoginPage;
