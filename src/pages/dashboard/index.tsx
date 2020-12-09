import React from "react";

import Head from "next/head";

import withAuth from "@/hoc/withAuth";
import Dashboard from "@/domain/Dashboard";

const DashboardPage = () => {
    return (
	<div>
	    <Head>
	    	<title>Dashboard - TypeScript Ecommerce</title>
	    </Head>

	    <Dashboard/>
	</div>
    );
}

export default withAuth(DashboardPage);
