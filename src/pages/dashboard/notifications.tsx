import React from "react";

import { InferGetServerSidePropsType } from "next";
import Head from "next/head";

import Notifications from "@/domain/Dashboard/Notifications";

import withAuth from "@/hoc/withAuth";

const NotificationsPage = () => {
    return (
	<div>
	    <Head>
		<title>Notifications - TypeScript Ecommerce</title>
	    </Head>

	    <Notifications/>
	</div>
    );
}

export default withAuth(NotificationsPage);
