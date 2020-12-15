import Head from "next/head"

import Orders from "@/domain/Dashboard/Orders"

import withAuth from "@/hoc/withAuth";

const OrdersPage = () => {
    return (
    	<div>
	    <Head>
		<title>My Orders - TypeScript Ecommerce</title>
	    </Head>

	    <Orders/>
    	</div>
    );
}

export default withAuth(OrdersPage);
