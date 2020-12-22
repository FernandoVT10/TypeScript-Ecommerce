import Head from "next/head"

import withAuth from "@/hoc/withAuth";
import Orders from "@/domain/Dashboard/Management/Orders";

const OrdersPage = () => {
    return (
	<div>
	    <Head>
	    	<title>Orders Management - TypeScript Ecommerce</title>
	    </Head>

	    <Orders/>
	</div>
    );
}

export default withAuth( OrdersPage, "ADMIN");
