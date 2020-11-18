import Head from "next/head";

import Register from "@/domain/Register";

function RegisterPage() {
    return (
	<div>
	    <Head>
	    	<title>TypeScript Ecommerce - Register</title>
	    </Head>

	    <Register/> 
	</div>
    )
}

export default RegisterPage;
