import Head from "next/head"

import withAuth from "@/hoc/withAuth";
import Products from "@/domain/Dashboard/Management/Products";

const OrdersPage = () => {
    return (
	<div>
	    <Head>
	    	<title>Products Management - TypeScript Ecommerce</title>
	    </Head>

	    <Products/>
	</div>
    );
}

export default withAuth( OrdersPage, "ADMIN");
